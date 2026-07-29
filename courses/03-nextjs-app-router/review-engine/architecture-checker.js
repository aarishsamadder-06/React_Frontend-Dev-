import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';

const traverse = _traverse.default || _traverse;

export async function checkArchitecture(challengeMetadata, projectDir) {
  const patternsRequired = challengeMetadata.patternsRequired || [];
  const filesToCheck = challengeMetadata.filesToCheck || [];
  
  if (patternsRequired.length === 0) {
    return { score: 100, passed: true, details: [] };
  }

  const results = {
    score: 0,
    passed: false,
    patternsFound: [],
    patternsMissing: [],
    details: []
  };

  for (const file of filesToCheck) {
    const filePath = join(projectDir, file);
    
    if (!existsSync(filePath)) {
      results.details.push({
        file,
        error: 'File does not exist',
        patternsFound: [],
        patternsMissing: patternsRequired
      });
      continue;
    }

    try {
      const fileContent = readFileSync(filePath, 'utf-8');
      const fileResults = checkFileForPatterns(fileContent, patternsRequired, file);
      
      results.patternsFound.push(...fileResults.patternsFound);
      results.patternsMissing.push(...fileResults.patternsMissing);
      results.details.push({
        file,
        patternsFound: fileResults.patternsFound,
        patternsMissing: fileResults.patternsMissing
      });
    } catch (error) {
      results.details.push({
        file,
        error: error.message,
        patternsFound: [],
        patternsMissing: patternsRequired
      });
    }
  }

  // Score based on unique patterns found across ALL files (not per-file)
  const allFoundPatterns = new Set(results.patternsFound);
  const uniqueFound = patternsRequired.filter(p => allFoundPatterns.has(p)).length;
  results.score = patternsRequired.length > 0
    ? Math.round((uniqueFound / patternsRequired.length) * 100 * 10) / 10
    : 100;
  
  results.passed = results.score >= 80;
  return results;
}

function checkFileForPatterns(content, patternsRequired, fileName) {
  const patternsFound = [];
  const patternsMissing = [];

  const normalizedFileName = fileName.replace(/\\/g, '/');

  try {
    const ast = parse(content, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx', 'decorators-legacy', 'classProperties']
    });

    const foundPatterns = new Set();

    traverse(ast, {
      Directive(path) {
        if (path.node.value.value === 'use client') {
          foundPatterns.add('useClient');
          foundPatterns.add('clientComponent');
        }
      },

      ImportDeclaration(path) {
        if (path.node.source.value === 'next/link') {
          foundPatterns.add('Link');
        }
        if (path.node.source.value === 'next/navigation') {
          foundPatterns.add('navigation');
        }
        if (path.node.source.value === 'react') {
          path.node.specifiers.forEach(spec => {
            if (spec.imported && spec.imported.name === 'useState') {
              foundPatterns.add('useState');
            }
            if (spec.imported && spec.imported.name === 'useEffect') {
              foundPatterns.add('useEffect');
            }
            // Detect Suspense import
            if (spec.imported && spec.imported.name === 'Suspense') {
              foundPatterns.add('Suspense');
            }
          });
        }
      },

      CallExpression(path) {
        if (path.node.callee.name === 'useState') {
          foundPatterns.add('useState');
        }
        if (path.node.callee.name === 'useEffect') {
          foundPatterns.add('useEffect');
        }
        if (path.node.callee.name === 'fetch') {
          foundPatterns.add('fetch');
        }
        if (path.node.callee.name === 'NextResponse') {
          foundPatterns.add('apiRoute');
        }
        if (path.node.callee.object && 
            path.node.callee.object.name === 'Response' &&
            path.node.callee.property &&
            path.node.callee.property.name === 'json') {
          foundPatterns.add('apiRoute');
          foundPatterns.add('ResponseJson');
        }
      },

      // Detect await expressions
      AwaitExpression(path) {
        foundPatterns.add('await');
        if (path.node.argument?.callee?.name === 'fetch') {
          foundPatterns.add('fetch');
        }
      },

      ArrowFunctionExpression(path) {
        if (path.node.async) {
          foundPatterns.add('asyncComponent');
        }
      },

      ExportNamedDeclaration(path) {
        if (path.node.declaration) {
          const decl = path.node.declaration;
          if (decl.id && decl.id.name === 'metadata') {
            foundPatterns.add('metadata');
          }
          // Detect named export GET, POST, PUT, DELETE (route handlers)
          if (decl.id && ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(decl.id.name)) {
            foundPatterns.add('routeHandler');
            foundPatterns.add(decl.id.name);
          }
        }
        path.node.specifiers.forEach(spec => {
          if (spec.exported.name === 'metadata') {
            foundPatterns.add('metadata');
          }
          if (['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(spec.exported.name)) {
            foundPatterns.add('routeHandler');
            foundPatterns.add(spec.exported.name);
          }
        });
      },

      // Detect export default async function (asyncServerComponent)
      ExportDefaultDeclaration(path) {
        const decl = path.node.declaration;
        if (decl && decl.async) {
          foundPatterns.add('asyncComponent');
          const hasUseClient = path.parent.directives?.some(
            d => d.value.value === 'use client'
          );
          if (!hasUseClient) {
            foundPatterns.add('asyncServerComponent');
          }
        }
      },

      // Detect <Suspense> and <form> JSX elements
      JSXElement(path) {
        const elName = path.node.openingElement.name.name;
        if (elName === 'form') {
          foundPatterns.add('formHandling');
        }
        if (elName === 'Suspense') {
          foundPatterns.add('Suspense');
        }
      },

      // MERGED Program visitor - all Program logic in one place
      Program(path) {
        const hasUseClient = path.node.directives?.some(
          d => d.value.value === 'use client'
        );

        if (!hasUseClient && (
          normalizedFileName.includes('page.tsx') ||
          normalizedFileName.includes('layout.tsx')
        )) {
          foundPatterns.add('serverComponent');
        }

        if (normalizedFileName.includes('app/')) {
          foundPatterns.add('appDirectory');
        }

        if (normalizedFileName.includes('page.tsx') ||
            normalizedFileName.includes('layout.tsx')) {
          foundPatterns.add('fileBasedRouting');
        }

        // Detect loading.tsx file
        if (normalizedFileName.includes('loading.tsx')) {
          foundPatterns.add('loadingTsx');
        }
      },

      // MERGED FunctionDeclaration visitor
      FunctionDeclaration(path) {
        if (path.node.async) {
          foundPatterns.add('asyncComponent');
          if (path.node.id?.name?.includes('action') || content.includes('use server')) {
            foundPatterns.add('serverAction');
          }
        }
      },
    });

    for (const pattern of patternsRequired) {
      if (foundPatterns.has(pattern)) {
        patternsFound.push(pattern);
      } else {
        patternsMissing.push(pattern);
      }
    }

  } catch (error) {
    // Fallback: string matching
    for (const pattern of patternsRequired) {
      if (content.includes(pattern) || content.includes(pattern.replace(/([A-Z])/g, '-$1').toLowerCase())) {
        patternsFound.push(pattern);
      } else {
        patternsMissing.push(pattern);
      }
    }
  }

  return { patternsFound, patternsMissing };
}
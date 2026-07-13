#!/usr/bin/env node

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = join(__dirname, '..', '..', '..');
const envPath = join(repoRoot, '.env');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^\s*GROQ_API_KEY\s*=\s*(.+?)\s*$/);
    if (match) {
      process.env.GROQ_API_KEY = match[1].trim().replace(/^["']|["']$/g, '');
      break;
    }
  }
}

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant';

const CODE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

export async function reviewCodeWithAI(challengeId, challengeMetadata, projectDir) {
  const results = {
    challengeId,
    timestamp: new Date().toISOString(),
    score: 0,
    feedback: [],
    strengths: [],
    improvements: [],
    readability: 0,
    maintainability: 0,
    overall: ''
  };

  try {
    const challengeDir = join(projectDir, 'challenges', challengeId);
    const readmePath = join(challengeDir, 'README.md');

    let challengeInstructions = '';
    let challengeRequirements = '';

    if (existsSync(readmePath)) {
      const readmeContent = readFileSync(readmePath, 'utf-8');
      const requirementsMatch = readmeContent.match(/## Technical Requirements(?: \(What Will Be Reviewed\))?/);
      if (requirementsMatch) {
        const splitIndex = requirementsMatch.index;
        challengeInstructions = readmeContent.substring(0, splitIndex).substring(0, 500);
        challengeRequirements = readmeContent.substring(splitIndex).substring(0, 500);
      } else {
        challengeInstructions = readmeContent.substring(0, 500);
      }
    }

    const codeFiles = [];
    const missingFiles = [];

    for (const filePath of challengeMetadata.filesToCheck || []) {
      const fullPath = join(projectDir, filePath);
      if (existsSync(fullPath)) {
        const content = readFileSync(fullPath, 'utf-8');
        if (CODE_EXTENSIONS.includes(extname(fullPath)) && content.trim().length > 0) {
          codeFiles.push({
            file: filePath,
            content: content.substring(0, 2000)
          });
        }
      } else {
        missingFiles.push(filePath);
      }
    }

    const additionalFiles = discoverAdditionalFiles(challengeMetadata, projectDir);
    for (const file of additionalFiles) {
      if (!codeFiles.some(f => f.file === file.file)) {
        codeFiles.push(file);
      }
    }

    if (codeFiles.length === 0) {
      return {
        ...results,
        error: 'No code files found to review. User must create the required files first.',
        score: 0
      };
    }

    if (!GROQ_API_KEY) {
      return {
        ...results,
        error: 'GROQ_API_KEY environment variable not set. AI review skipped.',
        score: 0
      };
    }

    const prompt = buildReviewPrompt(
      challengeId,
      challengeMetadata,
      challengeInstructions,
      challengeRequirements,
      codeFiles,
      missingFiles
    );

    const aiResponse = await callGroqAPI(prompt);
    const parsedResponse = parseAIResponse(aiResponse);

    return {
      ...results,
      ...parsedResponse,
      score: calculateAIScore(parsedResponse)
    };

  } catch (error) {
    return {
      ...results,
      error: error.message,
      score: 0
    };
  }
}

function discoverAdditionalFiles(challengeMetadata, projectDir) {
  const additionalFiles = [];
  const checkedDirs = new Set();

  for (const filePath of challengeMetadata.filesToCheck || []) {
    const dir = dirname(filePath);
    if (!checkedDirs.has(dir)) {
      checkedDirs.add(dir);
      const fullDir = join(projectDir, dir);
      if (existsSync(fullDir)) {
        try {
          const files = readdirSync(fullDir);
          for (const file of files) {
            const fullPath = join(fullDir, file);
            if (statSync(fullPath).isFile() && CODE_EXTENSIONS.includes(extname(file))) {
              const relativePath = join(dir, file).replace(/\\/g, '/');
              if (!challengeMetadata.filesToCheck.includes(relativePath)) {
                try {
                  const content = readFileSync(fullPath, 'utf-8');
                  if (content.trim().length > 0) {
                    additionalFiles.push({
                      file: relativePath,
                      content: content.substring(0, 2000)
                    });
                  }
                } catch (e) {}
              }
            }
          }
        } catch (e) {}
      }
    }
  }

  return additionalFiles;
}

function buildReviewPrompt(challengeId, challengeMetadata, instructions, requirements, codeFiles, missingFiles) {
  const challengeName = challengeMetadata.challengeName || challengeId;
  const skills = challengeMetadata.skills || [];
  const patternsRequired = challengeMetadata.patternsRequired || [];

  const codeContext = codeFiles.map(f =>
    `File: ${f.file}\n\`\`\`typescript\n${f.content}\n\`\`\``
  ).join('\n\n---\n\n');

  const missingFilesNote = missingFiles.length > 0
    ? `\n\n⚠️ NOTE: The following expected files are missing: ${missingFiles.join(', ')}.`
    : '';

  const requirementsSummary = requirements
    ? `\n\n## Technical Requirements:\n${requirements.substring(0, 500)}`
    : '';

  const instructionsSummary = instructions
    ? `\n\n## Challenge Instructions:\n${instructions.substring(0, 500)}`
    : '';

  return `You are an expert RTK Query, Redux Toolkit, and TypeScript code reviewer. Review the implementation for challenge "${challengeName}" (${challengeId}).

## Challenge Context:
- **Skills Focus**: ${skills.join(', ')}
- **Required Patterns**: ${patternsRequired.join(', ')}${instructionsSummary}${requirementsSummary}

## User's Implementation:

${codeContext}${missingFilesNote}

## Output Format (JSON only):

{
  "readability": <number 0-100>,
  "maintainability": <number 0-100>,
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "overall": "<2-3 sentence assessment>",
  "requirementCompliance": <number 0-100>
}`;
}

async function callGroqAPI(prompt) {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an expert RTK Query, Redux Toolkit, and TypeScript code reviewer. Respond only with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 800
    })
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const msg = data?.error?.message || data?.error || response.statusText;
    throw new Error(`Groq API error (${response.status}): ${msg}`);
  }

  const content = data?.choices?.[0]?.message?.content;
  if (content == null || typeof content !== 'string') {
    throw new Error('Groq API returned no content (check model/response shape)');
  }
  return content;
}

function parseAIResponse(response) {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        readability: parsed.readability || 0,
        maintainability: parsed.maintainability || 0,
        strengths: parsed.strengths || [],
        improvements: parsed.improvements || [],
        overall: parsed.overall || '',
        requirementCompliance: parsed.requirementCompliance || 0
      };
    }
  } catch (error) {}

  const readabilityMatch = response.match(/readability[:\s]+(\d+)/i);
  const maintainabilityMatch = response.match(/maintainability[:\s]+(\d+)/i);
  const complianceMatch = response.match(/requirementCompliance[:\s]+(\d+)/i);

  return {
    readability: readabilityMatch ? parseInt(readabilityMatch[1]) : 0,
    maintainability: maintainabilityMatch ? parseInt(maintainabilityMatch[1]) : 0,
    requirementCompliance: complianceMatch ? parseInt(complianceMatch[1]) : 0,
    strengths: extractList(response, /strengths?/i),
    improvements: extractList(response, /improvements?/i),
    overall: response.substring(0, 500)
  };
}

function extractList(text, keyword) {
  const lines = text.split('\n');
  const list = [];
  let inList = false;
  const matchesKeyword = (line) =>
    typeof keyword === 'string'
      ? line.toLowerCase().includes(keyword)
      : keyword.test(line);

  for (const line of lines) {
    if (matchesKeyword(line)) {
      inList = true;
      continue;
    }
    if (inList && (line.trim().startsWith('-') || line.trim().match(/^\d+\./) || line.trim().startsWith('"'))) {
      let item = line.trim().replace(/^[-•\d."]+\s*/, '').replace(/^["']|["']$/g, '');
      if (item) {
        list.push(item);
        if (list.length >= 5) break;
      }
    }
    if (inList && line.trim() === '' && list.length > 0) {
      break;
    }
  }

  return list.length > 0 ? list : [];
}

function calculateAIScore(parsedResponse) {
  const readability = parsedResponse.readability || 0;
  const maintainability = parsedResponse.maintainability || 0;
  const requirementCompliance = parsedResponse.requirementCompliance || 0;

  const score = Math.round(
    (requirementCompliance * 0.4) +
    (readability * 0.3) +
    (maintainability * 0.3)
  );

  return Math.max(0, Math.min(100, score));
}
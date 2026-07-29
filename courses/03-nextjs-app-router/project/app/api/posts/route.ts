interface Post {
  id: number
  title: string
  body: string
  userId: number
}

const posts: Post[] = [
  { id: 1, userId: 1, title: 'First Post', body: 'This is the first post body.' },
  { id: 2, userId: 1, title: 'Second Post', body: 'This is the second post body.' },
  { id: 3, userId: 2, title: 'Third Post', body: 'This is the third post body.' },
]

export async function GET() {
  return Response.json(posts)
}

export async function POST(request: Request) {
  const body = await request.json()
  const newPost: Post = {
    id: posts.length + 1,
    userId: body.userId ?? 1,
    title: body.title ?? 'Untitled',
    body: body.body ?? '',
  }
  posts.push(newPost)
  return Response.json(newPost, { status: 201 })
}
import { Suspense } from 'react'
import Loading from './loading'

interface Post {
  id: number
  title: string
  body: string
}

async function PostsList() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts')
  const posts: Post[] = await res.json()

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </li>
      ))}
    </ul>
  )
}

export default async function PostsPage() {
  return (
    <main>
      <h1>Posts</h1>
      <Suspense fallback={<Loading />}>
        <PostsList />
      </Suspense>
    </main>
  )
}
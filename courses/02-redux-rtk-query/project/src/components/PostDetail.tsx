import { useGetPostByIdQuery } from '../api/apiSlice'

interface PostDetailProps {
  postId?: number
}

export default function PostDetail({ postId = 1 }: PostDetailProps) {
  const { data: post, isLoading, isError } = useGetPostByIdQuery(postId, { skip: !postId })

  if (isLoading) {
    return <div data-testid="post-detail-loading">Loading post...</div>
  }

  if (isError || !post) {
    return <div data-testid="post-detail-error">Error loading post.</div>
  }

  return (
    <div data-testid="post-detail">
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      <p>User ID: {post.userId}</p>
    </div>
  )
}
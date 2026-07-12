import { useGetPostByIdQuery } from '../api/apiSlice'

interface PostDetailProps {
  postId?: number
}

export default function PostDetail({ postId = 1 }: PostDetailProps) {
  const { data: post, isLoading, isError } = useGetPostByIdQuery(postId)

  if (isLoading) return <p>Loading...</p>
  if (isError || !post) return <p>Error loading post.</p>

  return (
    <div data-testid="post-detail">
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </div>
  )
}
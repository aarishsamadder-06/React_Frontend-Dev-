import { useState } from 'react'
import { useAddPostMutation } from '../api/apiSlice'

export default function AddPostForm() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [addPost, { isLoading }] = useAddPostMutation()

  const handleSubmit = async () => {
    if (!title.trim()) return
    await addPost({ title, body, userId: 1 })
    setTitle('')
    setBody('')
  }

  return (
    <div data-testid="add-post-form">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body" />
      <button type="button" data-testid="add-post-submit" onClick={handleSubmit} disabled={isLoading}>
        Add Post
      </button>
    </div>
  )
}
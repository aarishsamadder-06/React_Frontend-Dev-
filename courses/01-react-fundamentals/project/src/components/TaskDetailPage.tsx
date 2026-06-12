import { useNavigate, useParams } from 'react-router-dom'

export default function TaskDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <div id="task-detail">
      <button id="task-detail-back" onClick={() => navigate(-1)}>
        Back
      </button>
      <h2>Task Detail</h2>
      <p>Task ID: {id}</p>
    </div>
  )
}
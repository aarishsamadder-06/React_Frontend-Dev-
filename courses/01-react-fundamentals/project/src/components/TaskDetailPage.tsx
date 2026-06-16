import { useNavigate, useParams } from "react-router-dom";
import type { Task } from "./TaskList";

const STORAGE_KEY = "task-app-tasks";

function getTaskById(
  id: string | undefined
): Task | undefined {
  if (!id) return undefined;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return undefined;
    const tasks: Task[] = JSON.parse(stored);
    return tasks.find(
      (t) => String(t.id) === String(id)
    );
  } catch {
    return undefined;
  }
}

export default function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const task = getTaskById(id);

  return (
    <div id="task-detail">
      <button
        id="task-detail-back"
        onClick={() => navigate(-1)}
      >
        Back
      </button>

      {task ? (
        <>
          <h2 id="task-detail-title">
            {task.title}
          </h2>
          <p id="task-detail-description">
            {task.description}
          </p>
          <p id="task-detail-priority">
            Priority: {task.priority}
          </p>
          <p id="task-detail-status">
            Status:{" "}
            {task.completed
              ? "Completed"
              : "Active"}
          </p>
        </>
      ) : (
        <p id="task-detail-not-found">
          Task not found
        </p>
      )}
    </div>
  );
}
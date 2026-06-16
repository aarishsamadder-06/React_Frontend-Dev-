import TaskCard from "./TaskCard";

export interface Task {
  id: string | number;
  title: string;
  description: string;
  priority: string;
  completed: boolean;
  category: string;
  tags: string[];
}

interface TaskListProps {
  tasks?: Task[];
  countText?: string;
  onToggle?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;

  onUpdateTask?: (
    id: string | number,
    updates: {
      title: string;
      description: string;
      priority: string;
      category: string;
      tags: string[];
    }
  ) => void;

  editingId?: string | number | null;
  setEditingId?: (id: string | number | null) => void;
}

const defaultTasks: Task[] = [
  {
    id: 1,
    title: "Task One",
    description: "Description One",
    priority: "Low",
    completed: false,
    category: "General",
    tags: [],
  },
  {
    id: 2,
    title: "Task Two",
    description: "Description Two",
    priority: "High",
    completed: false,
    category: "Work",
    tags: [],
  },
  {
    id: 3,
    title: "Task Three",
    description: "Description Three",
    priority: "Medium",
    completed: false,
    category: "Personal",
    tags: [],
  },
];

export default function TaskList({
  tasks = defaultTasks,
  countText,
  onToggle,
  onDelete,
  onUpdateTask,
  editingId,
  setEditingId,
}: TaskListProps) {
  const completedCount = tasks.filter((t) => t.completed).length;
  const resolvedCountText = countText ?? `${tasks.length} Tasks`;

  return (
    <div>
      <div id="task-count">
        {resolvedCountText}
        {onToggle !== undefined && (
          <span>
            {" "}· {completedCount} of {tasks.length} completed
          </span>
        )}
      </div>

      <section id="task-list">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            id={task.id}
            title={task.title}
            description={task.description}
            priority={task.priority}
            completed={task.completed}
            category={task.category}
            tags={task.tags}
            onToggle={onToggle}
            onDelete={onDelete}
            onUpdateTask={onUpdateTask}
            editingId={editingId}
            setEditingId={setEditingId}
          />
        ))}
      </section>
    </div>
  );
}
import { useEffect, useState } from "react";
import Button from "./Button";
import Badge from "./Badge";
import StatusIndicator from "./StatusIndicator";
import type { TaskStatus } from "./StatusIndicator";

interface TaskCardProps {
  title: string;
  description: string;
  priority?: string;
  completed?: boolean;
  category?: string;
  tags?: string[];
  dueDate?: string;
  onToggle?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  taskId?: string | number;
  id?: string | number;

  editingId?: string | number | null;
  setEditingId?: (id: string | number | null) => void;

  onUpdateTask?: (
    id: string | number,
    updates: {
      title: string;
      description: string;
      priority: string;
      category: string;
      tags: string[];
      dueDate?: string;
    }
  ) => void;
}

function getDueStatus(
  dueDate: string | undefined,
  completed: boolean | undefined
): TaskStatus | null {
  if (!dueDate || completed) return null;

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const msPerDay = 1000 * 60 * 60 * 24;
  const diffDays = Math.round(
    (due.getTime() - today.getTime()) / msPerDay
  );

  if (diffDays < 0) return "overdue";
  if (diffDays === 0) return "due-today";
  if (diffDays <= 3) return "due-soon";
  return null;
}

function priorityBadgeVariant(
  priority: string
): "priority-low" | "priority-medium" | "priority-high" {
  if (priority === "High") return "priority-high";
  if (priority === "Medium") return "priority-medium";
  return "priority-low";
}

export default function TaskCard({
  title,
  description,
  priority = "Low",
  completed,
  category = "General",
  tags = [],
  dueDate,
  onToggle,
  onDelete,
  taskId,
  id,
  editingId,
  setEditingId,
  onUpdateTask,
}: TaskCardProps) {
  const resolvedId = taskId ?? id ?? 0;
  const isEditing = editingId === resolvedId;

  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);
  const [editPriority, setEditPriority] = useState(priority);
  const [editCategory, setEditCategory] = useState(category);
  const [editTagsInput, setEditTagsInput] = useState(tags.join(", "));
  const [editDueDate, setEditDueDate] = useState(dueDate ?? "");

  useEffect(() => {
    if (isEditing) {
      setEditTitle(title);
      setEditDescription(description);
      setEditPriority(priority);
      setEditCategory(category);
      setEditTagsInput(tags.join(", "));
      setEditDueDate(dueDate ?? "");
    }
  }, [isEditing, title, description, priority, category, tags, dueDate]);

  const handleSave = () => {
    if (!editTitle.trim()) return;

    const parsedTags = editTagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onUpdateTask?.(resolvedId, {
      title: editTitle,
      description: editDescription,
      priority: editPriority,
      category: editCategory,
      tags: parsedTags,
      dueDate: editDueDate ? editDueDate : undefined,
    });

    setEditingId?.(null);
  };

  const handleCancel = () => {
    setEditTitle(title);
    setEditDescription(description);
    setEditPriority(priority);
    setEditCategory(category);
    setEditTagsInput(tags.join(", "));
    setEditDueDate(dueDate ?? "");
    setEditingId?.(null);
  };

  const dueStatus = getDueStatus(dueDate, completed);
  const isOverdue = dueStatus === "overdue";

  return (
    <article
      id="task-card"
      data-completed={completed ? "true" : undefined}
      data-overdue={isOverdue ? "true" : undefined}
      style={{
        background: completed
          ? "#e6ffe6"
          : isOverdue
          ? "#fee2e2"
          : undefined,
        padding: "10px",
        marginBottom: "10px",
      }}
    >
      {onToggle && (
        <input
          type="checkbox"
          checked={!!completed}
          onChange={() => onToggle(resolvedId)}
        />
      )}

      {isEditing ? (
        <>
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />

          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />

          <select
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <select
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
          >
            <option value="General">General</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
          </select>

          <input
            placeholder="Tags (comma-separated)"
            value={editTagsInput}
            onChange={(e) => setEditTagsInput(e.target.value)}
          />

          <input
            type="date"
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
          />

          <Button type="button" variant="primary" onClick={handleSave}>
            Save
          </Button>

          <Button type="button" variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </>
      ) : (
        <>
          <h2
            style={completed ? { textDecoration: "line-through" } : undefined}
          >
            {title}
          </h2>

          <p
            style={completed ? { textDecoration: "line-through" } : undefined}
          >
            {description}
          </p>

          <p>
            Priority:{" "}
            <Badge variant={priorityBadgeVariant(priority)}>
              {priority}
            </Badge>
          </p>

          <p id="task-category">
            Category: <Badge variant="category">{category}</Badge>
          </p>

          {tags.length > 0 && (
            <div id="task-tags">
              {tags.map((tag) => (
                <Badge key={tag} variant="tag" dataValue={tag}>
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {dueDate && (
            <p id="task-due-date">
              Due: {new Date(dueDate).toLocaleDateString()}
              {dueStatus && <StatusIndicator status={dueStatus} />}
            </p>
          )}

          {completed && <StatusIndicator status="completed" />}

          {setEditingId && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => setEditingId(resolvedId)}
            >
              Edit
            </Button>
          )}

          {onDelete && (
            <Button
              type="button"
              variant="danger"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to delete this task?"
                  )
                ) {
                  onDelete(resolvedId);
                }
              }}
            >
              Delete
            </Button>
          )}
        </>
      )}
    </article>
  );
}
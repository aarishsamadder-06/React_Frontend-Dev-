import { useEffect, useState } from "react";

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

// Returns 'overdue' | 'today' | 'soon' | null based on due date vs now
function getDueStatus(
  dueDate: string | undefined,
  completed: boolean | undefined
): "overdue" | "today" | "soon" | null {
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
  if (diffDays === 0) return "today";
  if (diffDays <= 3) return "soon";
  return null;
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

          <button type="button" onClick={handleSave}>
            Save
          </button>

          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
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

          <p>Priority: {priority}</p>

          <p id="task-category">Category: {category}</p>

          {tags.length > 0 && (
            <div id="task-tags">
              {tags.map((tag) => (
                <span
                  key={tag}
                  data-tag={tag}
                  style={{
                    display: "inline-block",
                    background: "#dbeafe",
                    borderRadius: "9999px",
                    padding: "2px 8px",
                    marginRight: "4px",
                    fontSize: "0.75rem",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {dueDate && (
            <p
              id="task-due-date"
              style={{
                color:
                  dueStatus === "overdue"
                    ? "#dc2626"
                    : dueStatus === "today"
                    ? "#d97706"
                    : dueStatus === "soon"
                    ? "#ca8a04"
                    : undefined,
                fontWeight:
                  dueStatus === "overdue" ? "bold" : undefined,
              }}
            >
              Due: {new Date(dueDate).toLocaleDateString()}
              {dueStatus === "overdue" && " (Overdue)"}
              {dueStatus === "today" && " (Due Today)"}
              {dueStatus === "soon" && " (Due Soon)"}
            </p>
          )}

          {setEditingId && (
            <button
              type="button"
              onClick={() => setEditingId(resolvedId)}
            >
              Edit
            </button>
          )}

          {onDelete && (
            <button
              type="button"
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
            </button>
          )}
        </>
      )}
    </article>
  );
}
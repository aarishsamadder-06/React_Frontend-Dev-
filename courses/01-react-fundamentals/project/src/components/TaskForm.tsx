import { useState } from "react";

interface Task {
  id: string | number;
  title: string;
  description: string;
  priority: string;
  completed: boolean;
  category: string;
  tags: string[];
  dueDate?: string;
}

interface TaskFormProps {
  onAddTask: (task: Task) => void;
  existingCategories?: string[];
}

export default function TaskForm({
  onAddTask,
  existingCategories = [],
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [category, setCategory] = useState("General");
  const [tagsInput, setTagsInput] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  const categoryOptions = [
    "General",
    "Work",
    "Personal",
    ...existingCategories.filter(
      (c) => !["General", "Work", "Personal"].includes(c)
    ),
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setError("");

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onAddTask({
      id: Date.now(),
      title,
      description,
      priority,
      completed: false,
      category,
      tags,
      dueDate: dueDate ? dueDate : undefined,
    });

    setTitle("");
    setDescription("");
    setPriority("Low");
    setCategory("General");
    setTagsInput("");
    setDueDate("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="task-title">Title</label>
      <input
        id="task-title"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label htmlFor="task-description">Description</label>
      <textarea
        id="task-description"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label htmlFor="task-priority">Priority</label>
      <select
        id="task-priority"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <label htmlFor="task-category">Category</label>
      <select
        id="task-category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {categoryOptions.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <label htmlFor="task-tags">Tags (comma-separated)</label>
      <input
        id="task-tags"
        type="text"
        placeholder="e.g. urgent, frontend, bug"
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
      />

      <label htmlFor="task-due-date-input">Due Date</label>
      <input
        id="task-due-date-input"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      {error && <p id="task-form-error">{error}</p>}

      <button type="submit">Add Task</button>
    </form>
  );
}
import { useState, useEffect } from "react";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import FilterBar from "./FilterBar";
import type { Task } from "./TaskList";

interface TaskAppProps {
  tasks: Task[];
  setTasks?: React.Dispatch<React.SetStateAction<Task[]>>;
  showForm?: boolean;
  onDelete?: (id: string | number) => void;
  showFilterBar?: boolean;
}

export default function TaskApp({
  tasks,
  setTasks,
  showForm,
  onDelete,
  showFilterBar,
}: TaskAppProps) {
  const [filter, setFilter] = useState<
    "all" | "active" | "completed"
  >("all");

  const [sortOrder, setSortOrder] =
    useState("recent");

  // Raw input value — updates immediately on keystroke
  const [searchText, setSearchText] =
    useState("");

  // Debounced value — drives actual filtering
  const [debouncedSearch, setDebouncedSearch] =
    useState("");

  const [editingId, setEditingId] = useState<
    string | number | null
  >(null);

  // Debounce effect: wait 300ms after typing stops before updating filter
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 300);

    // Cleanup: cancel pending timeout when searchText changes or component unmounts
    return () => {
      clearTimeout(timer);
    };
  }, [searchText]);

  // True while the user has typed but the debounced value hasn't caught up yet
  const isSearching = searchText !== debouncedSearch;

  function handleAddTask(task: Task) {
    if (setTasks) {
      setTasks((prev) => [...prev, task]);
    }
  }

  function handleToggle(id: string | number) {
    if (!setTasks) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function handleUpdateTask(
    id: string | number,
    updates: {
      title: string;
      description: string;
      priority: string;
    }
  ) {
    if (!setTasks) return;

    if (!updates.title.trim()) {
      return;
    }

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      )
    );

    setEditingId(null);
  }

  function handleClearSearch() {
    setSearchText("");
    setDebouncedSearch("");
  }

  // Filter by status
  const statusFiltered =
    filter === "all"
      ? tasks
      : filter === "active"
      ? tasks.filter((t) => !t.completed)
      : tasks.filter((t) => t.completed);

  // Filter by debounced search term (not raw input)
  const searchedTasks = statusFiltered.filter((task) => {
    const search = debouncedSearch.toLowerCase();
    return (
      task.title.toLowerCase().includes(search) ||
      task.description.toLowerCase().includes(search)
    );
  });

  // Sort
  const priorityValue: Record<string, number> = {
    High: 3,
    Medium: 2,
    Low: 1,
  };

  const sortedTasks = [...searchedTasks].sort((a, b) => {
    if (sortOrder === "high") {
      return priorityValue[b.priority] - priorityValue[a.priority];
    }
    if (sortOrder === "low") {
      return priorityValue[a.priority] - priorityValue[b.priority];
    }
    if (sortOrder === "alphabetical") {
      return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
    }
    return 0;
  });

  return (
    <div>
      {showForm && (
        <TaskForm onAddTask={handleAddTask} />
      )}

      {showFilterBar && (
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          searchText={searchText}
          onSearchChange={setSearchText}
          onClearSearch={handleClearSearch}
          isSearching={isSearching}
        />
      )}

      <div id="task-count">
        Showing {sortedTasks.length} of {tasks.length} tasks
      </div>

      {sortedTasks.length === 0 ? (
        <div id="filter-empty-message">
          No tasks found
        </div>
      ) : (
        <TaskList
          tasks={sortedTasks}
          onToggle={handleToggle}
          onDelete={onDelete}
          countText={`Showing ${sortedTasks.length} of ${tasks.length} tasks`}
          onUpdateTask={handleUpdateTask}
          editingId={editingId}
          setEditingId={setEditingId}
        />
      )}
    </div>
  );
}
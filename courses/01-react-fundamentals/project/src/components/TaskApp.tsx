import { useState, useEffect, useMemo } from "react";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import FilterBar from "./FilterBar";
import StatsPanel from "./StatsPanel";
import type { Task } from "./TaskList";

interface TaskAppProps {
  tasks: Task[];
  setTasks?: React.Dispatch<React.SetStateAction<Task[]>>;
  showForm?: boolean;
  onDelete?: (id: string | number) => void;
  showFilterBar?: boolean;
  showStatsPanel?: boolean;
}

export default function TaskApp({
  tasks,
  setTasks,
  showForm,
  onDelete,
  showFilterBar,
  showStatsPanel,
}: TaskAppProps) {
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [sortOrder, setSortOrder] = useState("recent");

  // Raw input value — updates immediately on keystroke
  const [searchText, setSearchText] = useState("");
  // Debounced value — drives actual filtering
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Challenge 12: category filter
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [editingId, setEditingId] = useState<string | number | null>(null);

  // Debounce: 300ms after typing stops
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchText]);

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
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function handleUpdateTask(
    id: string | number,
    updates: {
      title: string;
      description: string;
      priority: string;
      category: string;
      tags: string[];
      dueDate?: string;
    }
  ) {
    if (!setTasks) return;
    if (!updates.title.trim()) return;

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

  // Derive unique categories from tasks
  const categories = useMemo(
    () => [...new Set(tasks.map((t) => t.category).filter(Boolean))] as string[],
    [tasks]
  );

  // 1. Status filter
  const statusFiltered =
    filter === "all"
      ? tasks
      : filter === "active"
      ? tasks.filter((t) => !t.completed)
      : tasks.filter((t) => t.completed);

  // 2. Category filter
  const categoryFiltered =
    categoryFilter === "all"
      ? statusFiltered
      : statusFiltered.filter(
          (t) => t.category === categoryFilter
        );

  // 3. Search filter (debounced)
  const searchedTasks = categoryFiltered.filter((task) => {
    const search = debouncedSearch.toLowerCase();
    return (
      task.title.toLowerCase().includes(search) ||
      task.description.toLowerCase().includes(search)
    );
  });

  // 4. Sort
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
    if (sortOrder === "dueDate") {
      // Tasks without a due date sort to the end
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return (
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );
    }
    return 0;
  });

  return (
    <div>
      {showStatsPanel && <StatsPanel tasks={tasks} />}

      {showForm && (
        <TaskForm
          onAddTask={handleAddTask}
          existingCategories={categories}
        />
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
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          categories={categories}
        />
      )}

      <div id="task-count">
        Showing {sortedTasks.length} of {tasks.length} tasks
      </div>

      {sortedTasks.length === 0 ? (
        <div id="filter-empty-message">No tasks found</div>
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
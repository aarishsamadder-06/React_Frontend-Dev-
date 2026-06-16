import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChallengeList from "./components/ChallengeList";
import TaskList from "./components/TaskList";
import TaskApp from "./components/TaskApp";
import TaskDetailPage from "./components/TaskDetailPage";
import FetchDemoView from "./components/FetchDemoView";
import { ThemeProvider } from "./contexts/ThemeContext";
import type { Task } from "./components/TaskList";

const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    title: "First Task",
    description: "Description one",
    priority: "High",
    completed: false,
    category: "General",
    tags: [],
  },
  {
    id: 2,
    title: "Second Task",
    description: "Description two",
    priority: "Medium",
    completed: false,
    category: "Work",
    tags: [],
  },
  {
    id: 3,
    title: "Third Task",
    description: "Description three",
    priority: "Low",
    completed: false,
    category: "Personal",
    tags: [],
  },
  {
    id: 4,
    title: "Fourth Task",
    description: "Description four",
    priority: "Medium",
    completed: false,
    category: "Work",
    tags: [],
  },
  {
    id: 5,
    title: "Fifth Task",
    description: "Description five",
    priority: "High",
    completed: false,
    category: "General",
    tags: [],
  },
];

const STORAGE_KEY = "task-app-tasks";

function normalizeTask(task: Partial<Task>): Task {
  return {
    id: task.id ?? Date.now(),
    title: task.title ?? "",
    description: task.description ?? "",
    priority: task.priority ?? "Low",
    completed: task.completed ?? false,
    category: task.category ?? "General",
    tags: Array.isArray(task.tags) ? task.tags : [],
  };
}

function AppContent() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const storedTasks = localStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        const parsed = JSON.parse(storedTasks);
        if (Array.isArray(parsed)) {
          // Normalize: fill in category/tags for old tasks missing them
          return parsed.map(normalizeTask);
        }
      }
    } catch {}
    return INITIAL_TASKS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const handleDelete = (id: string | number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <BrowserRouter>
      <div className="App">
        <main>
          <Routes>
            <Route path="/" element={<ChallengeList />} />

            <Route path="/challenge/01-static-task-display" element={<TaskList />} />

            <Route path="/challenge/02-dynamic-task-rendering"
              element={<TaskApp tasks={tasks} setTasks={setTasks} showForm={false} />} />

            <Route path="/challenge/03-adding-new-tasks"
              element={<TaskApp tasks={tasks} setTasks={setTasks} showForm />} />

            <Route path="/challenge/04-task-completion-toggle"
              element={<TaskApp tasks={tasks} setTasks={setTasks} showForm />} />

            <Route path="/challenge/05-task-deletion"
              element={<TaskApp tasks={tasks} setTasks={setTasks} showForm onDelete={handleDelete} />} />

            <Route path="/challenge/06-task-filtering"
              element={<TaskApp tasks={tasks} setTasks={setTasks} showForm showFilterBar />} />

            <Route path="/challenge/07-priority-based-sorting"
              element={<TaskApp tasks={tasks} setTasks={setTasks} showForm showFilterBar />} />

            <Route path="/challenge/08-task-editing"
              element={<TaskApp tasks={tasks} setTasks={setTasks} showForm showFilterBar onDelete={handleDelete} />} />

            <Route path="/challenge/09-search-functionality"
              element={<TaskApp tasks={tasks} setTasks={setTasks} showForm showFilterBar onDelete={handleDelete} />} />

            <Route path="/challenge/10-useeffect-local-storage"
              element={<TaskApp tasks={tasks} setTasks={setTasks} showForm showFilterBar onDelete={handleDelete} />} />

            <Route path="/challenge/11-useeffect-debounced-search"
              element={<TaskApp tasks={tasks} setTasks={setTasks} showForm showFilterBar onDelete={handleDelete} />} />

            <Route path="/challenge/12-categories-and-tags"
              element={<TaskApp tasks={tasks} setTasks={setTasks} showForm showFilterBar onDelete={handleDelete} />} />

            <Route path="/challenge/21-react-router"
              element={<TaskApp tasks={tasks} setTasks={setTasks} showForm />} />

            <Route path="/challenge/21-react-router/task/:id" element={<TaskDetailPage />} />

            <Route path="/challenge/22-data-fetching" element={<FetchDemoView />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
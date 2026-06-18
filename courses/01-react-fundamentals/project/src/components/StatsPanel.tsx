import { useMemo } from "react";

interface StatTask {
  completed: boolean;
  priority?: string;
  category?: string;
  dueDate?: string;
}

interface StatsPanelProps {
  tasks?: StatTask[];
  total?: number;
  completed?: number;
}

function isOverdue(task: StatTask): boolean {
  if (!task.dueDate || task.completed) return false;
  const due = new Date(task.dueDate);
  due.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due.getTime() < today.getTime();
}

export default function StatsPanel({
  tasks = [],
  total,
  completed,
}: StatsPanelProps) {
  const stats = useMemo(() => {
    const totalCount = total ?? tasks.length;
    const completedCount =
      completed ?? tasks.filter((t) => t.completed).length;
    const activeCount = totalCount - completedCount;
    const overdueCount = tasks.filter((t) => isOverdue(t)).length;
    const completionPercent =
      totalCount === 0
        ? 0
        : Math.round((completedCount / totalCount) * 100);

    const byCategory: Record<string, number> = {};
    const byPriority: Record<string, number> = {};

    for (const task of tasks) {
      const cat = task.category || "Uncategorized";
      byCategory[cat] = (byCategory[cat] ?? 0) + 1;

      const pri = task.priority || "Unspecified";
      byPriority[pri] = (byPriority[pri] ?? 0) + 1;
    }

    return {
      totalCount,
      completedCount,
      activeCount,
      overdueCount,
      completionPercent,
      byCategory,
      byPriority,
    };
  }, [tasks, total, completed]);

  return (
    <div id="stats-panel">
      <div id="stats-summary">
        <p id="stats-total">Total tasks: {stats.totalCount}</p>
        <p id="stats-completed">
          Completed: {stats.completedCount} ({stats.completionPercent}%)
        </p>
        <p id="stats-active">Active: {stats.activeCount}</p>
        <p id="stats-overdue">Overdue: {stats.overdueCount}</p>
      </div>

      <div
        id="stats-progress-bar"
        role="progressbar"
        aria-valuenow={stats.completionPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{
          background: "#e5e7eb",
          borderRadius: "9999px",
          height: "10px",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "#22c55e",
            height: "100%",
            width: `${stats.completionPercent}%`,
            transition: "width 0.2s ease",
          }}
        />
      </div>

      {Object.keys(stats.byCategory).length > 0 && (
        <div id="stats-by-category">
          <h3>By Category</h3>
          <ul>
            {Object.entries(stats.byCategory).map(([cat, count]) => (
              <li key={cat}>
                {cat}: {count}
              </li>
            ))}
          </ul>
        </div>
      )}

      {Object.keys(stats.byPriority).length > 0 && (
        <div id="stats-by-priority">
          <h3>By Priority</h3>
          <ul>
            {Object.entries(stats.byPriority).map(([pri, count]) => (
              <li key={pri}>
                {pri}: {count}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
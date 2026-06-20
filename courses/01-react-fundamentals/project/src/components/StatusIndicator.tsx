export type TaskStatus =
  | "overdue"
  | "due-today"
  | "due-soon"
  | "completed"
  | "active";

export interface StatusIndicatorProps {
  status?: TaskStatus | string;
}

const statusConfig: Record<
  string,
  { label: string; color: string; background: string }
> = {
  overdue: { label: "Overdue", color: "#991b1b", background: "#fee2e2" },
  "due-today": { label: "Due Today", color: "#92400e", background: "#fef3c7" },
  "due-soon": { label: "Due Soon", color: "#854d0e", background: "#fef9c3" },
  completed: { label: "Completed", color: "#166534", background: "#dcfce7" },
  active: { label: "Active", color: "#1e3a8a", background: "#dbeafe" },
};

export default function StatusIndicator({ status }: StatusIndicatorProps) {
  if (!status) return null;

  const config = statusConfig[status];
  if (!config) return null;

  return (
    <span
      data-status={status}
      style={{
        display: "inline-block",
        color: config.color,
        background: config.background,
        borderRadius: "4px",
        padding: "2px 6px",
        fontSize: "0.75rem",
        fontWeight: 600,
        marginLeft: "4px",
      }}
    >
      {config.label}
    </span>
  );
}
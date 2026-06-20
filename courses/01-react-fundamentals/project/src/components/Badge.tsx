import type { ReactNode } from "react";

export type BadgeVariant =
  | "default"
  | "tag"
  | "category"
  | "priority-low"
  | "priority-medium"
  | "priority-high";

export interface BadgeProps {
  children?: ReactNode;
  variant?: BadgeVariant;
  dataValue?: string;
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  default: { background: "#e5e7eb", color: "#111827" },
  tag: { background: "#dbeafe", color: "#1e3a8a" },
  category: { background: "#ede9fe", color: "#5b21b6" },
  "priority-low": { background: "#dcfce7", color: "#166534" },
  "priority-medium": { background: "#fef9c3", color: "#854d0e" },
  "priority-high": { background: "#fee2e2", color: "#991b1b" },
};

export default function Badge({
  children,
  variant = "default",
  dataValue,
}: BadgeProps) {
  return (
    <span
      data-badge-variant={variant}
      data-tag={dataValue}
      style={{
        ...variantStyles[variant],
        display: "inline-block",
        borderRadius: "9999px",
        padding: "2px 8px",
        marginRight: "4px",
        fontSize: "0.75rem",
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  );
}
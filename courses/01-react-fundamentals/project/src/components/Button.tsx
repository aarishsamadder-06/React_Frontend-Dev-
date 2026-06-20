import type { ReactNode, MouseEvent } from "react";

export type ButtonVariant = "primary" | "secondary" | "danger";

export interface ButtonProps {
  children?: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
  variant?: ButtonVariant;
  disabled?: boolean;
  id?: string;
  dataActive?: boolean;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
  },
  secondary: {
    background: "#e5e7eb",
    color: "#111827",
    border: "none",
  },
  danger: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
  },
};

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  id,
  dataActive,
}: ButtonProps) {
  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      data-variant={variant}
      data-active={dataActive}
      style={{
        ...variantStyles[variant],
        padding: "6px 12px",
        borderRadius: "6px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {children}
    </button>
  );
}
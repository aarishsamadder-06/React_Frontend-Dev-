import type { ChangeEvent } from "react";

export interface FormInputProps {
  id?: string;
  label?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  multiline?: boolean;
}

export default function FormInput({
  id,
  label,
  value = "",
  onChange,
  type = "text",
  placeholder,
  error,
  multiline = false,
}: FormInputProps) {
  return (
    <div>
      {label && <label htmlFor={id}>{label}</label>}

      {multiline ? (
        <textarea
          id={id}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
        />
      )}

      {error && <p id={id ? `${id}-error` : undefined}>{error}</p>}
    </div>
  );
}
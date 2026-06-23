import type { ChangeEvent, Ref } from "react";

export interface FormInputProps {
  id?: string;
  label?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  multiline?: boolean;
  inputRef?: Ref<HTMLInputElement>;
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
  inputRef,
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
          ref={inputRef}
        />
      )}

      {error && <p id={id ? `${id}-error` : undefined}>{error}</p>}
    </div>
  );
}
"use client";

import { useFormStatus } from "react-dom";

interface Props extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  pendingText?: string;
  /** Sicherheitsabfrage vor dem Absenden (z. B. beim Löschen) */
  confirmMessage?: string;
}

export function SubmitButton({
  children,
  pendingText = "Einen Moment …",
  confirmMessage,
  className = "btn-primary",
  onClick,
  ...rest
}: Props) {
  const { pending } = useFormStatus();
  return (
    <button
      {...rest}
      type="submit"
      className={className}
      disabled={pending || rest.disabled}
      aria-disabled={pending || rest.disabled}
      onClick={(e) => {
        if (confirmMessage && !window.confirm(confirmMessage)) {
          e.preventDefault();
          return;
        }
        onClick?.(e);
      }}
    >
      {pending ? pendingText : children}
    </button>
  );
}

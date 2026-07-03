import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = ({ label, className = "", ...props }: InputProps) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="caption text-[var(--color-text-secondary)]">
          {label}
        </label>
      )}
      <input
        className={`px-4 py-2 radius-sm border border-[var(--color-border)] focus-ring bg-[var(--color-surface)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] transition-default ${className}`}
        {...props}
      />
    </div>
  );
};

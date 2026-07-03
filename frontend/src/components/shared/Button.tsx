import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export const Button = ({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "px-4 py-2 radius-md transition-default focus-ring font-medium";

  const variants = {
    primary: "bg-accent text-white hover:bg-[var(--color-accent-hover)]",
    secondary:
      "bg-[var(--color-surface-secondary)] text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)]",
    ghost:
      "bg-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text)]",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

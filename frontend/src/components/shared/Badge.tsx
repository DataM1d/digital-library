export const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="px-2 py-1 radius-xs bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] metadata">
    {children}
  </span>
);

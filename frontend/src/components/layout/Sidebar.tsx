import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-16 border-r border-[var(--color-border)] surface z-[var(--z-sticky)] flex flex-col items-center py-8">
      <Link
        href="/"
        className="w-10 h-10 border border-[var(--color-border)] rounded-sm flex items-center justify-center hover:bg-[var(--color-surface-hover)] transition-default"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      </Link>
    </aside>
  );
}

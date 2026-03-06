export function PostCardSkeleton() {
  return (
    <div className="group space-y-4 animate-pulse">
      <div className="aspect-4/5 w-full rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
      <div className="space-y-2">
        <div className="h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-3 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-3 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}
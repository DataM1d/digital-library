import { CATEGORY_COLORS } from "@/lib/constants";

export function CategoryPill({ name }: { name: string }) {
    const colorClass = CATEGORY_COLORS[name] || "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400";
    
    return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold border border-black/5 dark:border-white/5 shadow-sm transition-colors ${colorClass}`}>
      {name}
    </span>
    );
}
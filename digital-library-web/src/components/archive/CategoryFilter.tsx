"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@/types";

interface CategoryFilterProps {
  categories: Category[];
}


export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";

  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (slug === "all") {
        params.delete("category");
    } else {
        params.set("category", slug);
    }

    params.delete("page");
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <FilterChip 
        label="All Artifacts" 
        active={activeCategory === "all"} 
        onClick={() => handleCategoryChange("all")} 
      />
      {categories.map((cat) => (
        <FilterChip
          key={cat.id}
          label={cat.name}
          active={activeCategory === cat.slug}
          onClick={() => handleCategoryChange(cat.slug)}
        />
      ))}
    </div>
  )
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all border
        ${active 
          ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-lg" 
          : "bg-transparent text-zinc-500 border-zinc-200 hover:border-zinc-800 dark:border-zinc-800 dark:hover:border-zinc-400"
        }`}
    >
      {label}
    </button>
  );
}
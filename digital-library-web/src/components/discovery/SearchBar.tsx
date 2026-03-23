"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchBarProps {
  defaultValue?: string;
  onSearch?: (val: string) => void;
}

export function SearchBar({ defaultValue = "", onSearch }: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);
  const debouncedValue = useDebounce(value, 400);

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedValue);
    }
  }, [debouncedValue, onSearch]);

  return (
    <div className="relative w-full max-w-2xl group">
      <Search 
        className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" 
        size={20} 
      />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="SEARCH THE ARCHIVE..."
        className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl py-5 pl-14 pr-12 text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
      />
      {value && (
        <button 
          onClick={() => setValue("")}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black dark:hover:text-white"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
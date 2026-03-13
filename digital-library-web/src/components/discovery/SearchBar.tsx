"use client";

import { Search, X, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean; // Added for visual feedback
}

export function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [text, setText] = useState("");
  const [debouncedValue] = useDebounce(text, 500);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  const clearSearch = () => {
    setText("");
    onSearch("");
  };
  
  return (
    <div className="relative w-full max-w-xl group">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none transition-colors group-focus-within:text-black dark:group-focus-within:text-white text-zinc-400">
        {isLoading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Search size={18} />
        )}
      </div>

      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Search the archive by title, tag, or content..."
        className="w-full rounded-2xl border border-zinc-200 bg-white py-3.5 pl-12 pr-12 text-sm transition-all 
                   placeholder:text-zinc-400
                   focus:border-zinc-400 focus:ring-4 focus:ring-zinc-500/5 
                   dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-600 dark:focus:ring-white/5 
                   outline-none"
      />
    {text && (
        <button
          onClick={clearSearch}
          type="button"
          aria-label="Clear search"
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-400 hover:text-red-500 transition-colors"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
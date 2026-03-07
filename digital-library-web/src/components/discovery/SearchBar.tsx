"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
    const [text, setText] = useState("");
    const [query] = useDebounce(text, 500);

    useEffect(() => {
        onSearch(query);
    }, [query, onSearch]);

    return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-zinc-400">
        <Search size={18} />
      </div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Search the archive..."
        className="w-full rounded-full border border-zinc-200 bg-white py-2.5 pl-11 pr-11 text-sm outline-none transition-all focus:border-black focus:ring-1 focus:ring-black dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-white dark:focus:ring-white"
      />
      {text && (
        <button
          onClick={() => setText("")}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-400 hover:text-black dark:hover:text-white"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
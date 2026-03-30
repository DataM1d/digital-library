"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue);
  const debouncedValue = useDebounce(value, 500);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isInitialMount = useRef(true);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const currentSearch = searchParams.get("search") || "";
    
    if (debouncedValue !== currentSearch) {
      const params = new URLSearchParams(searchParams.toString());
      
      if (debouncedValue) {
        params.set("search", debouncedValue);
      } else {
        params.delete("search");
      }
      
      params.delete("page");
      
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [debouncedValue, pathname, router, searchParams]);

  const handleClear = () => {
    setValue("");
  };

  return (
    <div className="relative w-full max-w-2xl group" role="search">
      <Search 
        className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors pointer-events-none" 
        size={20} 
      />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && handleClear()}
        placeholder="SEARCH THE ARCHIVE..."
        className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl py-5 pl-14 pr-12 text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
      />
      {value && (
        <button 
          type="button" 
          onClick={handleClear}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black dark:hover:text-white p-1 transition-colors"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
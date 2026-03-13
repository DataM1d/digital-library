"use client";

import { usePosts } from "@/hooks/usePosts";
import { PostCard } from "@/components/posts/PostCard";
import { SearchBar } from "./SearchBar";
import { Loader2 } from "lucide-react";

export function DiscoveryFeed() {
  const { 
    posts, 
    page, 
    setPage, 
    meta, 
    isLoading, 
    handleSearch,
    searchQuery 
  } = usePosts({ initialLimit: 8 });

  return (
    <div className="space-y-12">
      <div className="flex flex-col items-center justify-center relative">
        <SearchBar onSearch={handleSearch} />
        
        {isLoading && posts.length > 0 && (
          <div className="absolute -bottom-8 flex items-center gap-2">
            <Loader2 className="animate-spin text-zinc-400" size={16} />
            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-black">
              Syncing Archive
            </span>
          </div>
        )}
      </div>

    {isLoading && posts.length === 0 ? (
        <FeedSkeleton />
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center rounded-[3rem] border-2 border-dashed border-zinc-100 dark:border-zinc-900">
          <p className="text-sm font-black uppercase tracking-widest text-zinc-400">
            {searchQuery 
              ? `No records found for "${searchQuery}"` 
              : "The archive is currently empty"}
          </p>
        </div>
      )}

      {meta && meta.total_pages > 1 && (
        <Pagination 
          current={page} 
          total={meta.total_pages} 
          onPageChange={setPage} 
        />
      )}
    </div>
  );
}

function FeedSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="space-y-4 animate-pulse">
          <div className="aspect-16/10 rounded-3xl bg-zinc-100 dark:bg-zinc-900" />
          <div className="h-3 w-1/4 bg-zinc-100 dark:bg-zinc-900 rounded-full" />
          <div className="h-5 w-full bg-zinc-100 dark:bg-zinc-900 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

interface PaginationProps {
  current: number;
  total: number;
  onPageChange: (page: number) => void;
}

function Pagination({ current, total, onPageChange }: PaginationProps) {
  return (
    <div className="flex justify-center gap-3 pt-12">
      {[...Array(total)].map((_, i) => {
        const pageNum = i + 1;
        const isActive = current === pageNum;
        
        return (
          <button
            key={pageNum}
            onClick={() => {
              onPageChange(pageNum);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`h-12 w-12 rounded-2xl text-xs font-black transition-all shadow-sm ${
              isActive 
              ? "bg-black text-white dark:bg-white dark:text-black scale-110" 
              : "bg-white text-zinc-400 hover:text-black dark:bg-zinc-900 dark:hover:text-white border border-zinc-100 dark:border-zinc-800"
            }`}
          >
            {pageNum.toString().padStart(2, '0')}
          </button>
        );
      })}
    </div>
  );
}
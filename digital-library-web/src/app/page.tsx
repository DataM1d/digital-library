"use client";

import { usePosts } from "@/hooks/usePosts";
import { PostCard } from "@/components/posts/PostCard";
import { PostCardSkeleton } from "@/components/posts/PostCardSkeleton";
import { SearchBar } from "@/components/discovery/SearchBar";

export default function HomePage() {
  const { posts, isLoading, searchQuery, setSearchQuery } = usePosts();

  return (
    <main className="min-h-screen bg-white dark:bg-black px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              The Digital Archive
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">A curated collection of discoveries.</p>
          </div>
          <SearchBar onSearch={setSearchQuery} />
        </header>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <PostCardSkeleton key={i} />)
          ) : posts.length > 0 ? (
            posts.map((post, index) => (
              <PostCard 
                key={post.id} 
                post={post} 
                priority={index < 3} 
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-zinc-500 border-2 border-dashed border-zinc-100 dark:border-zinc-900 rounded-3xl">
              {searchQuery ? (
                <p>
                  No results found for{" "}
                  <span className="text-zinc-900 dark:text-white font-bold underline underline-offset-4">
                    &quot;{searchQuery}&quot;
                  </span>
                </p>
              ) : (
                <p>The archive is empty.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
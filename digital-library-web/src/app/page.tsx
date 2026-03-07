"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Post } from "@/types";
import { PostCard } from "@/components/posts/PostCard";
import { PostCardSkeleton } from "@/components/posts/PostCardSkeleton";
import { SearchBar } from "@/components/discovery/SearchBar";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await api.posts.list({ search: searchQuery });
        setPosts(response.data);
      } catch (err) {
        console.error("Failed to load archive:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, [searchQuery]);

  return (
    <main className="min-h-screen bg-white dark:bg-black px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              The Digital Archive
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              A curated collection of thoughts, designs, and discoveries.
            </p>
          </div>
          
          <SearchBar onSearch={setSearchQuery} />
        </header>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-zinc-500">
              {searchQuery 
                ? `No results found for "${searchQuery}"` 
                : "The archive is currently empty."}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
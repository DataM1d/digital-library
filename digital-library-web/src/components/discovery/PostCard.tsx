"use client";

import Link from "next/link";
import { Post } from "@/types";
import { CategoryPill } from "./CategoryPill";
import { Heart, Calendar, ArrowUpRight } from "lucide-react";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface PostCardProps {
  post: Post;
  priority?: boolean;
}

export function PostCard({ post, priority = false }: PostCardProps) {
  const imageUrl = post.image_url.startsWith("http") 
    ? post.image_url 
    : `${API_URL}${post.image_url}`;

  const formattedDate = new Date(post.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <Link href={`/posts/${post.slug}`} className="group flex flex-col space-y-4">
      <div className="relative aspect-16/10 overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50">
        <ImageWithFallback
          src={imageUrl}
          alt={post.alt_text || post.title}
          blurHash={post.blur_hash}
          fill
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 flex items-center justify-center pointer-events-none">
          <ArrowUpRight 
            className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0" 
            size={32} 
          />
        </div>
      </div>

      <div className="space-y-3 px-1">
        <div className="flex items-center justify-between">
          <CategoryPill name={post.category_name} />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              <Calendar size={12} />
              {formattedDate}
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              <Heart size={12} className={post.like_count > 0 ? "fill-red-500 text-red-500" : ""} />
              {post.like_count}
            </div>
          </div>
        </div>

      <div className="space-y-1.5">
          <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 transition-colors group-hover:text-zinc-500 dark:group-hover:text-zinc-400">
            {post.title}
          </h3>
          <p className="line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
            {post.content}
          </p>
        </div>
      </div>
    </Link>
  );
}
"use client";

import Link from "next/link";
import { Post } from "@/types";
import { ImageWithFallback } from "../ui/ImageWithFallback";
import { Heart, MessageCircle, ArrowUpRight } from "lucide-react";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const imageUrl = post.image_url.startsWith("http")
    ? post.image_url
    : `${backendUrl}${post.image_url}`;

  return (
    <Link href={`/posts/s/${post.slug}`} className="group block">
      <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900">
        <ImageWithFallback
          src={imageUrl}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <div className="absolute top-4 right-4 translate-y-2.5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white">
            <ArrowUpRight size={18} />
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-1 px-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            {post.category_name}
          </span>
          <div className="flex items-center gap-3 text-zinc-400">
            <span className="flex items-center gap-1 text-xs">
              <Heart size={14} className={post.like_count > 0 ? "fill-red-500 text-red-500" : ""} />
              {post.like_count}
            </span>
            <span className="flex items-center gap-1 text-xs">
              <MessageCircle size={14} />
              {post.comments?.length || 0}
            </span>
          </div>
        </div>
        
        <h3 className="line-clamp-1 text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
          {post.title}
        </h3>
        
        <p className="line-clamp-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          {post.meta_description || post.content.substring(0, 100)}
        </p>
      </div>
    </Link>
  );
}
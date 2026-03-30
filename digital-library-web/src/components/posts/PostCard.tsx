"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Blurhash } from "react-blurhash";
import { useBlurLoad } from "@/hooks/useBlurLoad";
import { Post } from "@/types";
import { Heart, MessageCircle, ArrowUpRight } from "lucide-react";

interface PostCardProps {
  post: Post;
  priority?: boolean;
}

export function PostCard({ post, priority = false }: PostCardProps) {
  const { isLoaded, handleLoad, imageClassName } = useBlurLoad();
  
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
  const imageUrl = post.image_url.startsWith("http")
    ? post.image_url
    : `${backendUrl}${post.image_url}`;

  return (
    <Link href={`/posts/${post.slug}`} className="group block">
      <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900">
        {post.blur_hash && !isLoaded && (
          <div className="absolute inset-0 z-10 transition-opacity duration-500">
            <Blurhash
              hash={post.blur_hash}
              width="100%"
              height="100%"
              resolutionX={32}
              resolutionY={32}
              punch={1}
            />
          </div>
        )}

        <Image
          src={imageUrl}
          alt={post.alt_text || post.title}
          fill
          priority={priority}
          onLoad={handleLoad}
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${imageClassName}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <div className="absolute top-4 right-4 -translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl text-white border border-white/20 shadow-2xl">
            <ArrowUpRight size={20} />
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-2 px-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
            {post.category_name}
          </span>
          <div className="flex items-center gap-3 text-zinc-400 font-bold">
            <span className="flex items-center gap-1 text-[11px]">
              <Heart 
                size={14} 
                className={post.user_has_liked ? "fill-red-500 text-red-500" : "transition-colors group-hover:text-zinc-600"} 
              />
              {post.like_count}
            </span>
            <span className="flex items-center gap-1 text-[11px]">
              <MessageCircle size={14} className="transition-colors group-hover:text-zinc-600" />
              {0}
            </span>
          </div>
        </div>
        
        <div>
          <h3 className="line-clamp-1 text-base font-bold tracking-tight text-zinc-900 dark:text-white transition-colors group-hover:text-zinc-500 dark:group-hover:text-zinc-400">
            {post.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400 font-medium">
            {post.meta_description || post.content}
          </p>
        </div>
      </div>
    </Link>
  );
}
"use client";

import { use } from "react";
import { usePostDetail } from "@/hooks/usePostDetail";
import { CategoryPill } from "@/components/discovery/CategoryPill";
import { CommentSection } from "@/components/social/CommentSection";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, Calendar, User, Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const { post, loading, error, likesCount, isLiked, toggleLike } = usePostDetail(slug);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400 dark:text-zinc-600" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-black p-4 text-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          {error || "Artifact not found"}
        </h1>
        <Link href="/" className="text-sm font-medium text-black underline underline-offset-4 dark:text-white">
          Return to Archive
        </Link>
      </div>
    );
  }

  const imageUrl = post.image_url.startsWith("http") 
    ? post.image_url 
    : `${API_URL}${post.image_url}`;

  return (
    <main className="min-h-screen bg-zinc-50 pb-20 dark:bg-black">
      {/* Navigation */}
      <nav className="mx-auto max-w-4xl px-6 py-8">
        <Link 
          href="/" 
          className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Back to Archive
        </Link>
      </nav>

      <article className="mx-auto max-w-4xl px-6">
        <header className="space-y-6 mb-10">
          <div className="flex items-center gap-3">
            <CategoryPill name={post.category_name} />
            <div className="flex items-center gap-1 text-xs text-zinc-500">
              <Calendar size={14} />
              {new Date(post.created_at).toLocaleDateString()}
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {post.title}
          </h1>

          <div className="flex items-center justify-between border-y border-zinc-200 py-4 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                <User size={16} />
              </div>
              <span>Archived by User #{post.created_by}</span>
            </div>

            <button 
              onClick={toggleLike}
              className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-all transform active:scale-95 ${
                isLiked 
                ? "bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800" 
                : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400"
              }`}
            >
              <Heart size={16} className={isLiked ? "fill-current" : ""} />
              <span>{likesCount}</span>
            </button>
          </div>
        </header>

        <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-800 mb-12 shadow-2xl">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="prose prose-zinc dark:prose-invert max-w-none mb-20">
          <p className="text-xl leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        <section className="border-t border-zinc-200 pt-10 dark:border-zinc-800">
          <h3 className="text-2xl font-bold mb-8 text-zinc-900 dark:text-white">Discussion</h3>
          <CommentSection postSlug={slug} />
        </section>
      </article>
    </main>
  );
}
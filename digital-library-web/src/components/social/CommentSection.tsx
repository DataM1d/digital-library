"use client";

import { useState } from "react";
import { useComments } from "@/hooks/useComments";
import { Comment as CommentItem } from "./Comment";
import { Send } from "lucide-react";

export function CommentSection({ postSlug }: { postSlug: string }) {
  const { comments, addComment, isSubmitting, isLoading } = useComments(postSlug);
  const [newComment, setNewComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addComment(newComment);
      setNewComment("");
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-32 bg-zinc-100 dark:bg-zinc-900 rounded-2xl" />
        <div className="space-y-3">
          <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded w-1/4" />
          <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add to the archive discussion..."
          className="w-full min-h-25 rounded-2xl border border-zinc-200 bg-white p-4 text-sm focus:border-black focus:ring-1 focus:ring-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-white dark:focus:ring-white outline-none transition-all resize-none"
        />
        <button
          type="submit"
          disabled={isSubmitting || !newComment.trim()}
          className="absolute bottom-3 right-3 flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800 disabled:bg-zinc-300 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors"
        >
          {isSubmitting ? "Posting..." : <><Send size={14} /> Post</>}
        </button>
      </form>

      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        ) : (
          <p className="text-sm text-zinc-500 text-center py-10">
            No thoughts archived yet. Be the first.
          </p>
        )}
      </div>
    </div>
  );
}
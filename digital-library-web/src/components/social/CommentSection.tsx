"use client";

import { useState } from "react";
import { useComments } from "@/hooks/useComments";
import { Comment as CommentItem } from "./Comment";
import { Send, Loader2, MessageSquareQuote } from "lucide-react";

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
      console.error("Archive submission error:", err);
    }
  };

  if (isLoading) {
    return <CommentSkeleton />;
  }

  return (
    <div className="space-y-12 max-w-3xl">
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <MessageSquareQuote size={18} className="text-zinc-400" />
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
            Discussion Thread
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="relative group">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a thought to the digital record..."
            className="w-full min-h-38 rounded-3xl border border-zinc-200 bg-zinc-50/50 p-6 text-sm 
                       focus:bg-white focus:border-zinc-400 focus:ring-4 focus:ring-zinc-500/5 
                       dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100 dark:focus:bg-zinc-900
                       outline-none transition-all resize-none placeholder:text-zinc-400"
          />
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="absolute bottom-4 right-4 flex items-center gap-2 rounded-2xl bg-black px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white hover:opacity-90 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-500 dark:bg-white dark:text-black transition-all shadow-lg"
          >
            {isSubmitting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Send size={14} />
            )}
            {isSubmitting ? "Syncing..." : "Commit Thought"}
          </button>
        </form>
      </div>

      <div className="space-y-2">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-900 rounded-3xl">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              The archive is silent. Be the first to speak.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function CommentSkeleton() {
  return (
    <div className="space-y-8 animate-pulse max-w-3xl">
      <div className="h-32 bg-zinc-100 dark:bg-zinc-900 rounded-3xl" />
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-900" />
            <div className="flex-1 space-y-3">
              <div className="h-3 bg-zinc-100 dark:bg-zinc-900 rounded w-1/4" />
              <div className="h-16 bg-zinc-100 dark:bg-zinc-900 rounded-2xl w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
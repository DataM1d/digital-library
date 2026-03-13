"use client";

import { PostComment as CommentType } from "@/types";
import { User, CornerDownRight } from "lucide-react";

interface CommentProps {
  comment: CommentType;
  isReply?: boolean;
}

export function Comment({ comment, isReply = false }: CommentProps) {
  const formattedDate = new Date(comment.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  
  
  return (
    <div className={`group flex flex-col space-y-3 transition-all ${
      isReply ? "mt-4 ml-2" : "mt-8"
    }`}>
        <div className="flex items-start gap-4">
            <div className="flex fle-col items-center">
                <div className="flex h-8 2-8 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400 border-zinc-200/50 dark:border-zinc-800/50">
                <User size={16} />
                </div>
                {comment.replies && comment.replies.length > 0 && (
                    <div className="w-px flex-1 bg-zinc-200 dark:bg-zinc-800 my-2" />
                )}
            </div>

            <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-tighter text-zinc-900 dark:text-zinc-100">
              Collector #{comment.user_id}
            </span>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
              • {formattedDate}
            </span>
          </div>

          {comment.replies && comment.replies.length > 0 && (
            <div className="relative pl-2">
              <div className="absolute left-4.5 top-4 text-zinc-300 dark:text-zinc-700">
                <CornerDownRight size={16} />
              </div>
              <div className="space-y-2">
                {comment.replies.map((reply) => (
                  <Comment key={reply.id} comment={reply} isReply={true} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
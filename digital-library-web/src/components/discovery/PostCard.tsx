import React from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowRight, MessageSquare, Hash } from 'lucide-react';

interface PostCardProps {
  post: {
    id: number | string;
    title: string;
    slug: string;
    content: string;
    created_at: string;
    comment_count?: number;
    tags?: string[];
    category_name?: string;
  };
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <article className="group flex flex-col overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white transition-all duration-500 hover:shadow-2xl hover:border-black dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-white">
      <div className="flex flex-1 flex-col p-8">
        <header>
          <div className="mb-4 flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Calendar size={12} strokeWidth={3} />
              {formattedDate}
            </span>
            {post.category_name && (
              <span className="bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded text-black dark:text-white">
                {post.category_name}
              </span>
            )}
          </div>

          <Link href={`/posts/s/${post.slug}`}>
            <h3 className="mb-3 text-2xl font-black leading-tight tracking-tighter text-black transition-colors dark:text-white group-hover:underline decoration-4 underline-offset-4">
              {post.title}
            </h3>
          </Link>
        </header>

        {post.tags && post.tags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/?search=%23${tag}`}
                className="flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
              >
                <Hash size={10} strokeWidth={3} />
                {tag}
              </Link>
            ))}
          </div>
        )}

        <footer className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-6 dark:border-zinc-900">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
            <div className="flex items-center gap-1.5">
              <MessageSquare size={14} strokeWidth={2.5} />
              <span>{post.comment_count ?? 0}</span>
            </div>
          </div>
          
          <Link 
            href={`/posts/s/${post.slug}`}
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-black dark:text-white"
          >
            Access Record
            <ArrowRight size={14} strokeWidth={3} className="transition-transform duration-300 group-hover:translate-x-2" />
          </Link>
        </footer>
      </div>
    </article>
  );
};
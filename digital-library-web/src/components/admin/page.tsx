"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Post } from "@/types";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { 
  Plus, 
  ExternalLink, 
  Pencil, 
  Trash2, 
  Loader2, 
  FileText 
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await api.posts.list({ limit: 100 });
      setPosts(response.data);
    } catch (err) {
      toast.error("Failed to load artifacts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to purge this artifact?")) return;
    try {
      await api.posts.delete(id);
      toast.success("Artifact purged");
      setPosts(posts.filter(p => p.id !== id));
    } catch (err) {
      toast.error("Failed to delete");
      console.error(err);
    }
  };

  const getImageUrl = (url: string) => {
    if (!url) return "/placeholder.jpg";
    return url.startsWith("http") ? url : `${API_URL}${url}`;
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 space-y-12">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Archive Control</h1>
          <p className="text-zinc-500 mt-1">Manage your digital collection and taxonomy.</p>
        </div>
        <Link 
          href="/admin/create" 
          className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-black/5"
        >
          <Plus size={20} />
          New Artifact
        </Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
            <FileText size={16} />
            Stored Artifacts ({posts.length})
          </h2>

          {loading ? (
            <div className="flex py-20 justify-center">
              <Loader2 className="animate-spin text-zinc-300" />
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <div 
                  key={post.id} 
                  className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl group hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden relative border border-zinc-100 dark:border-zinc-700">
                       <Image 
                        src={getImageUrl(post.image_url)} 
                        alt={post.title}
                        fill
                        sizes="56px"
                        className="object-cover transition-transform group-hover:scale-105"
                       />
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{post.title}</h3>
                      <p className="text-xs font-mono text-zinc-500">{post.slug}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link 
                      href={`/posts/${post.slug}`} 
                      target="_blank"
                      className="p-2 text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                    >
                      <ExternalLink size={18} />
                    </Link>
                    <Link 
                      href={`/admin/edit/${post.slug}`} 
                      className="p-2 text-zinc-400 hover:text-blue-500 transition-colors"
                    >
                      <Pencil size={18} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(post.id)}
                      className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-4">
          <CategoryManager />
        </div>
      </div>
    </div>
  );
}
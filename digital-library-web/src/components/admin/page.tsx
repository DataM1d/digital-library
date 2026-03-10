"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Post } from "@/types";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const router = useRouter();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const loadPost = async () => {
            try {
                const data = await api.posts.slug(slug);
                setPost(data);
            } catch (err) {
                toast.error("Artifact not found");
                router.push("/admin");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadPost();
    }, [slug, router]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!post) return;
        
        setIsSaving(true);
        const formData = new FormData(e.currentTarget);
        
        try {
            await api.posts.update(slug, formData);
            toast.success("Artifact updated successfully");
            router.push("/admin");
            router.refresh();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Update failed";
            toast.error(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="animate-spin text-zinc-500" size={32} />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <Link href="/admin" className="flex items-center gap-2 text-zinc-500 hover:text-black mb-8 transition-colors">
                <ArrowLeft size={20} />
                Back to Dashboard
            </Link>

            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Edit Artifact</h1>
                <p className="text-zinc-500 font-mono text-sm mt-1">{post?.slug}</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                    <label className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Title</label>
                    <input 
                        name="title"
                        defaultValue={post?.title}
                        className="w-full px-4 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Content (Markdown)</label>
                    <textarea 
                        name="content"
                        defaultValue={post?.content}
                        rows={12}
                        className="w-full px-4 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-mono text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Visibility Status</label>
                        <select 
                            name="status" 
                            defaultValue={post?.status}
                            className="w-full px-4 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 outline-none appearance-none cursor-pointer"
                        >
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Update Media (Optional)</label>
                        <input 
                            type="file"
                            name="image"
                            accept="image/*"
                            className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-700 text-sm"
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 w-full py-5 bg-black dark:bg-white text-white dark:text-black rounded-3xl font-bold hover:opacity-90 disabled:opacity-50 transition-all shadow-xl shadow-black/5"
                >
                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Push Changes to Archive
                </button>
            </form>
        </div>
    );
}
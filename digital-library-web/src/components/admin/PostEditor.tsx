"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploadZone } from "./ImageUploadZone";
import { TagInput } from "./TagInput";
import { api } from "@/lib/api";
import { Post } from "@/types";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

interface PostEditorProps {
  post: Post;
  isEditing?: boolean;
}

export function PostEditor({ post, isEditing = true }: PostEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>(post.tags || []);
  const [formData, setFormData] = useState({
    title: post.title,
    content: post.content,
    category_id: post.category_id.toString(),
    alt_text: post.alt_text || "",
    status: post.status as "published" | "draft",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const data = new FormData();
    if (imageFile) data.append("image", imageFile);
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("category_id", formData.category_id);
    data.append("alt_text", formData.alt_text);
    data.append("status", formData.status);
    
    tags.forEach((tag) => data.append("tags", tag));

    try {
      if (isEditing) {
        await api.posts.update(post.slug, data);
        toast.success("Artifact updated!");
      } else {
        await api.posts.create(data);
        toast.success("New artifact archived!");
      }
      
      router.push("/admin");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div className="lg:col-span-5 space-y-8">
        <div className="space-y-2">
          <label className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Artifact Media
          </label>
          <ImageUploadZone 
            key={post.image_url} 
            onFileSelect={setImageFile} 
            defaultValue={post.image_url} 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Taxonomy
          </label>
          <TagInput tags={tags} setTags={setTags} />
        </div>

        <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4 block">
            Publication Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as "published" | "draft" })}
            className="w-full bg-transparent font-medium outline-none cursor-pointer text-zinc-900 dark:text-zinc-100"
          >
            <option value="published">Published (Visible)</option>
            <option value="draft">Draft (Hidden)</option>
          </select>
        </div>
      </div>

      <div className="lg:col-span-7 space-y-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Title</label>
            <input
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full text-3xl font-bold bg-transparent border-b border-zinc-200 dark:border-zinc-800 outline-none focus:border-black dark:focus:border-white transition-all pb-2"
              placeholder="Archive Title..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Content</label>
            <textarea
              required
              rows={12}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all resize-none font-serif text-lg"
              placeholder="Describe the artifact..."
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Category</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 outline-none appearance-none"
              >
                <option value="1">Architecture</option>
                <option value="2">Minimalism</option>
                <option value="3">Photography</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Alt Text</label>
              <input
                value={formData.alt_text}
                onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                className="w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 outline-none"
                placeholder="Accessibility description"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-3 w-full py-5 bg-black dark:bg-white text-white dark:text-black rounded-3xl font-bold hover:opacity-90 disabled:opacity-50 transition-all shadow-xl shadow-black/10"
        >
          {saving ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Save size={20} />
          )}
          {isEditing ? "Sync Changes" : "Commit to Archive"}
        </button>
      </div>
    </form>
  );
}
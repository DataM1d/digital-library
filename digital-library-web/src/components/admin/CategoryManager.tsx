"use client";

import { useState, useEffect } from "react";
import { api, CategorySchema } from "@/lib/api";
import { z } from "zod";
import { Plus, Trash2, Tag, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Category = z.infer<typeof CategorySchema>;


export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

    const loadingCategories = async () => {
        try {
            const data = await api.posts.categories();
            setCategories(data);
        } catch  {
            toast.error("Failed to sync categories");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadingCategories();
    }, []);

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;

        setIsSubmitting(true);
        try {
           await api.admin.createCategory(newName);
           setNewName("");
           toast.success("New category archived");
           await loadingCategories();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Archive rejection";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = confirm("Are you sure? This may affect linked artifacts.");
        if (!confirmDelete) return;

        try {
            await api.admin.deleteCategory(id);
            toast.success("Category purged");
            setCategories(categories.filter((c) => c.id !== id));
        } catch (error: unknown) {
            toast.error("Cannot delete category with active links");
            console.error(error)
        }
    };

    return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-zinc-100 dark:border-zinc-900">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Tag size={18} className="text-zinc-400" />
          Taxonomy Manager
        </h3>
        <p className="text-sm text-zinc-500 mt-1">Add or remove artifact classifications.</p>
      </div>

      <div className="p-6 space-y-6">
        <form onSubmit={handleAddCategory} className="flex gap-2">
          <input
            type="text"
            placeholder="New category name..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
          />
          <button
            type="submit"
            disabled={isSubmitting || !newName.trim()}
            className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl font-bold hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
            Add
          </button>
        </form>

        <div className="space-y-2">
          {loading ? (
            <div className="flex justify-center py-4 text-zinc-400">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 group hover:border-zinc-300 dark:hover:border-zinc-600 transition-all"
              >
                <div>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">{cat.name}</span>
                  <span className="ml-2 text-xs font-mono text-zinc-500">{cat.slug}</span>
                </div>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


"use client";

import { use, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Post } from "@/types";
import { PostEditor } from "@/components/admin/PostEditor";


export default function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [post, setPost] = useState<Post | null>(null);

    useEffect(() => {
        api.posts.slug(slug).then(setPost);
    }, [slug]);

    if (!post) return <div className="p-20 text-center font-mono">Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto py-12 px-6">
            <header className="mb-10">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">Edit Artifact</h1>
            </header>
            <PostEditor post={post} />
        </div>
    );
}
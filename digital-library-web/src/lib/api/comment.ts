import { request } from "./client";
import { PostComment } from "@/types";

export const commentApi = {
  getByPost: (slug: string) => 
    request<PostComment[]>(`/posts/s/${slug}/comments`),
    
  create: (slug: string, content: string, parentId?: number) => 
    request<PostComment>(`/posts/s/${slug}/comments`, {
      method: "POST",
      body: JSON.stringify({ content, parent_id: parentId })
    }),
};
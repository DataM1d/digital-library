import { z } from "zod";
import axios from "axios";
import { 
  PaginatedResponse, 
  Post, 
  AuthResponse, 
  LoginCredentials, 
  RegisterPayload,
  PostComment 
} from "@/types";

export const UserSchema = z.object({
  id: z.number(),
  username: z.string().min(1),
  email: z.string().email(),
  role: z.enum(["user", "admin"]).default("user"),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  slug: z.string(),
});

export const AuthResponseSchema = z.object({
  token: z.string(),
  user: UserSchema,
});

export const PostSchema = z.object({
  id: z.number(),
  created_by: z.number(),
  category_id: z.number(),
  last_modified_by: z.number(),
  like_count: z.number().default(0),
  title: z.string(),
  content: z.string(),
  image_url: z.string(),
  blur_hash: z.string().default(""),
  alt_text: z.string().default(""),
  slug: z.string(),
  status: z.enum(["published", "draft"]).default("published"),
  category_name: z.string(),
  tags: z.array(z.string()).default([]),
  created_at: z.string(),
  updated_at: z.string(),
  meta_description: z.string().optional(),
  og_image: z.string().optional(),
});

export const PaginatedPostSchema = z.object({
  data: z.array(PostSchema).nullable().transform((val) => val ?? []),
  meta: z.object({
    current_page: z.number(),
    limit: z.number(),
    total_items: z.number(),
    total_pages: z.number(),
  }),
});

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function request<T>(
    endpoint: string, 
    options: RequestInit = {}, 
    schema?: z.ZodSchema<T>
): Promise<T> {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers = new Headers(options.headers);

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    if (!(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
    }

    const response = await fetch(`${BASE_URL}/api${endpoint}`, { ...options, headers });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Something went wrong");
    }

    if (response.status === 204) return {} as T; 
    const data = await response.json();
    return schema ? schema.parse(data) : data;
}

export const api = {
  posts: {
    list: (params: { search?: string; page?: number; limit?: number } = {}) => {
        const queryParams = new URLSearchParams();
        if (params.search) queryParams.append("search", params.search);
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
    
        const qs = queryParams.toString();
        return request(`/posts/${qs ? `?${qs}` : ""}`, {}, PaginatedPostSchema);
    },
    create: (formData: FormData) => 
        request<Post>("/admin/posts", { method: "POST", body: formData }, PostSchema),
    createWithProgress: async (formData: FormData, onProgress: (percent: number) => void) => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const response = await axios.post(`${BASE_URL}/api/admin/posts`, formData, {
            headers: { Authorization: `Bearer ${token}` },
            onUploadProgress: (progressEvent) => {
                const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
                onProgress(percent);
            },
        });
        return PostSchema.parse(response.data);
    },
    update: (slug: string, formData: FormData) => 
        request<Post>(`/admin/posts/${slug}`, {
            method: "PUT",
            body: formData,
        }, PostSchema),
    delete: (slugOrId: string | number) => 
        request<{message: string}>(`/admin/posts/${slugOrId}`, {
            method: "DELETE"
        }),
    slug: (slug: string) => request<Post>(`/posts/s/${slug}`, {}, PostSchema),
    like: (id: number) => request<{liked: boolean}>(`/user/posts/like/${id}`, { method: "POST" }),
    categories: () => request<z.infer<typeof CategorySchema>[]>("/posts/categories", {}, z.array(CategorySchema)),
  },
  comments: {
    getByPost: (slug: string) => request<PostComment[]>(`/posts/s/${slug}/comments`),
    create: (slug: string, content: string, parentId?: number) => 
      request<PostComment>(`/posts/s/${slug}/comments`, {
        method: "POST",
        body: JSON.stringify({ content, parent_id: parentId })
      }),
  },
  admin: {
    createCategory: (name: string) => 
        request<z.infer<typeof CategorySchema>>("/admin/categories", {
            method: "POST",
            body: JSON.stringify({ name })
        }, CategorySchema),
    deleteCategory: (id: number) => 
        request<{message: string}>(`/admin/categories/${id}`, {
            method: "DELETE"
        }),
  },
  auth: {
    login: (credentials: LoginCredentials) => request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(credentials) }, AuthResponseSchema),
    register: (payload: RegisterPayload) => request<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(payload) }, AuthResponseSchema),
  }
};
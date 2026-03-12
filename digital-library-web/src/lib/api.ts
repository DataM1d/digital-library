import { postsApi } from "./api/posts";
import { authApi } from "./api/auth";
import { adminApi } from "./api/admin";
import { commentApi } from "./api/comment";

export const api = {
  posts: postsApi,
  auth: authApi,
  admin: adminApi,
  comments: commentApi
}

export * from "./api/schemas";

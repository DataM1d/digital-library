import { request } from "./client";
import { CategorySchema } from "./schemas";

export const adminApi = {
  createCategory: (name: string) => 
    request("/admin/categories", { method: "POST", body: JSON.stringify({ name }) }, CategorySchema),
  deleteCategory: (id: number) => 
    request<{message: string}>(`/admin/categories/${id}`, { method: "DELETE" }),
};
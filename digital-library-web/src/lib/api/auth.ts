import { request } from "./client";
import { AuthResponseSchema } from "./schemas";
import { LoginCredentials, RegisterPayload, AuthResponse } from "@/types";

export const authApi = {
  login: (credentials: LoginCredentials) => 
    request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(credentials) }, AuthResponseSchema),
  register: (payload: RegisterPayload) => 
    request<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(payload) }, AuthResponseSchema),
};
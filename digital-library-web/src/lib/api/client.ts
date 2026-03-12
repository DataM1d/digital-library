import { z } from "zod";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function request<T>(
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
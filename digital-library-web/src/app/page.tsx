"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function HomePage() {
  const { user, logout, isAuthenticated, loading } = useAuth();

  if (loading) return <div className="flex min-h-screen items-center justify-center dark:bg-black text-white">Loading...</div>;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4 dark:bg-black">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Digital Library
        </h1>
        
        {isAuthenticated ? (
          <div className="space-y-4">
            <p className="text-zinc-600 dark:text-zinc-400">
              Welcome back, <span className="font-semibold text-black dark:text-white">{user?.username}</span>
            </p>
            <button
              onClick={logout}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-zinc-600 dark:text-zinc-400">
              Please sign in or create an account to access the archive.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="inline-block rounded-lg bg-black px-6 py-2 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="inline-block rounded-lg border border-zinc-300 bg-white px-6 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-transparent dark:text-white dark:hover:bg-zinc-900 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
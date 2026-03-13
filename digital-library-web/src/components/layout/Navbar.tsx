"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Library, Plus, LogOut, User as UserIcon, LayoutDashboard } from "lucide-react";

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-100 bg-white/70 backdrop-blur-xl dark:border-zinc-900 dark:bg-zinc-950/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        
        <Link 
          href="/" 
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black dark:bg-white text-white dark:text-black">
            <Library size={18} strokeWidth={2.5} />
          </div>
          <span className="text-sm font-black tracking-tighter uppercase sm:inline hidden">
            Digital Archive
          </span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-8">
          <Link 
            href="/" 
            className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Discovery
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-4 sm:gap-6">
              <Link 
                href="/admin" 
                className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <LayoutDashboard size={14} />
                Dashboard
              </Link>

              <Link 
                href="/admin/create" 
                className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-all shadow-lg shadow-black/5"
              >
                <Plus size={14} strokeWidth={3} />
                <span className="hidden md:inline">Artifact</span>
              </Link>

              <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />

              <div className="flex items-center gap-3">
                <div className="hidden flex-col items-end xs:flex">
                  <span className="text-[9px] font-black uppercase tracking-tighter leading-none text-zinc-400">
                    Collector
                  </span>
                  <span className="text-xs font-bold text-zinc-900 dark:text-white">
                    {user?.username}
                  </span>
                </div>
                
                <button
                  onClick={logout}
                  className="group flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-red-200 dark:hover:border-red-900 transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={16} className="text-zinc-400 group-hover:text-red-500 transition-colors" />
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-xl bg-black px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:opacity-90 dark:bg-white dark:text-black transition-all shadow-xl shadow-black/10"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
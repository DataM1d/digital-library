"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuthInternal } from "@/hooks/useAuthInternal";
import { UploadModal } from "@/components/modals/UploadModal";

export function HeaderNavbar() {
  const { user } = useAuthInternal();
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <header className="surface border-b border-[var(--color-border)] sticky top-0 z-[var(--z-sticky)] transition-default">
      <div className="page flex items-center justify-between h-[var(--header-height)]">
        <Link href="/" className="flex items-center group shrink-0">
          <div className="relative w-10 h-6 flex items-center justify-center">
            <Image
              src="/svg/logo.svg"
              alt="Archive Mark"
              fill
              priority
              className="object-contain"
            />
          </div>
          <span className="subheading ml-3 tracking-[0.02em] uppercase text-[var(--color-text)]">
            ARCHIVE
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          {user?.role === "admin" && (
            <button
              onClick={() => setIsUploadOpen(true)}
              className="metadata text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-default cursor-pointer"
            >
              + Add Post
            </button>
          )}

          {user?.role === "admin" && (
            <div className="h-4 w-[1px] bg-[var(--color-border)]" />
          )}

          <Link
            href={user ? "/admin" : "/login"}
            className="flex items-center gap-2 metadata text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-default"
          >
            {user ? user.username : "Login"}
            <div className="relative w-4 h-4">
              <Image
                src="/svg/user.svg"
                alt="User"
                fill
                className="object-contain"
              />
            </div>
          </Link>
        </nav>

        <UploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
        />
      </div>
    </header>
  );
}

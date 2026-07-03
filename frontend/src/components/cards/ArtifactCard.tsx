"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Artifact } from "@/types";

interface ArtifactCardProps {
  artifact: Artifact;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export function ArtifactCard({ artifact }: ArtifactCardProps) {
  const imageUrl = artifact.imageUrl?.startsWith("http")
    ? artifact.imageUrl
    : `${API_URL}${artifact.imageUrl}`;

  return (
    <div className="w-full break-inside-avoid">
      <Link
        href={`/posts/${artifact.slug}`}
        className="group block relative rounded-md overflow-hidden bg-[var(--color-surface-secondary)]"
      >
        <div className="image-hover">
          <Image
            src={imageUrl}
            alt={artifact.title}
            width={600}
            height={800}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="w-full h-auto transition-transform duration-500"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
          <div className="border-b border-[var(--color-border)] pb-3 mb-3">
            <span className="metadata text-[var(--color-text-muted)] block mb-1">
              {artifact.category}
            </span>
            <h3 className="subheading text-[var(--color-text)] leading-tight truncate">
              {artifact.title}
            </h3>
          </div>

          <p className="body text-[var(--color-text-secondary)] line-clamp-3">
            {artifact.snippet}
          </p>
        </div>
      </Link>
    </div>
  );
}

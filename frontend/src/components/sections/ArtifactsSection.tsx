"use client";

import React, { useRef } from "react";
import { mapPostToArtifact } from "@/utils/adapter";
import { FilterBar } from "@/components/shared/FilterBar";
import { ArtifactGrid } from "@/components/cards/ArtifactGrid";
import { usePosts } from "@/hooks/usePosts";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { useSearch } from "@/hooks/useSearch";

export function ArtifactsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { query, updateSearch } = useSearch();
  const { posts, isLoading } = usePosts();

  useSmoothScroll(sectionRef as React.RefObject<HTMLElement>, query);

  const artifacts = posts.map(mapPostToArtifact);

  return (
    <div
      ref={sectionRef}
      className="w-full px-6 md:px-12 mt-16 relative z-30 flex flex-col gap-8"
    >
      <FilterBar value={query} onChange={updateSearch} />

      <div className="w-full pb-24">
        {isLoading ? (
          <div className="w-full py-16 flex justify-center items-center border border-dashed border-[var(--color-border)] rounded-xl">
            <span className="metadata text-[var(--color-text-muted)]">
              Loading...
            </span>
          </div>
        ) : artifacts.length > 0 ? (
          <ArtifactGrid items={artifacts} />
        ) : (
          <div className="w-full py-16 flex justify-center items-center border border-dashed border-[var(--color-border)] rounded-xl">
            <span className="metadata text-[var(--color-text-muted)]">
              Try adjusting your search or check back later for new discoveries.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

import React from "react";
import { ArtifactCard } from "./ArtifactCard";
import { Artifact } from "@/types";

interface ArtifactGridProps {
  items: Artifact[];
}

export function ArtifactGrid({ items }: ArtifactGridProps) {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
      {items.map((artifact) => (
        <ArtifactCard key={artifact.id} artifact={artifact} />
      ))}
    </div>
  );
}

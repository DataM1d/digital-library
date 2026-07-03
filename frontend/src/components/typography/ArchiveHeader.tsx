import React from "react";
import { HeaderCanvas } from "./HeaderCanvas";

export function ArchiveHeader() {
  return (
    <HeaderCanvas>
      <header className="w-full pl-0 sm:pl-[10%] md:pl-[20%] transition-all duration-300">
        <h1 className="font-serif text-[clamp(2.5rem,6vw,5rem)] font-light tracking-tight leading-[0.9] select-none">
          <span className="block text-[var(--color-text-muted)] tracking-wide mb-2">
            A collection of
          </span>
          <span className="block italic text-[var(--color-text)] pl-[8%] py-1 font-mono tracking-wide border-l border-[var(--color-accent)]">
            digital artifacts
          </span>
          <span className="block text-[var(--color-text-muted)] tracking-wide mt-2">
            & fragments.
          </span>
        </h1>
      </header>
    </HeaderCanvas>
  );
}

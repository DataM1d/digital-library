import React from "react";
import { HeaderNavbar } from "../layout/HeaderNavbar";

export function HeaderCanvas({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full overflow-hidden bg-[var(--color-surface)] pt-0 pb-24 md:pb-32 flex flex-col justify-between">
      <div className="relative z-20">
        <HeaderNavbar />
      </div>

      <div className="relative z-10 w-full px-6 md:px-12 mt-16">{children}</div>
    </div>
  );
}

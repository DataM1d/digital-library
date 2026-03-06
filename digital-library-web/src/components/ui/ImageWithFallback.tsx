"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { ImageOff } from "lucide-react";

interface Props extends ImageProps {
  fallbackSrc?: string;
}

export function ImageWithFallback({ src, alt, ...props }: Props) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={`flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 ${props.className}`}>
        <div className="flex flex-col items-center gap-2 text-zinc-400">
          <ImageOff size={24} />
          <span className="text-[10px] uppercase tracking-widest font-medium text-center px-4">
            Archive Image Missing
          </span>
        </div>
      </div>
    );
  }

  return (
    <Image
      {...props}
      key={src?.toString()} // This resets the component state if the URL changes
      src={src}
      alt={alt}
      onError={() => setError(true)}
    />
  );
}
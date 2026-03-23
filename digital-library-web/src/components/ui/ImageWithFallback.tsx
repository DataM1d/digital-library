"use client";

import { useState, useMemo } from "react";
import Image, { ImageProps } from "next/image";
import { ImageOff } from "lucide-react";
import { Blurhash } from "react-blurhash";

interface Props extends ImageProps {
  blurHash?: string;
}

export function ImageWithFallback({ src, alt, blurHash, ...props }: Props) {
  const [error, setError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const isValidHash = useMemo(() => 
    blurHash && blurHash.length >= 6, 
  [blurHash]);

  if (error || !src) {
    return (
      <div className={`flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 ${props.className}`}>
        <div className="flex flex-col items-center gap-2 text-zinc-400">
          <ImageOff size={20} strokeWidth={1.5} />
          <span className="text-[9px] uppercase tracking-[0.2em] font-black">Missing</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {!isLoaded && (
        <div className="absolute inset-0 z-10 transition-opacity duration-500">
          {isValidHash ? (
            <Blurhash
              hash={blurHash!}
              width="100%"
              height="100%"
              resolutionX={32}
              resolutionY={32}
              punch={1}
            />
          ) : (
            // Fallback for posts without a hash
            <div className="h-full w-full animate-pulse bg-zinc-200 dark:bg-zinc-800" />
          )}
        </div>
      )}
      <Image
        {...props}
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        className={`transition-opacity duration-700 ease-in-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${props.className}`}
      />
    </div>
  );
}
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { DotMatrixMark } from "./DotMatrixMark";

const SOURCES = {
  transparent: { src: "/logo-transparent.png", width: 545, height: 274 },
  solid: { src: "/logo.png", width: 960, height: 495 },
} as const;

type Props = {
  variant?: keyof typeof SOURCES;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

/**
 * Brand logo with a vector fallback: the dot-matrix badge shows until the raster
 * logo has decoded, and stays if the image fails to load.
 */
export function Logo({ variant = "transparent", className, priority = false, sizes = "180px" }: Props) {
  const { src, width, height } = SOURCES[variant];
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // An image that finished decoding before hydration never fires onLoad.
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) setLoaded(true);
  }, []);

  const showFallback = !loaded || failed;

  return (
    <span className={cn("relative block", className)} style={{ aspectRatio: `${width} / ${height}` }}>
      {showFallback ? (
        <span
          className={cn("absolute inset-0 flex items-center justify-center", !failed && "animate-pulse")}
          aria-hidden={failed ? undefined : true}
        >
          <DotMatrixMark withWordmark className="h-[78%] w-auto max-w-full" />
        </span>
      ) : null}
      {failed ? null : (
        <Image
          ref={imgRef}
          src={src}
          alt="Giant Star Fashion Ltd."
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            "relative h-full w-full object-contain transition-opacity duration-300",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </span>
  );
}

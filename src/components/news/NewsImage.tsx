"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type NewsImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
};

export default function NewsImage({
  src,
  alt,
  priority = false,
  className = "",
}: NewsImageProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src || hasError) {
    return (
      <div
        className={`news-image-fallback ${className}`}
        role="img"
        aria-label={alt}
      >
        <span>BCU GROUP</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes="(max-width: 800px) 100vw, 50vw"
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
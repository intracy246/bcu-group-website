"use client";

import Image from "next/image";
import { useState } from "react";

export default function CompanyDirectoryLogo({ src, alt }: { src: string; alt: string }) {
  const [imageSource, setImageSource] = useState(src);
  return (
    <Image
      src={imageSource}
      alt={alt}
      width={700}
      height={420}
      className="company-directory-card__image"
      onError={() => setImageSource("/brands/bcu-logo.png")}
    />
  );
}

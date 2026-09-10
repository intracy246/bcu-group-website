"use client";

import styles from "./team.module.css";
import Image from "next/image";

export default function PortraitImage({ src, alt, priority }: { src: string; alt: string; priority: boolean }) {
  return <Image className={styles.portrait} src={src} alt={alt} fill sizes="(max-width: 700px) 100vw, 50vw" priority={priority} onError={event => { event.currentTarget.style.display = "none"; event.currentTarget.parentElement?.classList.add(styles.photoFailed); }} />;
}

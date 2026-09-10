"use client";
import { useEffect, useRef, type ReactNode } from "react";
import styles from "./team.module.css";
export default function TeamMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - window.innerHeight)));
      element.style.setProperty("--team-progress", String(progress));
      element.style.setProperty("--team-drift", `${Math.min(75, Math.max(0, -rect.top * 0.12))}px`);
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const setup = () => {
      observer?.disconnect(); window.removeEventListener("scroll", scroll); element.removeAttribute("data-motion");
      if (media.matches) return;
      element.dataset.motion = "on";
      observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.setAttribute("data-visible", "true"); observer?.unobserve(entry.target); } }), { threshold: 0.08 });
      element.querySelectorAll("[data-reveal]").forEach(section => observer?.observe(section));
      window.addEventListener("scroll", scroll, { passive: true }); update();
    };
    setup(); media.addEventListener("change", setup);
    return () => { observer?.disconnect(); window.removeEventListener("scroll", scroll); media.removeEventListener("change", setup); cancelAnimationFrame(frame); };
  }, []);
  return <div ref={root} className={styles.motion}><div className={styles.progress} aria-hidden="true" />{children}</div>;
}

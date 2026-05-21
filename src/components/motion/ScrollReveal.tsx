"use client";

/**
 * ScrollReveal — fade-up entrance animation driven by IntersectionObserver.
 *
 * No JS animation library required. Applies the `.scroll-reveal` CSS class
 * defined in globals.css, then flips `data-revealed="true"` when the element
 * enters the viewport. Respects `prefers-reduced-motion` by skipping the
 * hidden state entirely so content is immediately visible.
 *
 * Usage:
 *   <ScrollReveal delay={120}>
 *     <YourComponent />
 *   </ScrollReveal>
 */

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  /** Delay before the reveal animation starts (ms). Default 0. */
  delay?: number;
  /** How much of the element must be visible before triggering (0–1). Default 0.12. */
  threshold?: number;
  /** Additional className forwarded to the wrapper div. */
  className?: string;
  /** Reveal only once (default: true). Set false to re-hide on scroll-out. */
  once?: boolean;
}

export function ScrollReveal({
  children,
  delay = 0,
  threshold = 0.12,
  className,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [armed, setArmed] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPrefersReduced(reduce);
    if (!reduce) setArmed(true);
  }, []);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefersReduced(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (prefersReduced) {
      setRevealed(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setRevealed(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once, prefersReduced]);

  const style: CSSProperties = delay && !prefersReduced
    ? { transitionDelay: `${delay}ms` }
    : {};

  return (
    <div
      ref={ref}
      className={`scroll-reveal${className ? ` ${className}` : ""}`}
      data-pre-reveal={armed && !revealed ? "true" : undefined}
      data-revealed={revealed ? "true" : undefined}
      style={style}
    >
      {children}
    </div>
  );
}

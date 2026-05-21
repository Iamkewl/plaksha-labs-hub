"use client";

/**
 * GlowCard — wrapper that renders a cursor-following radial glow behind the
 * card surface on hover. Pure CSS + JS, no external deps.
 *
 * The glow is rendered as an absolutely-positioned pseudo-element driven by
 * CSS custom properties `--x` and `--y` set inline via JS.
 *
 * Respects `prefers-reduced-motion` — glow remains static in that case.
 *
 * Usage:
 *   <GlowCard glowColor="hsl(239 100% 78% / 0.18)" className="rounded-2xl">
 *     <YourCardContents />
 *   </GlowCard>
 */

import {
  useRef,
  useState,
  useEffect,
  type ReactNode,
  type MouseEvent,
  type CSSProperties,
} from "react";
import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: ReactNode;
  /**
   * HSL color string for the radial glow. Should be semi-transparent.
   * Defaults to primary periwinkle.
   */
  glowColor?: string;
  /** Radius of the glow in px. Default 220. */
  glowRadius?: number;
  className?: string;
}

export function GlowCard({
  children,
  glowColor = "hsl(239 100% 78% / 0.15)",
  glowRadius = 220,
  className,
}: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mql.matches);
    const onChange = () => setPrefersReduced(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseLeave = () => setPos(null);

  const glowX = pos ? `${pos.x}px` : "50%";
  const glowY = pos ? `${pos.y}px` : "50%";
  const glowOpacity = pos ? 1 : 0;

  const glowStyle: CSSProperties = {
    background: `radial-gradient(${glowRadius}px circle at ${glowX} ${glowY}, ${glowColor}, transparent 70%)`,
    opacity: glowOpacity,
    transition: "opacity 0.4s ease",
  };

  return (
    <div
      ref={ref}
      className={cn("relative", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow layer — behind content, above card background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit]"
        style={glowStyle}
      />
      {/* Content — above glow */}
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}

"use client";

/**
 * MagneticButton — wraps any child with a subtle magnetic pull effect.
 *
 * On hover, the element translates toward the cursor position within its
 * bounding box. On mouse-leave it snaps back with the ease-snap curve.
 * Does nothing when `prefers-reduced-motion` is active.
 *
 * Usage:
 *   <MagneticButton strength={0.35}>
 *     <Button>Explore Labs</Button>
 *   </MagneticButton>
 */

import {
  useRef,
  useState,
  useEffect,
  type ReactNode,
  type MouseEvent,
} from "react";

interface MagneticButtonProps {
  children: ReactNode;
  /**
   * How strongly the element follows the cursor.
   * 0 = no effect, 1 = moves to cursor. Default 0.32.
   */
  strength?: number;
  className?: string;
}

export function MagneticButton({
  children,
  strength = 0.32,
  className,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
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
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setOffset({
      x: (e.clientX - cx) * strength,
      y: (e.clientY - cy) * strength,
    });
  };

  const handleMouseLeave = () => setOffset({ x: 0, y: 0 });

  const transform = prefersReduced
    ? undefined
    : `translate(${offset.x.toFixed(1)}px, ${offset.y.toFixed(1)}px)`;

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        display: "inline-flex",
      }}
    >
      {children}
    </div>
  );
}

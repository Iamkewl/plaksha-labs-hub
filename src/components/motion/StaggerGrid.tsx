"use client";

/**
 * StaggerGrid — wraps a grid of children and applies staggered scroll-reveal
 * entrance animations using IntersectionObserver on the container.
 *
 * When the container enters the viewport all children start animating with
 * `staggerDelay` ms between each. Uses `scroll-reveal` CSS for each child.
 *
 * Respects `prefers-reduced-motion`.
 *
 * Usage:
 *   <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 *     {labs.map(lab => <LabCard key={lab.slug} lab={lab} />)}
 *   </StaggerGrid>
 */

import {
  useRef,
  useEffect,
  useState,
  Children,
  isValidElement,
  type ReactNode,
  type ReactElement,
  type HTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

interface StaggerGridProps {
  children: ReactNode;
  /** Delay between each child reveal (ms). Default 60. */
  staggerDelay?: number;
  /** Base delay before any child animates (ms). Default 80. */
  baseDelay?: number;
  /** Intersection threshold (0-1). Default 0.08. */
  threshold?: number;
  className?: string;
}

export function StaggerGrid({
  children,
  staggerDelay = 60,
  baseDelay = 80,
  threshold = 0.08,
  className,
}: StaggerGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [armed, setArmed] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPrefersReduced(reduce);
    if (reduce) setRevealed(true);
    else setArmed(true);
  }, []);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      setPrefersReduced(mql.matches);
      if (mql.matches) setRevealed(true);
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (prefersReduced) return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, prefersReduced]);

  const childArray = Children.toArray(children);

  return (
    <div ref={containerRef} className={cn(className)}>
      {childArray.map((child, i) => {
        if (!isValidElement(child)) return child;

        const delay = baseDelay + i * staggerDelay;
        const isRevealed = revealed;

        return (
          <div
            key={(child as ReactElement<HTMLAttributes<HTMLElement>>).key ?? i}
            className="scroll-reveal"
            data-pre-reveal={armed && !isRevealed ? "true" : undefined}
            data-revealed={isRevealed ? "true" : undefined}
            style={
              isRevealed && !prefersReduced
                ? { transitionDelay: `${delay}ms` }
                : undefined
            }
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}

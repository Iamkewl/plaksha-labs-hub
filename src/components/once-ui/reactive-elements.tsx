"use client";

import { CountFx, RevealFx } from "@once-ui-system/core";
import { useEffect, useMemo, useState, type ReactNode } from "react";

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefersReducedMotion(media.matches);
    onChange();

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return prefersReducedMotion;
}

type ReactiveRevealProps = {
  children: ReactNode;
  delay?: number;
  speed?: "slow" | "medium" | "fast" | number;
  translateY?: number;
  className?: string;
};

export function ReactiveReveal({
  children,
  delay = 0,
  speed = "fast",
  translateY = 0.5,
  className,
}: ReactiveRevealProps) {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <RevealFx
      delay={delay}
      speed={speed}
      translateY={translateY}
      className={className}
    >
      {children}
    </RevealFx>
  );
}

type ReactiveMetricProps = {
  value: number;
  className?: string;
  separator?: string;
  decimals?: number;
};

export function ReactiveMetric({
  value,
  className,
  separator = ",",
  decimals,
}: ReactiveMetricProps) {
  const reducedMotion = usePrefersReducedMotion();

  const staticText = useMemo(() => {
    if (decimals !== undefined) {
      return value.toFixed(decimals);
    }
    return separator
      ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator)
      : value.toString();
  }, [value, separator, decimals]);

  if (reducedMotion) {
    return <span className={className}>{staticText}</span>;
  }

  return (
    <CountFx
      value={value}
      className={className}
      speed={900}
      easing="ease-out"
      effect="smooth"
      separator={separator}
      decimals={decimals}
    />
  );
}

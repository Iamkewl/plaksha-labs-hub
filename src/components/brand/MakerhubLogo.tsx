import Link from "next/link";
import { cn } from "@/lib/utils";

interface MakerhubLogoProps {
  /** Visual variant — "dark" for teal footer, "light" for white nav. */
  variant?: "light" | "dark";
  /** Whether to wrap in a Next.js Link to "/". Default true. */
  linked?: boolean;
  className?: string;
}

/**
 * MakerhubLogo — wordmark + Plaksha logo lockup.
 *
 * Plaksha logo: A simplified "P" mark with a green leaf accent on top-right
 * and a teal square as the background tile — matching the Figma export.
 */
export function MakerhubLogo({
  variant = "light",
  linked = true,
  className,
}: MakerhubLogoProps) {
  const isDark = variant === "dark";

  const inner = (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
    >
      {/* Plaksha logo mark — teal square tile + green leaf accent */}
      <span
        aria-hidden="true"
        className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
        style={{ background: "hsl(182 80% 32%)" }}
      >
        {/* "P" letterform */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          aria-hidden="true"
        >
          {/* Stylised P with open counter */}
          <path
            d="M6 4h7a4 4 0 0 1 0 8H6V4z"
            fill="white"
            fillOpacity={0.95}
          />
          <path d="M6 12v8" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeOpacity={0.95} />
          {/* Green leaf on top-right corner */}
          <ellipse
            cx="17"
            cy="4.5"
            rx="2.8"
            ry="1.8"
            transform="rotate(-35 17 4.5)"
            fill="hsl(120 32% 51%)"
          />
        </svg>
      </span>

      {/* Wordmark */}
      <span
        className={cn(
          "text-sm font-semibold tracking-tight transition-opacity duration-150",
          isDark
            ? "text-white hover:text-white"
            : "text-foreground hover:text-foreground"
        )}
        style={{ letterSpacing: "-0.01em", color: isDark ? "#ffffff" : undefined }}
      >
        Plaksha Labs Hub
      </span>
    </span>
  );

  if (!linked) return inner;

  return (
    <Link
      href="/"
      aria-label="Plaksha Labs Hub — back to home"
      className="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {inner}
    </Link>
  );
}

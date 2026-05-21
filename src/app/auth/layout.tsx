import type { ReactNode } from "react";
import { MakerhubLogo } from "@/components/brand/MakerhubLogo";

/**
 * Auth layout — split screen.
 *
 * LEFT pane  (lg+): teal gradient backdrop + floating "Hello, Maker!" pill
 *                    + animated depth circles. Hidden on mobile.
 * RIGHT pane       : centered form column. On mobile this is the only visible pane
 *                    with a compact logo at the top.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* ── LEFT PANE ─────────────────────────────────────────────────────────── */}
      <div
        className="relative hidden overflow-hidden lg:flex lg:flex-col"
        style={{
          background:
            "linear-gradient(135deg, hsl(182 60% 45%) 0%, hsl(182 75% 35%) 45%, hsl(182 81% 24%) 100%)",
        }}
        aria-hidden="true"
      >
        {/* Logo top-left */}
        <div className="relative z-10 p-8">
          <MakerhubLogo variant="dark" linked />
        </div>

        {/* Depth circles — subtle white blurs for visual richness */}
        {/* Circle A — large, bottom-right quadrant */}
        <span
          className="pointer-events-none absolute"
          style={{
            width: "480px",
            height: "480px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)",
            bottom: "-80px",
            right: "-120px",
            animation: "auth-float-a 22s ease-in-out infinite",
          }}
        />
        {/* Circle B — medium, top-left */}
        <span
          className="pointer-events-none absolute"
          style={{
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
            top: "60px",
            right: "40px",
            animation: "auth-float-b 28s ease-in-out infinite",
          }}
        />
        {/* Circle C — small accent, mid-left */}
        <span
          className="pointer-events-none absolute"
          style={{
            width: "160px",
            height: "160px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.09) 0%, transparent 70%)",
            top: "42%",
            left: "12%",
            animation: "auth-float-c 18s ease-in-out infinite",
          }}
        />
        {/* Circle D — tiny, bottom-left corner */}
        <span
          className="pointer-events-none absolute"
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)",
            bottom: "18%",
            left: "8%",
            animation: "auth-float-d 14s ease-in-out infinite 2s",
          }}
        />

        {/* Pill — centered, slightly above-middle */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center pb-16">
          {/* Pill card */}
          <div
            className="motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 flex flex-col items-center gap-3 rounded-3xl px-10 py-8 text-center duration-500"
            style={{
              background: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.22)",
              boxShadow: "0 8px 40px -12px rgba(0,0,0,0.25)",
            }}
          >
            <p
              className="plaksha-headline text-4xl font-bold text-white"
              style={{ letterSpacing: "-0.02em" }}
            >
              Hello, Maker!
            </p>
            <p
              className="text-base font-medium text-white/75"
              style={{ letterSpacing: "0.01em" }}
            >
              Build with the community.
            </p>
          </div>
        </div>

      </div>

      {/* ── RIGHT PANE ────────────────────────────────────────────────────────── */}
      <div className="flex min-h-screen flex-col bg-background">
        {/* Mobile-only logo header */}
        <div className="flex items-center px-6 pt-6 lg:hidden">
          <MakerhubLogo variant="light" linked />
        </div>

        {/* Centered form area */}
        <div className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}

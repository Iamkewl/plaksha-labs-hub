import { GraduationCap, Users, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { RoleCard } from "@/components/public/RoleCard";

/**
 * Hero — rich teal band, min 70vh.
 *
 * Left half: kicker label + huge headline "Book. / Build. / Showcase." +
 *   descriptor + two inline CTAs.
 * Right half: three role cards.
 *
 * Layers (back → front):
 *   1. Teal-to-deep-teal gradient base.
 *   2. Fine dot-grid (white 7% on 24px grid).
 *   3. Three drifting blurred light orbs (CSS-only, 18s–30s loops).
 *   4. Subtle diagonal noise texture via SVG data-URI (adds grain/depth).
 *   5. Content.
 *
 * Underline on "Showcase." — CSS width transition from 0→100% after a 200ms
 * delay. Uses animation-fill-mode: both so it plays on load. Pure CSS — no JS.
 *
 * Headline: clamp(4.5rem, 10vw, 8rem) — genuinely large at every viewport.
 *
 * NOTE: <style> tag is legal in Next.js App Router RSC — hoisted to <head>.
 */
export function Hero() {
  return (
    <>
      <section
        aria-labelledby="hero-heading"
        className="relative w-full overflow-hidden"
        style={{ minHeight: "70vh" }}
      >
        {/* Layer 1: teal-to-deep-teal gradient base */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(150deg, hsl(182 78% 36%) 0%, hsl(182 80% 30%) 45%, hsl(182 81% 20%) 100%)",
          }}
        />

        {/* Layer 2: dot-grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.09) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Layer 3: grain texture — adds tactile depth */}
        <div
          aria-hidden="true"
          className="pl-hero-grain pointer-events-none absolute inset-0"
        />

        {/* Layer 4: drifting light orbs */}
        <div aria-hidden="true" className="pl-hero-orb pl-hero-orb-1" />
        <div aria-hidden="true" className="pl-hero-orb pl-hero-orb-2" />
        <div aria-hidden="true" className="pl-hero-orb pl-hero-orb-3" />

        {/* Bottom-edge feather — blends hero into the section-fade-teal div */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-24"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, hsl(182 81% 20% / 0.6) 100%)",
          }}
        />

        {/* Content */}
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">

            {/* Left column: kicker + headline + descriptor */}
            <div>
              {/* Kicker — tracks in from below */}
              <p
                className="pl-hero-kicker mb-5 text-xs font-semibold uppercase tracking-widest text-white/60"
              >
                Plaksha Labs Hub
              </p>

              {/* Headline — each word staggers in */}
              <h1
                id="hero-heading"
                className="plaksha-headline font-bold leading-[0.95] text-white"
                style={{ fontSize: "clamp(4.5rem, 10vw, 8rem)" }}
              >
                <span className="pl-hero-word pl-hero-word-1 block">
                  Book.
                </span>
                <span className="pl-hero-word pl-hero-word-2 block">
                  Build.
                </span>
                {/* "Showcase." with animated yellow underline */}
                <span className="pl-hero-word pl-hero-word-3 relative inline-block">
                  Showcase.
                  <span aria-hidden="true" className="pl-hero-underline" />
                </span>
              </h1>

              {/* Descriptor + CTAs — fade in together */}
              <div className="pl-hero-body">
                <p className="mt-8 max-w-[38ch] text-base leading-relaxed text-white/70 sm:text-lg">
                  The unified platform for Plaksha students to reserve
                  equipment, collaborate with mentors, and share what you
                  make.
                </p>

                {/* Inline CTAs baked into the hero — higher conversion than a separate strip */}
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href="/labs"
                    className="
                      inline-flex items-center rounded-full
                      bg-white px-6 py-2.5
                      text-sm font-semibold text-[hsl(182_80%_28%)]
                      shadow-lg
                      transition-all duration-200
                      hover:-translate-y-px hover:shadow-xl
                      focus-visible:outline-none focus-visible:ring-2
                      focus-visible:ring-white focus-visible:ring-offset-2
                      focus-visible:ring-offset-[hsl(182_80%_30%)]
                    "
                  >
                    Explore Labs
                  </Link>
                  <Link
                    href="/auth/signin"
                    className="
                      inline-flex items-center rounded-full
                      border border-white/30 bg-white/10 px-6 py-2.5
                      text-sm font-semibold text-white
                      backdrop-blur-sm
                      transition-all duration-200
                      hover:bg-white/20 hover:border-white/50
                      focus-visible:outline-none focus-visible:ring-2
                      focus-visible:ring-white focus-visible:ring-offset-2
                      focus-visible:ring-offset-[hsl(182_80%_30%)]
                    "
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/demo"
                    aria-label="Try the interactive demo — no signup required"
                    className="
                      inline-flex items-center gap-1.5 rounded-full
                      border border-amber-300/60 bg-amber-300/15 px-6 py-2.5
                      text-sm font-semibold text-amber-50
                      backdrop-blur-sm
                      transition-all duration-200
                      hover:-translate-y-px hover:border-amber-300 hover:bg-amber-300/25 hover:shadow-xl
                      focus-visible:outline-none focus-visible:ring-2
                      focus-visible:ring-amber-200 focus-visible:ring-offset-2
                      focus-visible:ring-offset-[hsl(182_80%_30%)]
                    "
                  >
                    <span aria-hidden="true">⚗</span>
                    Try the demo
                  </Link>
                </div>
              </div>
            </div>

            {/* Right column: role cards */}
            <div
              className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-3"
              aria-label="Platform roles"
            >
              <RoleCard
                icon={GraduationCap}
                role="Student"
                blurb="Request machine time, join sessions, and submit your builds for review."
              />
              <RoleCard
                icon={Users}
                role="Mentor"
                blurb="Approve requests, guide projects, and track student progress across labs."
              />
              <RoleCard
                icon={ShieldCheck}
                role="Admin"
                blurb="Manage resources, oversee access permissions, and publish announcements."
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

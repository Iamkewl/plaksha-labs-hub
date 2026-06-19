"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Search, User, ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MakerhubLogo } from "@/components/brand/MakerhubLogo";

/**
 * PublicNav — light header for public surface.
 *
 * Left: MakerhubLogo lockup (wordmark + Plaksha P-mark).
 * Center: Home | Explore Labs ▾ | Projects.
 * Right: search icon + avatar circle.
 * White background, subtle bottom border, sticky.
 */
const labLinks = [
  { href: "/labs/makerspace", label: "Makerspace" },
  { href: "/labs/robotics", label: "Robotics" },
  { href: "/labs", label: "View all labs" },
] as const;

export function PublicNav() {
  const [scrolled, setScrolled] = useState(false);
  const [labsOpen, setLabsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click or Escape
  useEffect(() => {
    if (!labsOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLabsOpen(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLabsOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [labsOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 bg-white transition-shadow duration-300",
        scrolled
          ? "border-b border-border shadow-sm"
          : "border-b border-border/60"
      )}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        {/* Left: logo */}
        <MakerhubLogo variant="light" />

        {/* Center: primary nav links */}
        <div
          className="hidden items-center gap-1 md:flex"
          role="menubar"
          aria-label="Primary navigation"
        >
          <Link
            href="/"
            aria-current="page"
            className="nav-indicator rounded-md px-3 py-1.5 text-sm font-medium text-foreground transition-colors duration-150 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Home
          </Link>

          {/* Explore Labs — dropdown trigger */}
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={labsOpen}
              onClick={() => setLabsOpen((o) => !o)}
              className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Explore Labs
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 opacity-60 transition-transform duration-150",
                  labsOpen && "rotate-180"
                )}
                aria-hidden="true"
              />
            </button>

            {labsOpen && (
              <div
                role="menu"
                aria-label="Labs navigation"
                className="absolute left-0 top-full z-40 mt-1 min-w-[160px] rounded-lg border border-border bg-white py-1 shadow-md"
              >
                {labLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    role="menuitem"
                    onClick={() => setLabsOpen(false)}
                    className={cn(
                      "block px-4 py-2 text-sm text-muted-foreground transition-colors duration-100 hover:bg-muted hover:text-foreground focus-visible:bg-muted focus-visible:outline-none",
                      label === "View all labs" && "mt-1 border-t border-border/60 pt-2 font-medium text-foreground"
                    )}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/projects"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Projects
          </Link>
        </div>

        {/* Right: avatar + mobile hamburger */}
        <div className="flex items-center gap-2">
          {/* Search button — hidden until feature ships */}
          <button
            type="button"
            aria-label="Search"
            title="Coming soon"
            className="hidden h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
          </button>

          <Link
            href="/auth/signin"
            aria-label="Sign in or view account"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-150 hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <User className="h-4 w-4" aria-hidden="true" />
          </Link>

          {/* Mobile hamburger — visible below md */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-menu"
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:hidden"
          >
            {mobileOpen ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Menu className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile nav menu */}
      {mobileOpen && (
        <div
          id="mobile-nav-menu"
          className="border-t border-border bg-white px-4 py-3 md:hidden"
          role="menu"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-1">
            <Link
              href="/"
              role="menuitem"
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Home
            </Link>
            <Link
              href="/labs"
              role="menuitem"
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Explore Labs
            </Link>
            <Link
              href="/labs/makerspace"
              role="menuitem"
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-3 py-2 pl-6 text-sm text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Makerspace
            </Link>
            <Link
              href="/labs/robotics"
              role="menuitem"
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-3 py-2 pl-6 text-sm text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Robotics
            </Link>
            <Link
              href="/projects"
              role="menuitem"
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Projects
            </Link>
            <div className="mt-2 border-t border-border/60 pt-2">
              <Link
                href="/auth/signin"
                role="menuitem"
                onClick={() => setMobileOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-primary transition-colors duration-150 hover:bg-primary/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

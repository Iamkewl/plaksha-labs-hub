import Link from "next/link";
import { Github, Mail, Globe } from "lucide-react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { MakerhubLogo } from "@/components/brand/MakerhubLogo";

const DEEP_TEAL = "hsl(182 81% 24%)"; // --sidebar token — no Tailwind alias exists

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/labs", label: "Explore Labs" },
  { href: "/labs/makerspace", label: "Makerspace" },
  { href: "/labs/robotics", label: "Robotics Lab" },
  { href: "/projects", label: "Projects" },
  { href: "/auth/signin", label: "Sign In" },
] as const;

const CONTACT_LINKS = [
  {
    href: "https://github.com/plaksha",
    label: "GitHub",
    icon: Github,
  },
  {
    href: "mailto:makerspace@plaksha.edu.in",
    label: "makerspace@plaksha.edu.in",
    icon: Mail,
  },
  {
    href: "https://plaksha.edu.in",
    label: "plaksha.edu.in",
    icon: Globe,
  },
] as const;

/**
 * PublicFooter — deep-teal band per Figma.
 *
 * Top edge: 2px yellow accent strip (brand accent) for visual grounding.
 * Three columns: brand left / nav links middle / social+contact right.
 * Larger MakerhubLogo. "Built with..." row uses text labels (no pseudo-icons).
 */
export function PublicFooter() {
  return (
    <footer
      style={{ background: DEEP_TEAL }}
      aria-label="Site footer"
    >
      {/* Yellow accent top strip */}
      <div
        aria-hidden="true"
        style={{
          height: "2px",
          background:
            "linear-gradient(90deg, transparent 0%, hsl(47 100% 61% / 0.9) 30%, hsl(47 100% 61%) 50%, hsl(47 100% 61% / 0.9) 70%, transparent 100%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ScrollReveal threshold={0.05}>

          {/* Three-column grid */}
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">

            {/* Column 1: Brand — larger logo */}
            <div className="col-span-1">
              {/* Scale the logo wrapper up so the wordmark reads bigger in footer */}
              <div style={{ transform: "scale(1.2)", transformOrigin: "left center" }}>
                <MakerhubLogo variant="dark" />
              </div>
              <p className="mt-6 max-w-[22ch] text-sm leading-relaxed text-white/60">
                Unified operations for every lab at{" "}
                <span className="font-medium text-white/80">
                  Plaksha University
                </span>
                .
              </p>
            </div>

            {/* Column 2: Nav links */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">
                Navigate
              </p>
              <nav aria-label="Footer navigation" className="space-y-2.5">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="
                      block text-sm text-white/70
                      transition-colors duration-150
                      hover:text-white
                      focus-visible:outline-none focus-visible:ring-2
                      focus-visible:ring-white/60 focus-visible:ring-offset-2
                      focus-visible:ring-offset-[hsl(182_81%_24%)]
                      rounded-sm
                    "
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Column 3: Contact / social */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">
                Contact
              </p>
              <ul className="space-y-3" role="list">
                {CONTACT_LINKS.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="
                        inline-flex items-center gap-2.5 text-sm text-white/70
                        transition-colors duration-150 hover:text-white
                        focus-visible:outline-none focus-visible:ring-2
                        focus-visible:ring-white/60 focus-visible:ring-offset-2
                        focus-visible:ring-offset-[hsl(182_81%_24%)]
                        rounded-sm
                      "
                    >
                      <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Divider + copyright row */}
          <div className="mt-10 border-t border-white/10 pt-6">
            <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
              <p className="text-xs text-white/40">
                &copy; 2026 Plaksha University. All rights reserved.
              </p>
              <p className="text-xs text-white/25">
                Built with{" "}
                <span className="text-white/35">Next.js</span>
                {" · "}
                <span className="text-white/35">Tailwind CSS</span>
                {" · "}
                <span className="text-white/35">Prisma</span>
              </p>
            </div>
          </div>

        </ScrollReveal>
      </div>
    </footer>
  );
}

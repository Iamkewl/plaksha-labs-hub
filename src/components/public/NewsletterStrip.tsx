"use client";

import { useState } from "react";
import { Mail, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { cn } from "@/lib/utils";

/**
 * NewsletterStrip — full-width muted-gray band with:
 * - Decorative envelope icon watermark (low-opacity, left edge)
 * - Enhanced input field (border + subtle shadow)
 * - Success state: shows confirmation message, resets after 4s
 */
export function NewsletterStrip() {
  const [status, setStatus] = useState<"idle" | "success">("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("success");
    const form = e.currentTarget;
    setTimeout(() => {
      setStatus("idle");
      form.reset();
    }, 4000);
  }

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="relative overflow-hidden bg-surface-muted px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
    >
      {/* Decorative envelope watermark — decorative only, hidden from AT */}
      <Mail
        aria-hidden="true"
        className="
          pointer-events-none absolute -left-6 top-1/2 h-48 w-48
          -translate-y-1/2 text-foreground/[0.04]
          sm:-left-4 sm:h-56 sm:w-56
        "
      />

      <div className="relative mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-12">
            {/* Left: copy */}
            <div className="max-w-sm shrink-0">
              <p className="section-kicker mb-1 text-primary">Stay in the loop</p>
              <h2
                id="newsletter-heading"
                className="text-xl font-semibold leading-tight text-foreground sm:text-2xl"
              >
                Get updates from the labs
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                New equipment, open slots, and project showcases — right to your inbox.
              </p>
            </div>

            {/* Right: form / success state */}
            <div className="w-full max-w-md">
              {status === "success" ? (
                <div
                  className="
                    flex items-center gap-2.5 rounded-xl border border-[hsl(182_80%_32%/0.22)]
                    bg-[hsl(182_80%_32%/0.06)] px-5 py-4
                  "
                  role="status"
                  aria-live="polite"
                >
                  <CheckCircle
                    className="h-5 w-5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <p className="text-sm font-medium text-primary">
                    Thanks! We&apos;ll be in touch.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex w-full flex-col gap-3 sm:flex-row"
                  aria-label="Newsletter subscription form"
                >
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <Input
                    id="newsletter-email"
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                    className={cn(
                      "flex-1 bg-card",
                      "border border-border shadow-sm",
                      "transition-shadow duration-200",
                      "focus:shadow-[0_0_0_3px_hsl(182_80%_32%/0.12)] focus:border-primary/60"
                    )}
                  />
                  <Button
                    type="submit"
                    className="
                      shrink-0 rounded-xl bg-primary px-5 text-sm font-medium
                      text-primary-foreground
                      shadow-teal-glow
                      transition-all duration-200
                      hover:-translate-y-px hover:shadow-teal-glow-strong
                      focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                    "
                  >
                    Subscribe
                  </Button>
                </form>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { PublicNav } from "@/components/public/PublicNav";
import { Hero } from "@/components/public/Hero";
import { CTAStrip } from "@/components/public/CTAStrip";
import { WhatHappensHere } from "@/components/public/WhatHappensHere";
import { FeaturedProjects } from "@/components/public/FeaturedProjects";
import { StatsStrip } from "@/components/public/StatsStrip";
import { NewsletterStrip } from "@/components/public/NewsletterStrip";
import { PublicFooter } from "@/components/public/PublicFooter";

export const metadata: Metadata = {
  title: "Plaksha Labs Hub",
  description:
    "The unified platform for Plaksha students to reserve equipment, collaborate with mentors, and share what you make.",
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col text-foreground">
      {/* 1. Navigation */}
      <PublicNav />

      <main className="flex-1">
        {/* 2. Hero — teal band with role cards */}
        <Hero />

        {/* Smooth fade from teal hero into white content */}
        <div className="section-fade-teal" aria-hidden="true" />

        {/* 3. CTA pill buttons */}
        <CTAStrip />

        {/* 4. What Happens Here — gray-muted section */}
        <WhatHappensHere />

        {/* 5. Featured Builds — three project cards */}
        <FeaturedProjects />

        {/* 6. Stats strip — three yellow circles */}
        <StatsStrip />

        {/* 7. Newsletter strip */}
        <NewsletterStrip />
      </main>

      {/* 8. Footer — deep teal */}
      <PublicFooter />
    </div>
  );
}

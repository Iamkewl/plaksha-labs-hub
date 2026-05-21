import type { Metadata } from "next";

/** Canonical base URL — falls back to the production domain. */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://labs.plaksha.edu.in";

/** Site-wide defaults merged with every generated Metadata object. */
const SITE_NAME = "Plaksha Labs Hub";
const DEFAULT_DESCRIPTION =
  "Discover, book, and manage Plaksha University's Makerspace and Robotics Lab — machine catalog, tool checkout, project BOMs, and mentor sessions in one place.";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;

export interface BuildMetadataOptions {
  /** Page title (without the site name suffix). Pass undefined to use the default. */
  title?: string;
  /** Meta description. Falls back to the site-wide default. */
  description?: string;
  /**
   * Canonical path (e.g. "/labs/makerspace"). Must start with "/".
   * Omit for the home page.
   */
  path?: string;
  /**
   * Absolute URL of the Open Graph image.
   * Falls back to the default OG image at /og-default.png.
   */
  image?: string;
}

/**
 * Build a Next.js `Metadata` object with OG + Twitter card tags.
 *
 * @example
 * // In a page.tsx:
 * export const metadata = buildMetadata({
 *   title: "Makerspace",
 *   description: "Full-spectrum fabrication lab at Plaksha University.",
 *   path: "/labs/makerspace",
 * });
 */
export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  image = DEFAULT_OG_IMAGE,
}: BuildMetadataOptions = {}): Metadata {
  const formattedTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
  const canonicalUrl = path ? `${SITE_URL}${path}` : SITE_URL;

  return {
    title: formattedTitle,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: formattedTitle,
      description,
      url: canonicalUrl,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: formattedTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: formattedTitle,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

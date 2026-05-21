import type { Metadata } from "next";
import type { CSSProperties } from "react";
import "@once-ui-system/core/css/styles.css";
import "@once-ui-system/core/css/tokens.css";
import "./globals.css";
import { Providers } from "@/components/providers";

const fontVariables = {
  "--font-display": "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  "--font-body": "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
} as CSSProperties;

export const metadata: Metadata = {
  title: "Plaksha Labs Hub",
  description: "Unified booking, build, and showcase platform for every lab at Plaksha University.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning: Once UI ThemeProvider reads localStorage during
    // render to restore style tokens, producing data-* attribute differences
    // between SSR and client. This suppresses that mismatch without disabling
    // React interactivity — it only skips attribute comparison on <html>/<body>.
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" style={fontVariables} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

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
  title: "Plaksha Makerspace Hub",
  description: "Cinematic operations workspace for makerspace teams.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased" style={fontVariables}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

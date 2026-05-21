"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/shell/Sidebar";
import * as DialogPrimitive from "@radix-ui/react-dialog";

/**
 * MobileSidebar — hamburger trigger + left-edge sheet drawer (lg:hidden).
 *
 * Built directly on @radix-ui/react-dialog primitives so we can position the
 * content as a left-anchored sheet without fighting DialogContent's defaults.
 *
 * Slide animation uses Tailwind's tailwindcss-animate data-state variants:
 *   data-[state=open]:animate-in  data-[state=closed]:animate-out
 *   slide-in-from-left  slide-out-to-left
 */
export function MobileSidebar({ unreadCount = 0 }: { unreadCount?: number }) {
  const [open, setOpen] = useState(false);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      {/* ── Hamburger trigger ─────────────────────────────────────────── */}
      <DialogPrimitive.Trigger asChild>
        <button
          type="button"
          aria-label="Open navigation menu"
          className={cn(
            "lg:hidden",
            "flex h-9 w-9 items-center justify-center rounded-md",
            "text-muted-foreground hover:text-foreground hover:bg-muted",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        {/* ── Scrim ────────────────────────────────────────────────────── */}
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm",
            // tailwindcss-animate data-state transitions
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
            "duration-200"
          )}
        />

        {/* ── Sheet panel ──────────────────────────────────────────────── */}
        <DialogPrimitive.Content
          className={cn(
            // Left-edge anchored, full height
            "fixed inset-y-0 left-0 z-50",
            "w-60 max-w-[85vw]",
            // Remove default rounding
            "rounded-none",
            // Slide from left
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
            "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
            "duration-300",
            // No inner padding — Sidebar owns its layout
            "p-0 overflow-hidden",
            // Flex column so the Sidebar fills the panel
            "flex flex-col"
          )}
          aria-label="Navigation drawer"
        >
          {/* Accessible title (sr-only) */}
          <DialogPrimitive.Title className="sr-only">
            Navigation menu
          </DialogPrimitive.Title>

          {/* Close button — sits on the teal sidebar bg */}
          <div className="flex shrink-0 items-center justify-end border-b border-white/10 bg-sidebar px-3 py-2">
            <DialogPrimitive.Close asChild>
              <button
                type="button"
                aria-label="Close navigation menu"
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-md",
                  "text-white/60 hover:text-white hover:bg-white/10",
                  "transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                )}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </DialogPrimitive.Close>
          </div>

          {/* Sidebar fills remaining height */}
          <div className="flex-1 overflow-y-auto">
            <Sidebar onNavClick={() => setOpen(false)} unreadCount={unreadCount} />
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

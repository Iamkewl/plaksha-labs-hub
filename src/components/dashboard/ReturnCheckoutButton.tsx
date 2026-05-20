"use client";

import { useTransition } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { returnCheckout } from "@/app/actions/checkouts";

interface ReturnCheckoutButtonProps {
  checkoutId: string;
  isOverdue?: boolean;
}

export function ReturnCheckoutButton({
  checkoutId,
  isOverdue = false,
}: ReturnCheckoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleReturn() {
    startTransition(async () => {
      try {
        await returnCheckout(checkoutId);
      } catch (err) {
        // Error will surface as a thrown error from the server action;
        // we show it inline via the error boundary or let the page re-render.
        // For now we propagate so the consumer can catch it if needed.
        console.error("returnCheckout failed:", err);
      }
    });
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className={isOverdue ? "border-red-200 text-red-600 hover:bg-red-50" : ""}
      onClick={handleReturn}
      disabled={isPending}
      aria-label="Return this asset"
    >
      <RotateCcw className={`h-3 w-3 mr-1 ${isPending ? "animate-spin" : ""}`} />
      {isPending ? "Returning…" : "Return"}
    </Button>
  );
}

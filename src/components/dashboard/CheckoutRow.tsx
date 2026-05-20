import { Package, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { PlaceholderCheckout } from "@/lib/placeholder/dashboard";
import { ReturnCheckoutButton } from "./ReturnCheckoutButton";

interface CheckoutRowProps {
  checkout: PlaceholderCheckout;
  /** Real checkout ID from DB (undefined when using placeholder data) */
  dbCheckoutId?: string;
}

export function CheckoutRow({ checkout, dbCheckoutId }: CheckoutRowProps) {
  const isReturned = checkout.returnedAt !== null;
  const isOverdue = !isReturned && new Date() > checkout.dueDate;

  return (
    <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 shrink-0 mt-0.5">
          <Package className="h-4 w-4 text-amber-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">{checkout.assetName}</p>
          <p className="text-xs text-muted-foreground">{checkout.labDivision}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 flex-wrap">
            <Calendar className="h-3 w-3 shrink-0" />
            <span>Checked out: {formatDate(checkout.checkedOutAt)}</span>
          </div>
          <div className={`flex items-center gap-2 text-xs mt-1 ${isOverdue ? "text-red-600" : "text-muted-foreground"}`}>
            <Calendar className="h-3 w-3 shrink-0" />
            <span>Due: {formatDate(checkout.dueDate)}</span>
          </div>
        </div>
      </div>
      <div className="ml-4 shrink-0">
        {isReturned ? (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Returned</p>
            <p className="text-xs text-green-600 font-medium">{checkout.returnedAt ? formatDate(checkout.returnedAt) : "—"}</p>
          </div>
        ) : dbCheckoutId ? (
          <ReturnCheckoutButton checkoutId={dbCheckoutId} isOverdue={isOverdue} />
        ) : (
          // Placeholder mode: show disabled button
          <ReturnCheckoutButton checkoutId={checkout.id} isOverdue={isOverdue} />
        )}
      </div>
    </div>
  );
}

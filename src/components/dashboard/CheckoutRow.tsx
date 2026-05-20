import { Button } from "@/components/ui/button";
import { Package, Calendar, RotateCcw } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { PlaceholderCheckout } from "@/lib/placeholder/dashboard";

interface CheckoutRowProps {
  checkout: PlaceholderCheckout;
}

export function CheckoutRow({ checkout }: CheckoutRowProps) {
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
        ) : (
          <Button
            variant="outline"
            size="sm"
            className={isOverdue ? "border-red-200 text-red-600 hover:bg-red-50" : ""}
            disabled
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Return
          </Button>
        )}
      </div>
    </div>
  );
}

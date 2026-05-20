import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";
import { formatDateShort } from "@/lib/utils";

interface QueueRowProps {
  id: string;
  title: string;
  requestedBy?: string;
  vendor?: string;
  quantity: number;
  unit: string;
  cost?: number;
  requestedAt: Date;
  status: string;
}

export function QueueRow({
  title,
  requestedBy,
  vendor,
  quantity,
  unit,
  cost,
  requestedAt,
  status,
}: QueueRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{title}</TableCell>
      {requestedBy && <TableCell className="text-muted-foreground">{requestedBy}</TableCell>}
      {vendor && <TableCell className="text-muted-foreground">{vendor}</TableCell>}
      <TableCell className="text-right">
        {quantity} {unit}
      </TableCell>
      {cost && <TableCell className="text-right font-mono">₹{cost.toLocaleString()}</TableCell>}
      <TableCell>{formatDateShort(requestedAt)}</TableCell>
      <TableCell>
        <StatusBadge status={status} />
      </TableCell>
      <TableCell className="text-right space-x-2">
        {status === "pending" && (
          <>
            <Button size="sm" variant="outline" className="text-xs">
              Approve
            </Button>
            <Button size="sm" variant="ghost" className="text-xs">
              Reject
            </Button>
          </>
        )}
      </TableCell>
    </TableRow>
  );
}

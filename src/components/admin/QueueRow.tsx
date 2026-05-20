import { TableCell, TableRow } from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";
import { RequestActions } from "./RequestActions";
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
  id,
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
      {cost && <TableCell className="text-right font-mono">&#8377;{cost.toLocaleString()}</TableCell>}
      <TableCell>{formatDateShort(requestedAt)}</TableCell>
      <TableCell>
        <StatusBadge status={status} />
      </TableCell>
      <TableCell className="text-right">
        <RequestActions requestId={id} status={status} />
      </TableCell>
    </TableRow>
  );
}

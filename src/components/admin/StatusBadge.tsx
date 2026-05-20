import { Badge } from "@/components/ui/badge";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

const statusVariantMap: Record<string, BadgeVariant> = {
  pending: "outline",
  approved: "default",
  "in-use": "secondary",
  available: "default",
  maintenance: "destructive",
  active: "default",
  "in-transit": "secondary",
  rejected: "destructive",
  retired: "secondary",
};

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variant = statusVariantMap[status] ?? "outline";
  const displayText = status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, " ");

  return <Badge variant={variant}>{displayText}</Badge>;
}

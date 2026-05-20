import { Badge } from "@/components/ui/badge";
import { GraduationCap, Calendar, AlertCircle, CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { PlaceholderTraining } from "@/lib/placeholder/dashboard";

interface TrainingRowProps {
  training: PlaceholderTraining;
}

export function TrainingRow({ training }: TrainingRowProps) {
  const statusConfig = {
    COMPLETED: {
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
      badge: "default" as const,
    },
    REQUIRED: {
      icon: AlertCircle,
      color: "text-orange-600",
      bg: "bg-orange-50",
      badge: "destructive" as const,
    },
    AVAILABLE: {
      icon: GraduationCap,
      color: "text-blue-600",
      bg: "bg-blue-50",
      badge: "outline" as const,
    },
  };

  const config = statusConfig[training.status];
  const Icon = config.icon;

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <div className={`flex h-9 w-9 items-center justify-center rounded-full ${config.bg} shrink-0 mt-0.5`}>
          <Icon className={`h-4 w-4 ${config.color}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">{training.machineName}</p>
          <p className="text-xs text-muted-foreground">{training.category}</p>
          {training.status === "COMPLETED" && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <Calendar className="h-3 w-3 shrink-0" />
              Completed {formatDate(training.trainedAt)}
            </div>
          )}
        </div>
      </div>
      <Badge variant={config.badge} className="ml-4 shrink-0">
        {training.status === "COMPLETED" && "Certified"}
        {training.status === "REQUIRED" && "Required"}
        {training.status === "AVAILABLE" && "Available"}
      </Badge>
    </div>
  );
}

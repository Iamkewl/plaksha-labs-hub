import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";
import { formatDateShort } from "@/lib/utils";
import type { PlaceholderBooking } from "@/lib/placeholder/dashboard";

interface BookingRowProps {
  booking: PlaceholderBooking;
}

export function BookingRow({ booking }: BookingRowProps) {
  const statusVariants: Record<
    PlaceholderBooking["status"],
    "default" | "secondary" | "destructive" | "outline"
  > = {
    PENDING: "outline",
    CONFIRMED: "default",
    IN_PROGRESS: "secondary",
    COMPLETED: "secondary",
    CANCELLED: "destructive",
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 shrink-0">
        {booking.machineName ? (
          <CalendarDays className="h-4 w-4 text-blue-600" />
        ) : (
          <Users className="h-4 w-4 text-blue-600" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {booking.machineName ?? booking.mentorName ?? "Session"}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
          <Clock className="h-3 w-3 shrink-0" />
          <span>{formatDateShort(booking.startTime)}</span>
          {booking.location && (
            <>
              <MapPin className="h-3 w-3 shrink-0" />
              <span>{booking.location}</span>
            </>
          )}
        </div>
      </div>
      <Badge variant={statusVariants[booking.status]} className="text-xs shrink-0">
        {booking.status}
      </Badge>
    </div>
  );
}

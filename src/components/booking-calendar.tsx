"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type BookingSlot = {
  id: string;
  startTime: string | Date;
  endTime: string | Date;
  status: string;
  user?: { name: string | null } | null;
  purpose?: string | null;
};

type Props = {
  bookings: BookingSlot[];
  startDate?: Date;
  daysToShow?: number;
  hourStart?: number;
  hourEnd?: number;
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 border-amber-300 text-amber-800",
  CONFIRMED: "bg-blue-100 border-blue-300 text-blue-800",
  IN_PROGRESS: "bg-violet-100 border-violet-300 text-violet-800",
  COMPLETED: "bg-emerald-100 border-emerald-300 text-emerald-800",
  CANCELLED: "bg-red-100 border-red-300 text-red-800 opacity-50",
};

export function BookingCalendar({
  bookings,
  startDate,
  daysToShow = 7,
  hourStart = 8,
  hourEnd = 20,
}: Props) {
  const start = startDate ?? getMonday(new Date());
  const days = Array.from({ length: daysToShow }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });

  const hours = Array.from(
    { length: hourEnd - hourStart },
    (_, i) => hourStart + i
  );

  const totalMinutes = (hourEnd - hourStart) * 60;

  return (
    <div className="overflow-x-auto">
      <div
        className="grid min-w-[700px]"
        style={{
          gridTemplateColumns: `60px repeat(${daysToShow}, minmax(100px, 1fr))`,
        }}
      >
        {/* Header row */}
        <div className="sticky top-0 z-10 bg-background border-b" />
        {days.map((day) => {
          const isToday = isSameDay(day, new Date());
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "sticky top-0 z-10 border-b border-l px-2 py-2 text-center text-sm bg-background",
                isToday && "bg-blue-50"
              )}
            >
              <div className="font-medium">
                {day.toLocaleDateString("en-IN", { weekday: "short" })}
              </div>
              <div
                className={cn(
                  "text-xs",
                  isToday
                    ? "font-bold text-blue-600"
                    : "text-muted-foreground"
                )}
              >
                {day.toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          );
        })}

        {/* Time grid */}
        {hours.map((hour) => (
          <>
            {/* Time label */}
            <div
              key={`label-${hour}`}
              className="border-b pr-2 py-1 text-right text-xs text-muted-foreground"
            >
              {formatHour(hour)}
            </div>

            {/* Day cells */}
            {days.map((day) => {
              const isToday = isSameDay(day, new Date());
              return (
                <div
                  key={`${day.toISOString()}-${hour}`}
                  className={cn(
                    "relative border-b border-l min-h-[40px]",
                    isToday && "bg-blue-50/30"
                  )}
                />
              );
            })}
          </>
        ))}

        {/* Overlay: booking blocks */}
        {/* We render them in a second pass, absolutely positioned */}
      </div>

      {/* Booking blocks overlay */}
      <div
        className="relative grid min-w-[700px]"
        style={{
          gridTemplateColumns: `60px repeat(${daysToShow}, minmax(100px, 1fr))`,
          marginTop: `-${hours.length * 40 + 2}px`,
          height: `${hours.length * 40}px`,
          pointerEvents: "none",
        }}
      >
        <div /> {/* spacer for time column */}
        {days.map((day, dayIndex) => (
          <div key={dayIndex} className="relative border-l">
            {bookings
              .filter((b) => {
                const bStart = new Date(b.startTime);
                return isSameDay(bStart, day);
              })
              .filter((b) => b.status !== "CANCELLED")
              .map((booking) => {
                const bStart = new Date(booking.startTime);
                const bEnd = new Date(booking.endTime);

                const startMinutes =
                  (bStart.getHours() - hourStart) * 60 + bStart.getMinutes();
                const endMinutes =
                  (bEnd.getHours() - hourStart) * 60 + bEnd.getMinutes();
                const duration = Math.max(endMinutes - startMinutes, 15);

                const topPct = (startMinutes / totalMinutes) * 100;
                const heightPct = (duration / totalMinutes) * 100;

                if (topPct < 0 || topPct >= 100) return null;

                return (
                  <div
                    key={booking.id}
                    className={cn(
                      "absolute left-1 right-1 rounded-md border px-1.5 py-0.5 text-xs overflow-hidden pointer-events-auto",
                      STATUS_COLORS[booking.status] ?? "bg-gray-100 border-gray-300"
                    )}
                    style={{
                      top: `${topPct}%`,
                      height: `${Math.max(heightPct, 3)}%`,
                    }}
                    title={`${booking.user?.name ?? "User"} — ${booking.purpose ?? booking.status}`}
                  >
                    <div className="font-medium truncate">
                      {booking.user?.name ?? "Booked"}
                    </div>
                    {heightPct > 8 && (
                      <div className="truncate opacity-70">
                        {bStart.toLocaleTimeString("en-IN", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                        {" – "}
                        {bEnd.toLocaleTimeString("en-IN", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-3 text-xs">
        {["PENDING", "CONFIRMED", "IN_PROGRESS"].map((status) => (
          <div key={status} className="flex items-center gap-1.5">
            <span
              className={cn(
                "inline-block h-2.5 w-2.5 rounded-sm border",
                STATUS_COLORS[status]
              )}
            />
            <span className="text-muted-foreground">
              {status.replace("_", " ")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

function formatHour(hour: number): string {
  const h = hour % 12 || 12;
  const ampm = hour < 12 ? "AM" : "PM";
  return `${h} ${ampm}`;
}

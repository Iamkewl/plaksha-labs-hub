import { requireRole } from "@/lib/auth-guard";
import { getMentorAvailability } from "@/app/actions/availability";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AddAvailabilityForm } from "./add-availability-form";
import { AvailabilityActions } from "./availability-actions";

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default async function MentorAvailabilityPage() {
  await requireRole("MENTOR", "ADMIN");

  const slots = await getMentorAvailability();

  const recurringSlots = slots.filter((s) => s.dayOfWeek !== null);
  const oneOffSlots = slots.filter((s) => s.date !== null);

  return (
    <div>
      <h1 className="text-3xl font-bold">My Availability</h1>
      <p className="text-muted-foreground">
        Manage your available time slots for student mentoring sessions
      </p>

      {/* Add Slot Form */}
      <div className="mt-6">
        <AddAvailabilityForm />
      </div>

      {/* Recurring Slots */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Weekly Recurring Slots ({recurringSlots.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {recurringSlots.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No recurring availability set. Add slots above so students can book sessions with you.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>End</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recurringSlots.map((slot) => (
                  <TableRow key={slot.id}>
                    <TableCell className="font-medium">
                      {dayNames[slot.dayOfWeek!]}
                    </TableCell>
                    <TableCell>{slot.startTime}</TableCell>
                    <TableCell>{slot.endTime}</TableCell>
                    <TableCell>
                      <Badge variant={slot.isActive ? "default" : "secondary"}>
                        {slot.isActive ? "Active" : "Paused"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <AvailabilityActions slotId={slot.id} isActive={slot.isActive} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* One-off Slots */}
      {oneOffSlots.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>One-off Slots ({oneOffSlots.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>End</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {oneOffSlots.map((slot) => (
                  <TableRow key={slot.id}>
                    <TableCell className="font-medium">
                      {slot.date?.toLocaleDateString("en-IN", { dateStyle: "medium" })}
                    </TableCell>
                    <TableCell>{slot.startTime}</TableCell>
                    <TableCell>{slot.endTime}</TableCell>
                    <TableCell>
                      <Badge variant={slot.isActive ? "default" : "secondary"}>
                        {slot.isActive ? "Active" : "Paused"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <AvailabilityActions slotId={slot.id} isActive={slot.isActive} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

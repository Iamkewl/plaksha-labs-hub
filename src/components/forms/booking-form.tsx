"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, CheckCircle2, Clock, Wrench } from "lucide-react";
import { createBooking } from "@/app/actions/bookings";

interface Machine {
  id: string;
  name: string;
  category: string;
  location: string;
  status: string;
  requiresTraining: boolean;
  requiresMentorSupport: boolean;
  costPerHour: number;
}

interface Mentor {
  id: string;
  name: string | null;
  email: string;
}

interface TrainedMachineId {
  machineId: string;
}

interface BookingFormProps {
  machines: Machine[];
  mentors: Mentor[];
  trainedMachineIds: TrainedMachineId[];
  existingBookings: {
    id: string;
    machineId: string | null;
    mentorId: string | null;
    startTime: Date;
    endTime: Date;
  }[];
}

export function BookingForm({
  machines,
  mentors,
  trainedMachineIds,
  existingBookings,
}: BookingFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [bookingType, setBookingType] = useState<"machine" | "mentor">("machine");

  const [selectedMachineId, setSelectedMachineId] = useState("");
  const [selectedMentorId, setSelectedMentorId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [purpose, setPurpose] = useState("");
  const [notes, setNotes] = useState("");

  const trainedSet = new Set(trainedMachineIds.map((t) => t.machineId));
  const availableMachines = machines.filter((m) => m.status === "AVAILABLE");

  const selectedMachine = machines.find((m) => m.id === selectedMachineId);
  const isTrained = selectedMachineId ? trainedSet.has(selectedMachineId) : true;
  const needsTraining = selectedMachine?.requiresTraining && !isTrained;
  const mentorRequiredForMachine =
    bookingType === "machine" && !!selectedMachine?.requiresMentorSupport;

  // Check for time conflicts in selected slot
  const [conflict, setConflict] = useState<string | null>(null);

  useEffect(() => {
    if (!date || !startTime || !endTime) {
      setConflict(null);
      return;
    }

    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      setConflict(null);
      return;
    }

    if (bookingType === "machine" && !selectedMachineId) {
      setConflict(null);
      return;
    }

    if (bookingType === "mentor" && !selectedMentorId) {
      setConflict(null);
      return;
    }

    let overlapping =
      bookingType === "machine"
        ? existingBookings.find((b) => {
            if (b.machineId !== selectedMachineId) return false;
            const bStart = new Date(b.startTime);
            const bEnd = new Date(b.endTime);
            return start < bEnd && end > bStart;
          })
        : existingBookings.find((b) => {
            if (b.mentorId !== selectedMentorId) return false;
            const bStart = new Date(b.startTime);
            const bEnd = new Date(b.endTime);
            return start < bEnd && end > bStart;
          });

    // For support-required machine bookings, also validate mentor collisions.
    if (
      !overlapping &&
      bookingType === "machine" &&
      mentorRequiredForMachine &&
      selectedMentorId
    ) {
      overlapping = existingBookings.find((b) => {
        if (b.mentorId !== selectedMentorId) return false;
        const bStart = new Date(b.startTime);
        const bEnd = new Date(b.endTime);
        return start < bEnd && end > bStart;
      });
      if (overlapping) {
        setConflict(
          `Mentor conflict: already booked ${new Date(overlapping.startTime).toLocaleTimeString()} – ${new Date(overlapping.endTime).toLocaleTimeString()}`
        );
        return;
      }
    }

    setConflict(
      overlapping
        ? `Conflict: already booked ${new Date(overlapping.startTime).toLocaleTimeString()} – ${new Date(overlapping.endTime).toLocaleTimeString()}`
        : null
    );
  }, [
    date,
    startTime,
    endTime,
    selectedMachineId,
    selectedMentorId,
    bookingType,
    mentorRequiredForMachine,
    existingBookings,
  ]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);

    const data = {
      machineId: bookingType === "machine" ? selectedMachineId : undefined,
      mentorId: selectedMentorId || undefined,
      startTime: startDateTime,
      endTime: endDateTime,
      purpose,
      notes: notes || undefined,
    };

    try {
      await createBooking(data);
      router.push("/bookings");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create booking");
    } finally {
      setLoading(false);
    }
  }

  // Set minimum date to today
  const today = new Date().toISOString().split("T")[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Booking</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Booking Type Tabs */}
          <Tabs
            value={bookingType}
            onValueChange={(v) => setBookingType(v as "machine" | "mentor")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="machine">
                <Wrench className="mr-2 h-4 w-4" />
                Machine
              </TabsTrigger>
              <TabsTrigger value="mentor">
                <Clock className="mr-2 h-4 w-4" />
                Mentor Session
              </TabsTrigger>
            </TabsList>

            <TabsContent value="machine" className="mt-4">
              <div className="space-y-2">
                <Label htmlFor="machineId">Select Machine *</Label>
                <Select value={selectedMachineId} onValueChange={setSelectedMachineId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a machine..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMachines.map((machine) => (
                      <SelectItem key={machine.id} value={machine.id}>
                        <span className="flex items-center gap-2">
                          {machine.name}
                          <span className="text-xs text-muted-foreground">
                            — {machine.category}, {machine.location}
                          </span>
                          {machine.requiresTraining && !trainedSet.has(machine.id) && (
                            <Badge variant="destructive" className="ml-1 text-[10px]">
                              Training Required
                            </Badge>
                          )}
                          {machine.requiresTraining && trainedSet.has(machine.id) && (
                            <Badge variant="default" className="ml-1 text-[10px]">
                              Trained
                            </Badge>
                          )}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Training gate warning */}
                {needsTraining && (
                  <div className="flex items-start gap-2 rounded-md bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <div>
                      <p className="font-medium">Training required</p>
                      <p className="text-xs">
                        You need to complete training on &quot;{selectedMachine?.name}&quot; before
                        booking. Contact an admin to schedule training.
                      </p>
                    </div>
                  </div>
                )}

                {selectedMachine && !needsTraining && (
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle2 className="h-4 w-4" />
                    {selectedMachine.requiresTraining
                      ? "Training verified — you can book this machine"
                      : "No training required"}
                    {selectedMachine.costPerHour > 0 && (
                      <span className="ml-auto text-muted-foreground">
                        ₹{selectedMachine.costPerHour}/hr
                      </span>
                    )}
                  </div>
                )}

                {selectedMachine?.requiresMentorSupport && (
                  <div className="space-y-2 rounded-md border border-blue-200 bg-blue-50 p-3">
                    <Label htmlFor="machineMentorId" className="text-blue-900">
                      Mentor Technical Support Required *
                    </Label>
                    <Select value={selectedMentorId} onValueChange={setSelectedMentorId}>
                      <SelectTrigger id="machineMentorId">
                        <SelectValue placeholder="Select mentor support..." />
                      </SelectTrigger>
                      <SelectContent>
                        {mentors.map((mentor) => (
                          <SelectItem key={mentor.id} value={mentor.id}>
                            {mentor.name ?? mentor.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-blue-800">
                      This machine requires a mentor to be booked in the same slot.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="mentor" className="mt-4">
              <div className="space-y-2">
                <Label htmlFor="mentorId">Select Mentor *</Label>
                <Select value={selectedMentorId} onValueChange={setSelectedMentorId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a mentor..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mentors.map((mentor) => (
                      <SelectItem key={mentor.id} value={mentor.id}>
                        {mentor.name ?? mentor.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {mentors.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No mentors available at this time.
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Date & Time */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                required
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                required
                min="08:00"
                max="22:00"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time *</Label>
              <Input
                id="endTime"
                type="time"
                required
                min="08:30"
                max="22:00"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          {/* Conflict indicator */}
          {conflict && (
            <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              {conflict}
            </div>
          )}

          {/* Purpose */}
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose *</Label>
            <Input
              id="purpose"
              required
              placeholder="What will you be working on?"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              maxLength={500}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              rows={2}
              placeholder="Any special requirements or details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={1000}
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={loading || !!needsTraining || !!conflict || (mentorRequiredForMachine && !selectedMentorId)}
              className="flex-1"
            >
              {loading ? "Creating..." : "Create Booking"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

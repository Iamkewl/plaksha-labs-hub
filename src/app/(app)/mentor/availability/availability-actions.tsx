"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteAvailability, toggleAvailability } from "@/app/actions/availability";
import { Pause, Play, Trash2 } from "lucide-react";

interface AvailabilityActionsProps {
  slotId: string;
  isActive: boolean;
}

export function AvailabilityActions({ slotId, isActive }: AvailabilityActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    try {
      await toggleAvailability(slotId);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this availability slot?")) return;
    setLoading(true);
    try {
      await deleteAvailability(slotId);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-1">
      <Button
        size="sm"
        variant="ghost"
        disabled={loading}
        onClick={handleToggle}
        title={isActive ? "Pause" : "Resume"}
      >
        {isActive ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
      </Button>
      <Button
        size="sm"
        variant="ghost"
        disabled={loading}
        onClick={handleDelete}
        title="Delete"
        className="text-destructive hover:text-destructive"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}

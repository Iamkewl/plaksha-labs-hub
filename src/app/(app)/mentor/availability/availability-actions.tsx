"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteAvailability, toggleAvailability } from "@/app/actions/availability";
import { Pause, Play, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AvailabilityActionsProps {
  slotId: string;
  isActive: boolean;
}

export function AvailabilityActions({ slotId, isActive }: AvailabilityActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  async function handleToggle() {
    setLoading(true);
    try {
      await toggleAvailability(slotId);
      router.refresh();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed",
        description: err instanceof Error ? err.message : "Failed",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setLoading(true);
    setDeleteOpen(false);
    try {
      await deleteAvailability(slotId);
      router.refresh();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed",
        description: err instanceof Error ? err.message : "Failed",
      });
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

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            disabled={loading}
            title="Delete"
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete availability slot?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this slot. Students will no longer be
              able to book it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={loading}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteTraining } from "@/app/actions/training";
import { Trash2 } from "lucide-react";

export function TrainingActions({ trainingId }: { trainingId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Remove this training record? The student will lose booking access for this machine.")) {
      return;
    }

    setLoading(true);
    try {
      await deleteTraining(trainingId);
      router.refresh();
    } catch {
      alert("Failed to delete training record");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      disabled={loading}
      title="Remove training"
    >
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  );
}

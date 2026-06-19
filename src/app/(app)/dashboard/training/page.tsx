import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrainingRow } from "@/components/dashboard/TrainingRow";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { type PlaceholderTraining } from "@/lib/placeholder/dashboard";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { getMyTrainings } from "@/app/actions/training";

export const dynamic = "force-dynamic";

export default async function DashboardTrainingPage() {
  let completed: PlaceholderTraining[] = [];

  try {
    const trainings = await getMyTrainings();
    completed = trainings.map((t) => ({
      id: t.id,
      machineId: t.machineId,
      machineName: t.machine.name,
      category: t.machine.category,
      trainedAt: t.trainedAt,
      status: "COMPLETED" as const,
    }));
  } catch {
    // DB error — fall through with empty array; never show fake data
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Training & Certifications</h1>
        <p className="mt-1 text-muted-foreground">
          View your completed training and discover new skills to learn
        </p>
      </div>

      {/* Completed Trainings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Completed Trainings</CardTitle>
        </CardHeader>
        <CardContent>
          {completed.length === 0 ? (
            <EmptyState
              icon={GraduationCap}
              title="No completed trainings yet"
              description="Your certifications will appear here once you complete training"
            />
          ) : (
            <div className="space-y-3">
              {completed.map((training) => (
                <TrainingRow key={training.id} training={training} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Trainings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Available Trainings</CardTitle>
          <Link href="/admin/training">
            <Button variant="ghost" size="sm">
              View all
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={GraduationCap}
            title="No available trainings"
            description="Check back later for new training opportunities"
          />
        </CardContent>
      </Card>
    </div>
  );
}

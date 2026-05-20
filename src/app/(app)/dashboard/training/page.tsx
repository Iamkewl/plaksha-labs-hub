import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrainingRow } from "@/components/dashboard/TrainingRow";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { PLACEHOLDER_TRAININGS } from "@/lib/placeholder/dashboard";
import { GraduationCap } from "lucide-react";
import Link from "next/link";

export default function DashboardTrainingPage() {
  const completed = PLACEHOLDER_TRAININGS.filter((t) => t.status === "COMPLETED");
  const required = PLACEHOLDER_TRAININGS.filter((t) => t.status === "REQUIRED");
  const available = PLACEHOLDER_TRAININGS.filter((t) => t.status === "AVAILABLE");

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

      {/* Required for Upcoming Bookings */}
      {required.length > 0 && (
        <Card className="border-orange-200 bg-orange-50/30">
          <CardHeader>
            <CardTitle className="text-base text-orange-800 flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Required Training
            </CardTitle>
            <p className="text-sm text-orange-700/70 mt-1">
              Complete these trainings to use the machines you&apos;ve booked
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {required.map((training) => (
                <TrainingRow key={training.id} training={training} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
          {available.length === 0 ? (
            <EmptyState
              icon={GraduationCap}
              title="No available trainings"
              description="Check back later for new training opportunities"
            />
          ) : (
            <div className="space-y-3">
              {available.map((training) => (
                <TrainingRow key={training.id} training={training} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { requireRole } from "@/lib/auth-guard";
import { getTrainings } from "@/app/actions/training";
import { getMachines } from "@/app/actions/machines";
import { getUsers } from "@/app/actions/users";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { TrainingActions } from "./training-actions";
import { AddTrainingForm } from "./add-training-form";
import { ReactiveMetric, ReactiveReveal } from "@/components/once-ui/reactive-elements";

export default async function TrainingPage() {
  await requireRole("ADMIN");

  const [trainings, machines, users] = await Promise.all([
    getTrainings(),
    getMachines(),
    getUsers({ role: "STUDENT" }),
  ]);

  return (
    <div>
      <ReactiveReveal className="space-y-1" translateY={0.35}>
        <h1 className="text-3xl font-bold">Training Records</h1>
        <p className="text-muted-foreground">
          Manage machine training certifications for students
        </p>
      </ReactiveReveal>

      {/* Add Training Form */}
      <ReactiveReveal delay={0.04} className="mt-6" translateY={0.4}>
        <AddTrainingForm
          users={users.map((u) => ({ id: u.id, name: u.name, email: u.email }))}
          machines={machines.map((m) => ({ id: m.id, name: m.name }))}
        />
      </ReactiveReveal>

      {/* Training Records Table */}
      <ReactiveReveal delay={0.08} translateY={0.5}>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>All Training Records (<ReactiveMetric value={trainings.length} />)</CardTitle>
          </CardHeader>
          <CardContent>
            {trainings.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No training records yet. Add one above.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Machine</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Trained At</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainings.map((training) => (
                    <TableRow key={training.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {training.user.name ?? "—"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {training.user.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{training.machine.name}</TableCell>
                      <TableCell>{training.machine.category}</TableCell>
                      <TableCell>{formatDate(training.trainedAt)}</TableCell>
                      <TableCell>
                        <TrainingActions trainingId={training.id} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </ReactiveReveal>
    </div>
  );
}

import { getMachines, getMachineCategories } from "@/app/actions/machines";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Plus, Wrench } from "lucide-react";
import { MachineFilters } from "./machine-filters";
import { ReactiveMetric, ReactiveReveal } from "@/components/once-ui/reactive-elements";

export default async function MachinesPage({
  searchParams,
}: {
  searchParams: { category?: string; status?: string; search?: string };
}) {
  const session = await auth();
  const [machines, categories] = await Promise.all([
    getMachines(searchParams),
    getMachineCategories(),
  ]);

  const statusColors: Record<string, string> = {
    AVAILABLE: "bg-green-100 text-green-800",
    IN_USE: "bg-blue-100 text-blue-800",
    MAINTENANCE: "bg-yellow-100 text-yellow-800",
    RETIRED: "bg-gray-100 text-gray-800",
  };

  return (
    <div>
      <ReactiveReveal className="flex items-center justify-between gap-3" translateY={0.35}>
        <div>
          <h1 className="text-3xl font-bold">Machines</h1>
          <p className="text-muted-foreground">
            Browse and book makerspace equipment
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Showing <ReactiveMetric value={machines.length} className="font-semibold text-foreground" /> result{machines.length === 1 ? "" : "s"}
          </p>
        </div>
        {session?.user.role === "ADMIN" && (
          <Link href="/admin/machines/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Machine
            </Button>
          </Link>
        )}
      </ReactiveReveal>

      <ReactiveReveal delay={0.04} translateY={0.4}>
        <MachineFilters categories={categories} />
      </ReactiveReveal>

      {machines.length === 0 ? (
        <ReactiveReveal delay={0.08} translateY={0.45}>
          <div className="mt-12 text-center">
            <Wrench className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No machines found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filters.
            </p>
          </div>
        </ReactiveReveal>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {machines.map((machine, index) => (
            <ReactiveReveal key={machine.id} delay={0.06 + index * 0.02} translateY={0.35}>
              <Link href={`/catalog/machines/${machine.id}`}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  {machine.imageUrl && (
                    <div className="aspect-video overflow-hidden rounded-t-lg bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={machine.imageUrl}
                        alt={machine.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{machine.name}</CardTitle>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          statusColors[machine.status] ?? ""
                        }`}
                      >
                        {machine.status.replace("_", " ")}
                      </span>
                    </div>
                    <Badge variant="outline">{machine.category}</Badge>
                  </CardHeader>
                  <CardContent>
                    {machine.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {machine.description}
                      </p>
                    )}
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {machine.location}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(machine.costPerHour)}/hr
                      </span>
                    </div>
                    {machine.requiresTraining && (
                      <Badge variant="secondary" className="mt-2">
                        Training Required
                      </Badge>
                    )}
                    {machine.requiresMentorSupport && (
                      <Badge variant="outline" className="mt-2 ml-2">
                        Mentor Support Required
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </Link>
            </ReactiveReveal>
          ))}
        </div>
      )}
    </div>
  );
}

import { requireRole } from "@/lib/auth-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Eye } from "lucide-react";
import { PLACEHOLDER_LABS_ADMIN } from "@/lib/placeholder/admin";
import { getLabs } from "@/app/actions/labs";

export default async function LabsPage() {
  await requireRole("ADMIN");

  let labs: Array<{
    id: string;
    name: string;
    slug: string;
    location: string | null;
    divisionsCount: number;
    status: string;
  }> = PLACEHOLDER_LABS_ADMIN;

  try {
    const fromDb = await getLabs();
    if (fromDb.length) {
      labs = fromDb.map((lab) => ({
        id: lab.id,
        name: lab.name,
        slug: lab.slug,
        location: lab.location ?? null,
        divisionsCount: lab._count.assets > 0 ? lab.divisions.length : lab.divisions.length,
        status: lab.isPublic ? "active" : "inactive",
      }));
    }
  } catch {
    // DB unavailable — keep placeholder
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Labs Management</h1>
          <p className="text-muted-foreground">
            Manage makerspace labs and their divisions.
          </p>
        </div>
        <Button disabled>
          <Plus className="mr-2 h-4 w-4" />
          Add Lab
        </Button>
      </div>

      {/* Labs Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Labs ({labs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {labs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No labs created yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Divisions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {labs.map((lab) => (
                    <TableRow key={lab.id}>
                      <TableCell className="font-medium">
                        {lab.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {lab.slug}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {lab.location}
                      </TableCell>
                      <TableCell>{lab.divisionsCount}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            lab.status === "active" ? "default" : "secondary"
                          }
                        >
                          {lab.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button size="sm" variant="ghost" disabled title="View lab">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" disabled title="Edit lab">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { requireAuth } from "@/lib/auth-guard";
import { getPendingBomReviews } from "@/app/actions/boms";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function MentorMaterialRequestsPage() {
  await requireAuth();

  const requests = await getPendingBomReviews();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Material Reviews</h1>
        <p className="text-muted-foreground">
          Material allocation requests awaiting your first-stage approval
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Reviews</CardTitle>
          <CardDescription>
            {requests.length} request{requests.length !== 1 ? "s" : ""} awaiting your review
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
              <p className="font-medium">No requests awaiting your review</p>
              <p className="text-sm">
                New material allocation requests from your projects will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project / BOM</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead>Review</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>
                        {req.bom ? (
                          <>
                            <Link
                              href={`/projects/${req.bom.project.id}/bom/${req.bom.id}`}
                              className="font-medium hover:underline"
                            >
                              {req.bom.project.name}
                            </Link>
                            <p className="text-xs text-muted-foreground">
                              BOM v{req.bom.version}
                            </p>
                          </>
                        ) : (
                          <span className="text-sm text-muted-foreground">No linked BOM</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{req.material.name}</p>
                        <p className="text-xs text-muted-foreground">{req.material.unit}</p>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {req.requester?.name ?? "—"}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {req.quantity} {req.material.unit}
                      </TableCell>
                      <TableCell>
                        {req.bom ? (
                          <Link
                            href={`/projects/${req.bom.project.id}/bom/${req.bom.id}`}
                            className="text-sm font-medium text-primary hover:underline"
                          >
                            Review
                          </Link>
                        ) : (
                          <Badge variant="outline">PENDING BOM APPROVAL</Badge>
                        )}
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

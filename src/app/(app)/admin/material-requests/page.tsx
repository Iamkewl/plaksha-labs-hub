import { requireRole } from "@/lib/auth-guard";
import { getMaterialRequests } from "@/app/actions/boms";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { RequestActions } from "./request-actions";
import { ReactiveMetric, ReactiveReveal } from "@/components/once-ui/reactive-elements";

const STATUS_COLORS: Record<string, "secondary" | "default" | "outline" | "destructive"> = {
  PENDING_ADMIN_APPROVAL: "secondary",
  APPROVED: "default",
  PARTIALLY_ISSUED: "default",
  ISSUED: "outline",
  BOM_REJECTED: "destructive",
  REJECTED: "destructive",
};

const STATUSES = [
  "PENDING_ADMIN_APPROVAL",
  "APPROVED",
  "PARTIALLY_ISSUED",
  "ISSUED",
  "REJECTED",
  "ALL",
] as const;

export default async function MaterialRequestsAdminPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  await requireRole("ADMIN");

  const activeStatus = searchParams.status ?? "PENDING_ADMIN_APPROVAL";
  const statusFilter = activeStatus !== "ALL" ? activeStatus : undefined;

  const requests = await getMaterialRequests({
    status: statusFilter,
    queue: "admin",
  });

  return (
    <div className="space-y-6">
      <ReactiveReveal className="space-y-1" translateY={0.35}>
        <h1 className="text-3xl font-bold">Material Requests</h1>
        <p className="text-muted-foreground">
          Review and issue requests after BOM-level approval
        </p>
      </ReactiveReveal>

      <ReactiveReveal delay={0.04} className="flex flex-wrap gap-2" translateY={0.4}>
        {STATUSES.map((status) => {
          const active = activeStatus === status;
          return (
            <Link
              key={status}
              href={`/admin/material-requests?status=${status}`}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {status.replaceAll("_", " ")}
            </Link>
          );
        })}
      </ReactiveReveal>

      <ReactiveReveal delay={0.08} translateY={0.5}>
        <Card>
          <CardHeader>
            <CardTitle>
              {statusFilter
                ? `${statusFilter.replaceAll("_", " ")} Requests`
                : "All Requests"}
            </CardTitle>
            <div className="text-sm text-muted-foreground"><ReactiveMetric value={requests.length} /> request(s) found</div>
          </CardHeader>
          <CardContent className="p-0">
            {requests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <p className="font-medium">No material requests</p>
                <p className="text-sm">Requests appear here only after BOM reviewer approval.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project / BOM</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead>Requested By</TableHead>
                      <TableHead className="text-right">Req. Qty</TableHead>
                      <TableHead className="text-right">Approved</TableHead>
                      <TableHead className="text-right">Issued</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          {request.bom ? (
                            <>
                              <Link
                                href={`/projects/${request.bom.project.id}/bom/${request.bom.id}`}
                                className="font-medium hover:underline"
                              >
                                {request.bom.project.name}
                              </Link>
                              <p className="text-xs text-muted-foreground">
                                BOM v{request.bom.version}
                              </p>
                            </>
                          ) : (
                            <span className="text-sm text-muted-foreground">No linked BOM</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{request.material.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Stock: {request.material.currentStock} {request.material.unit}
                          </p>
                        </TableCell>
                        <TableCell>{request.requester.name}</TableCell>
                        <TableCell className="text-right tabular-nums">
                          {request.quantity} {request.material.unit}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {request.approvedQty != null
                            ? `${request.approvedQty} ${request.material.unit}`
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {request.issuedQty != null
                            ? `${request.issuedQty} ${request.material.unit}`
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={STATUS_COLORS[request.status] ?? "secondary"}>
                            {request.status.replaceAll("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <RequestActions
                            requestId={request.id}
                            status={request.status}
                            requestedQty={Number(request.quantity)}
                            unit={request.material.unit}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </ReactiveReveal>
    </div>
  );
}

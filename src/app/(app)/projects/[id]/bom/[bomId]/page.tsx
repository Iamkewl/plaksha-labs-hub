import { requireAuth } from "@/lib/auth-guard";
import {
  createMaterialAllocationRequest,
  getBomById,
  reviewMaterialRequestByBomApprover,
} from "@/app/actions/boms";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { BomActions } from "./bom-actions";

const bomStatusColors: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  DRAFT: "outline",
  SUBMITTED: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
};

const requestStatusColors: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING_BOM_APPROVAL: "outline",
  PENDING_ADMIN_APPROVAL: "secondary",
  BOM_REJECTED: "destructive",
  PENDING: "outline",
  APPROVED: "secondary",
  PARTIALLY_ISSUED: "secondary",
  ISSUED: "default",
  REJECTED: "destructive",
};

export default async function BomDetailPage({
  params,
}: {
  params: { id: string; bomId: string };
}) {
  const session = await requireAuth();

  let bom;
  try {
    bom = await getBomById(params.bomId);
  } catch {
    notFound();
  }

  const member = bom.project.members.find((m) => m.userId === session.user.id);
  const isLead = member?.role === "LEAD";
  const isAdmin = session.user.role === "ADMIN";
  const isProjectMentor = bom.project.mentorId === session.user.id;

  const canSubmit = (isLead || isAdmin) && bom.status === "DRAFT";
  const canApprove = isAdmin;
  const canRequestMaterials =
    bom.status === "APPROVED" && (!!member || isProjectMentor || isAdmin);
  const canReviewBomRequests = isProjectMentor || isAdmin;

  async function handleCreateAllocationRequest(formData: FormData) {
    "use server";

    await createMaterialAllocationRequest({
      bomId: params.bomId,
      materialId: formData.get("materialId"),
      quantity: formData.get("quantity"),
      notes: formData.get("notes") || undefined,
    });

    redirect(`/projects/${params.id}/bom/${params.bomId}`);
  }

  async function handleBomReview(formData: FormData) {
    "use server";

    await reviewMaterialRequestByBomApprover({
      requestId: formData.get("requestId"),
      decision: formData.get("decision"),
      notes: formData.get("reviewNotes") || undefined,
    });

    redirect(`/projects/${params.id}/bom/${params.bomId}`);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Link href={`/projects/${params.id}`}>
            <Button variant="ghost" size="sm" className="-ml-2 mb-1">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {bom.project.name ?? "Project"}
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">BOM v{bom.version}</h1>
            <Badge variant={bomStatusColors[bom.status]}>{bom.status}</Badge>
          </div>
          {bom.approver && (
            <p className="text-sm text-muted-foreground">
              {bom.status === "APPROVED" ? "Approved" : "Reviewed"} by{" "}
              {bom.approver.name} · {bom.approvedAt && formatDate(bom.approvedAt)}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Cost</p>
          <p className="text-2xl font-bold">{formatCurrency(bom.totalCost)}</p>
        </div>
      </div>

      {/* Notes */}
      {bom.notes && (
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">{bom.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Actions panel */}
      {(canSubmit || canApprove) && (
        <BomActions
          bomId={bom.id}
          projectId={params.id}
          status={bom.status}
          canSubmit={canSubmit}
          canApprove={canApprove}
        />
      )}

      {/* BOM Items */}
      <Card>
        <CardHeader>
          <CardTitle>Items ({bom.items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-right">Unit Cost</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bom.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.material.name}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-muted-foreground">{item.material.unit}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.costSnapshot)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.costSnapshot * item.quantity)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.notes ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/30 font-bold">
                <TableCell colSpan={4} className="text-right">
                  Total
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(bom.totalCost)}
                </TableCell>
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {canRequestMaterials && (
        <Card>
          <CardHeader>
            <CardTitle>Allocate Materials Under This BOM</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={handleCreateAllocationRequest} className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="materialId">Material</Label>
                <select
                  id="materialId"
                  name="materialId"
                  required
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select material
                  </option>
                  {bom.items.map((item) => (
                    <option key={item.material.id} value={item.material.id}>
                      {item.material.name} · BOM qty {item.quantity} {item.material.unit}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" name="quantity" type="number" min="0.001" step="any" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input id="notes" name="notes" placeholder="Optional" />
              </div>

              <div className="md:col-span-4">
                <Button type="submit">Submit Allocation Request</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Material Requests (post-approval) */}
      {bom.materialRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Material Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead className="text-right">Requested</TableHead>
                  <TableHead>BOM Review</TableHead>
                  <TableHead>Admin Approval</TableHead>
                  <TableHead className="text-right">Approved Qty</TableHead>
                  <TableHead className="text-right">Issued Qty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bom.materialRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">
                      {req.material.name}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {req.requester?.name ?? "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      {req.quantity} {req.material.unit}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {req.status === "BOM_REJECTED"
                        ? `Rejected by ${req.bomApprover?.name ?? "reviewer"}`
                        : req.bomApprover?.name
                          ? `Approved by ${req.bomApprover.name}`
                          : "Pending"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {req.approver?.name ? `Approved by ${req.approver.name}` : "Pending"}
                    </TableCell>
                    <TableCell className="text-right">
                      {req.approvedQty != null ? `${req.approvedQty} ${req.material.unit}` : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      {req.issuedQty != null ? `${req.issuedQty} ${req.material.unit}` : "—"}
                    </TableCell>
                                <TableCell>
                                  <Badge variant={requestStatusColors[req.status]}>
                                    {req.status.replaceAll("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {canReviewBomRequests && ["PENDING_BOM_APPROVAL", "PENDING"].includes(req.status) ? (
                        <div className="flex gap-2">
                          <form action={handleBomReview}>
                            <input type="hidden" name="requestId" value={req.id} />
                            <input type="hidden" name="decision" value="APPROVE" />
                            <Button type="submit" size="sm" variant="outline">
                              Approve
                            </Button>
                          </form>
                          <form action={handleBomReview}>
                            <input type="hidden" name="requestId" value={req.id} />
                            <input type="hidden" name="decision" value="REJECT" />
                            <Button type="submit" size="sm" variant="destructive">
                              Reject
                            </Button>
                          </form>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {req.issuer?.name ? `Issued by ${req.issuer.name}` : "—"}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

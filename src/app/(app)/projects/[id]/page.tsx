import { requireAuth } from "@/lib/auth-guard";
import {
  getProjectById,
  getStudents,
  removeProjectMember,
  updateProjectVisibility,
} from "@/app/actions/projects";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, FileText, Globe, Lock, Plus, UserMinus } from "lucide-react";
import Link from "next/link";
import { formatDate, formatCurrency, formatStatus } from "@/lib/utils";
import { AddMemberForm } from "./add-member-form";
import { ReactiveMetric, ReactiveReveal } from "@/components/once-ui/reactive-elements";

const bomStatusColors: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  DRAFT: "outline",
  SUBMITTED: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
};

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await requireAuth();
  const project = await getProjectById(params.id).catch(() => null);
  if (!project) {
    notFound();
  }
  const currentVisibility = project.isPublic;

  const currentMember = project.members.find((m) => m.userId === session.user.id);
  const isLead = currentMember?.role === "LEAD";
  const isAdmin = session.user.role === "ADMIN";
  const canManage = isLead || isAdmin;

  // For add-member form: fetch students not already in the project
  let allUsers: { id: string; name: string | null; email: string }[] = [];
  if (canManage) {
    const students = await getStudents();
    const memberIds = new Set(project.members.map((m) => m.userId));
    allUsers = students.filter((s) => !memberIds.has(s.id));
  }

  async function handleRemoveMember(formData: FormData) {
    "use server";
    const userId = formData.get("userId") as string;
    await removeProjectMember(params.id, userId);
    redirect(`/projects/${params.id}`);
  }

  async function handleToggleVisibility() {
    "use server";
    await updateProjectVisibility({
      projectId: params.id,
      isPublic: !currentVisibility,
    });
    redirect(`/projects/${params.id}`);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <ReactiveReveal className="flex items-start justify-between gap-3" translateY={0.35}>
        <div className="space-y-1">
          <Link href="/projects">
            <Button variant="ghost" size="sm" className="-ml-2 mb-1">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Projects
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          {project.description && (
            <p className="text-muted-foreground">{project.description}</p>
          )}
          {project.mentor && (
            <p className="text-sm text-muted-foreground">
              Mentor: <span className="font-medium">{project.mentor.name ?? project.mentor.email}</span>
            </p>
          )}
          <div className="flex items-center gap-2 pt-1">
            <Badge variant="secondary" className="gap-1">
              {project.isPublic ? (
                <>
                  <Globe className="h-3.5 w-3.5" />
                  Public
                </>
              ) : (
                <>
                  <Lock className="h-3.5 w-3.5" />
                  Private
                </>
              )}
            </Badge>
            {canManage && (
              <form action={handleToggleVisibility}>
                <Button type="submit" variant="outline" size="sm">
                  {project.isPublic ? "Make Private" : "Make Public"}
                </Button>
              </form>
            )}
          </div>
        </div>
        {canManage && (
          <Link href={`/projects/${project.id}/bom/new`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New BOM
            </Button>
          </Link>
        )}
      </ReactiveReveal>

      {/* Members */}
      <ReactiveReveal delay={0.05} translateY={0.45}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Members
              <Badge variant="secondary"><ReactiveMetric value={project.members.length} /></Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  {canManage && <TableHead className="w-12" />}
                </TableRow>
              </TableHeader>
              <TableBody>
                {project.members.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">
                      {m.user.name ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {m.user.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant={m.role === "LEAD" ? "default" : "secondary"}>
                        {m.role}
                      </Badge>
                    </TableCell>
                    {canManage && (
                      <TableCell>
                        {(m.role !== "LEAD" || project.members.filter((x) => x.role === "LEAD").length > 1) && (
                          <form action={handleRemoveMember}>
                            <input type="hidden" name="userId" value={m.userId} />
                            <Button
                              type="submit"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              title="Remove member"
                              aria-label="Remove member"
                            >
                              <UserMinus className="h-3.5 w-3.5" />
                            </Button>
                          </form>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {canManage && allUsers.length > 0 && (
              <AddMemberForm projectId={project.id} allUsers={allUsers} />
            )}
          </CardContent>
        </Card>
      </ReactiveReveal>

      {/* BOMs */}
      <ReactiveReveal delay={0.09} translateY={0.5}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                Bills of Materials
                <Badge variant="secondary"><ReactiveMetric value={project.boms.length} /></Badge>
              </CardTitle>
              {canManage && (
                <Link href={`/projects/${project.id}/bom/new`}>
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    New BOM
                  </Button>
                </Link>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {project.boms.length === 0 ? (
              <div className="py-8 text-center">
                <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-3 text-sm text-muted-foreground">No BOMs yet</p>
                {canManage && (
                  <Link href={`/projects/${project.id}/bom/new`}>
                    <Button variant="outline" size="sm" className="mt-4">
                      Create first BOM
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Version</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Cost</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {project.boms.map((bom) => (
                    <TableRow key={bom.id}>
                      <TableCell className="font-medium">v{bom.version}</TableCell>
                      <TableCell>
                        <Badge variant={bomStatusColors[bom.status]}>
                          {formatStatus(bom.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(bom.totalCost)}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {bom.submittedAt ? formatDate(bom.submittedAt) : "—"}
                      </TableCell>
                      <TableCell>
                        <Link href={`/projects/${project.id}/bom/${bom.id}`}>
                          <Button variant="ghost" size="sm" aria-label={`View BOM v${bom.version}`}>
                            View
                          </Button>
                        </Link>
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

import { requireAuth } from "@/lib/auth-guard";
import { getProjectById } from "@/app/actions/projects";
import { getMaterials } from "@/app/actions/materials";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BomBuilder } from "./bom-builder";

export default async function NewBomPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await requireAuth();

  let project;
  try {
    project = await getProjectById(params.id);
  } catch {
    notFound();
  }

  // Only members/leads and admins can create BOMs
  const member = project.members.find((m) => m.userId === session.user.id);
  if (!member && session.user.role !== "ADMIN") {
    notFound();
  }

  const materials = await getMaterials();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center gap-4">
        <Link href={`/projects/${params.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {project.name}
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">New Bill of Materials</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Build BOM</CardTitle>
          <p className="text-sm text-muted-foreground">
            Add materials and quantities. Once created, the BOM starts as a DRAFT
            which you can submit to admin for approval.
          </p>
        </CardHeader>
        <CardContent>
          <BomBuilder projectId={params.id} materials={materials} />
        </CardContent>
      </Card>
    </div>
  );
}

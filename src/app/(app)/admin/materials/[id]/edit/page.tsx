import { requireRole } from "@/lib/auth-guard";
import { getMaterialById } from "@/app/actions/materials";
import { MaterialForm } from "@/components/forms/material-form";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EditMaterialPage({
  params,
}: {
  params: { id: string };
}) {
  await requireRole("ADMIN");
  const material = await getMaterialById(params.id);
  if (!material) notFound();

  return (
    <div>
      <Link
        href={`/catalog/materials/${params.id}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Material
      </Link>
      <div className="mt-4">
        <MaterialForm material={material} />
      </div>
    </div>
  );
}

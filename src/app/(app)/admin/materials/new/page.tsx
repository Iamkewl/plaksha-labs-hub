import { requireRole } from "@/lib/auth-guard";
import { MaterialForm } from "@/components/forms/material-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewMaterialPage() {
  await requireRole("ADMIN");

  return (
    <div>
      <Link
        href="/catalog/materials"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Materials
      </Link>
      <div className="mt-4">
        <MaterialForm />
      </div>
    </div>
  );
}

import { requireRole } from "@/lib/auth-guard";
import { getMachineById } from "@/app/actions/machines";
import { MachineForm } from "@/components/forms/machine-form";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EditMachinePage({
  params,
}: {
  params: { id: string };
}) {
  await requireRole("ADMIN");
  const machine = await getMachineById(params.id);
  if (!machine) notFound();

  return (
    <div>
      <Link
        href={`/catalog/machines/${params.id}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Machine
      </Link>
      <div className="mt-4">
        <MachineForm machine={machine} />
      </div>
    </div>
  );
}

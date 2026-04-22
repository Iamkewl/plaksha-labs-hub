import { requireRole } from "@/lib/auth-guard";
import { MachineForm } from "@/components/forms/machine-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewMachinePage() {
  await requireRole("ADMIN");

  return (
    <div>
      <Link
        href="/catalog/machines"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Machines
      </Link>
      <div className="mt-4">
        <MachineForm />
      </div>
    </div>
  );
}

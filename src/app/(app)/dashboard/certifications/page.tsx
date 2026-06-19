import { Award } from "lucide-react";
import { getMyCertifications } from "@/app/actions/training";
import { CertificateCard } from "@/components/dashboard/CertificateCard";
import { EmptyState } from "@/components/dashboard/EmptyState";

export const dynamic = "force-dynamic";

export default async function CertificationsPage() {
  let certifications: Awaited<ReturnType<typeof getMyCertifications>> = [];

  try {
    certifications = await getMyCertifications();
  } catch {
    // DB unavailable — render empty state; never show fake data
  }

  const count = certifications.length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Certifications</h1>
        <p className="mt-1 text-muted-foreground">
          {count > 0
            ? `You have earned ${count} machine certification${count !== 1 ? "s" : ""}.`
            : "Complete machine training sessions to earn certifications."}
        </p>
      </div>

      {/* Grid or empty state */}
      {count === 0 ? (
        <EmptyState
          icon={Award}
          title="No certifications yet"
          description="Complete machine training to earn certifications — each approved session adds a certificate here."
          action={{
            label: "Browse machines",
            href: "/catalog/machines",
          }}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert) => (
            <CertificateCard
              key={cert.id}
              id={cert.id}
              trainedAt={cert.trainedAt}
              trainedBy={cert.trainedBy}
              certificate={cert.certificate}
              notes={cert.notes}
              machine={cert.machine}
            />
          ))}
        </div>
      )}
    </div>
  );
}

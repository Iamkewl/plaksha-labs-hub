import { AdminSubNav } from "@/components/admin/AdminSubNav";
import { requireRole } from "@/lib/auth-guard";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("ADMIN");

  return (
    <>
      <AdminSubNav />
      <main className="p-4 lg:p-6">
        <div className="mx-auto w-full max-w-[1480px]">{children}</div>
      </main>
    </>
  );
}

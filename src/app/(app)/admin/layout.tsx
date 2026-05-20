import { AdminSubNav } from "@/components/admin/AdminSubNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminSubNav />
      <main className="p-4 lg:p-6">
        <div className="mx-auto w-full max-w-[1480px]">{children}</div>
      </main>
    </>
  );
}

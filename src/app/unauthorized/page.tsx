import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="app-canvas flex min-h-screen items-center justify-center px-4 text-foreground">
      <div className="surface-panel w-full max-w-lg rounded-2xl px-8 py-10 text-center">
        <ShieldAlert className="mx-auto h-16 w-16 text-destructive" />
        <p className="section-kicker mt-5">Authorization</p>
        <h1 className="mt-2 text-3xl font-semibold">Access Denied</h1>
        <p className="mt-2 text-muted-foreground">
          You do not have permission to access this page.
        </p>
        <Link href="/dashboard">
          <Button className="mt-7">Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}

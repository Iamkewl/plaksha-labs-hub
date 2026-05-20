import { Suspense } from "react";
import { RoboticsDashboardTabs } from "./tabs-client";

export const dynamic = "force-dynamic";

export default function RoboticsDashboardPage() {
  return (
    <Suspense fallback={<div className="h-32" aria-busy="true" aria-label="Loading dashboard" />}>
      <RoboticsDashboardTabs />
    </Suspense>
  );
}

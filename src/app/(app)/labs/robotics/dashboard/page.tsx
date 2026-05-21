import { Suspense } from "react";
import { RoboticsDashboardTabs } from "./tabs-client";
import { MechanicalSection } from "@/components/robotics/MechanicalSection";
import { ElectronicsSection } from "@/components/robotics/ElectronicsSection";
import { SharedSection } from "@/components/robotics/SharedSection";

export const dynamic = "force-dynamic";

export default function RoboticsDashboardPage() {
  return (
    <Suspense fallback={<div className="h-32" aria-busy="true" aria-label="Loading dashboard" />}>
      <RoboticsDashboardTabs
        mechanical={<MechanicalSection />}
        electronics={<ElectronicsSection />}
        shared={<SharedSection />}
      />
    </Suspense>
  );
}

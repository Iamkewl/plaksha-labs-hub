"use client";

import type { ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const VALID_TABS = ["mechanical", "electronics", "shared"] as const;
type TabValue = (typeof VALID_TABS)[number];

function isValidTab(value: string | null): value is TabValue {
  return VALID_TABS.includes(value as TabValue);
}

interface RoboticsDashboardTabsProps {
  mechanical: ReactNode;
  electronics: ReactNode;
  shared: ReactNode;
}

export function RoboticsDashboardTabs({
  mechanical,
  electronics,
  shared,
}: RoboticsDashboardTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab: TabValue = isValidTab(tabParam) ? tabParam : "shared";

  function handleTabChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
      <TabsList className="w-full sm:w-auto">
        <TabsTrigger value="mechanical" className="flex-1 sm:flex-none">
          Mechanical
        </TabsTrigger>
        <TabsTrigger value="electronics" className="flex-1 sm:flex-none">
          Electronics
        </TabsTrigger>
        <TabsTrigger value="shared" className="flex-1 sm:flex-none">
          Shared
        </TabsTrigger>
      </TabsList>

      <TabsContent value="mechanical">
        {mechanical}
      </TabsContent>

      <TabsContent value="electronics">
        {electronics}
      </TabsContent>

      <TabsContent value="shared">
        {shared}
      </TabsContent>
    </Tabs>
  );
}

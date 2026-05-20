"use client";

import type { ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { PlaceholderLab } from "@/lib/placeholder/labs";

interface LabTabsProps {
  lab: PlaceholderLab;
  overviewContent: ReactNode;
  divisionsContent: ReactNode;
  hoursContent: ReactNode;
  contactContent: ReactNode;
}

export function LabTabs({
  lab,
  overviewContent,
  divisionsContent,
  hoursContent,
  contactContent,
}: LabTabsProps) {
  const hasDivisions = lab.divisions.length > 0;

  return (
    <Tabs defaultValue="overview" className="mt-10">
      {/* Tab list — scrollable on mobile */}
      <div className="overflow-x-auto pb-0.5">
        <TabsList className="h-auto gap-0 rounded-none border-b border-border/60 bg-transparent p-0">
          {(
            [
              { value: "overview", label: "Overview" },
              ...(hasDivisions
                ? [{ value: "divisions", label: "Divisions" }]
                : []),
              { value: "hours", label: "Opening Hours" },
              { value: "contact", label: "Contact" },
            ] as { value: string; label: string }[]
          ).map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="relative rounded-none border-b-2 border-transparent bg-transparent px-5 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <div className="mt-8">
        <TabsContent value="overview" className="mt-0">
          {overviewContent}
        </TabsContent>
        {hasDivisions && (
          <TabsContent value="divisions" className="mt-0">
            {divisionsContent}
          </TabsContent>
        )}
        <TabsContent value="hours" className="mt-0">
          {hoursContent}
        </TabsContent>
        <TabsContent value="contact" className="mt-0">
          {contactContent}
        </TabsContent>
      </div>
    </Tabs>
  );
}

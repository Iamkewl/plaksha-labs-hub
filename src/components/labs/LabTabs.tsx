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

  const tabs = [
    { value: "overview", label: "Overview" },
    ...(hasDivisions ? [{ value: "divisions", label: "Divisions" }] : []),
    { value: "hours", label: "Opening Hours" },
    { value: "contact", label: "Contact" },
  ] as { value: string; label: string }[];

  return (
    <Tabs defaultValue="overview" className="mt-10">
      {/* Tab list — scrollable on mobile, no scrollbar chrome */}
      <div className="overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <TabsList className="h-auto gap-0 rounded-none border-b border-border/50 bg-transparent p-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={
                // Active: foreground text + primary underline (2px, scale-in via CSS)
                // Inactive: muted text with hover lift
                "nav-indicator relative rounded-none border-b-2 border-transparent bg-transparent px-5 py-3 text-sm font-medium text-muted-foreground " +
                "transition-colors duration-150 hover:text-foreground " +
                "data-[state=active]:border-primary data-[state=active]:bg-transparent " +
                "data-[state=active]:text-foreground data-[state=active]:shadow-none " +
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              }
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

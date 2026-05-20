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
    <Tabs defaultValue="overview" className="mt-8">
      <TabsList className="w-full justify-start sm:w-auto">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        {hasDivisions && (
          <TabsTrigger value="divisions">Divisions</TabsTrigger>
        )}
        <TabsTrigger value="hours">Hours</TabsTrigger>
        <TabsTrigger value="contact">Contact</TabsTrigger>
      </TabsList>

      <div className="mt-6">
        <TabsContent value="overview">{overviewContent}</TabsContent>
        {hasDivisions && (
          <TabsContent value="divisions">{divisionsContent}</TabsContent>
        )}
        <TabsContent value="hours">{hoursContent}</TabsContent>
        <TabsContent value="contact">{contactContent}</TabsContent>
      </div>
    </Tabs>
  );
}

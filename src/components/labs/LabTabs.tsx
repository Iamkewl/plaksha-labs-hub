"use client";

import type { ReactNode } from "react";
import { useState, useRef, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { PlaceholderLab } from "@/lib/placeholder/labs";

interface LabTabsProps {
  lab: PlaceholderLab;
  overviewContent: ReactNode;
  divisionsContent: ReactNode;
  hoursContent: ReactNode;
  contactContent: ReactNode;
}

/**
 * LabTabs — tab navigation for a lab page.
 *
 * Added: animated tab content entrance (fade + slide-up) on tab change.
 * The active-tab underline uses a CSS scale transition (via nav-indicator).
 * Content animates in via a CSS class toggle driven by a key change so React
 * remounts the animation on every tab switch.
 */
export function LabTabs({
  lab,
  overviewContent,
  divisionsContent,
  hoursContent,
  contactContent,
}: LabTabsProps) {
  const hasDivisions = lab.divisions.length > 0;
  const [activeTab, setActiveTab] = useState("overview");
  const [animKey, setAnimKey] = useState(0);
  const prevTabRef = useRef("overview");

  useEffect(() => {
    if (prevTabRef.current !== activeTab) {
      prevTabRef.current = activeTab;
      setAnimKey((k) => k + 1);
    }
  }, [activeTab]);

  const tabs = [
    { value: "overview", label: "Overview" },
    ...(hasDivisions ? [{ value: "divisions", label: "Divisions" }] : []),
    { value: "hours", label: "Opening Hours" },
    { value: "contact", label: "Contact" },
  ] as { value: string; label: string }[];

  return (
    <Tabs
      defaultValue="overview"
      className="mt-10"
      onValueChange={setActiveTab}
    >
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

      {/*
        Content area — wraps each TabsContent in a keyed div so the
        stagger-in animation fires on every tab switch.
      */}
      <div className="mt-8">
        <TabsContent value="overview" className="mt-0">
          <div key={`overview-${animKey}`} className="stagger-in stagger-in-1">
            {overviewContent}
          </div>
        </TabsContent>
        {hasDivisions && (
          <TabsContent value="divisions" className="mt-0">
            <div key={`divisions-${animKey}`} className="stagger-in stagger-in-1">
              {divisionsContent}
            </div>
          </TabsContent>
        )}
        <TabsContent value="hours" className="mt-0">
          <div key={`hours-${animKey}`} className="stagger-in stagger-in-1">
            {hoursContent}
          </div>
        </TabsContent>
        <TabsContent value="contact" className="mt-0">
          <div key={`contact-${animKey}`} className="stagger-in stagger-in-1">
            {contactContent}
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}

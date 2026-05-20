// Server component shell — interactive parts delegated to client component.
import { Cpu } from "lucide-react";
import { ElectronicsInventoryClient } from "@/components/robotics/ElectronicsInventoryClient";

export function ElectronicsSection() {
  return (
    <section aria-labelledby="electronics-heading" className="space-y-6">
      <div className="flex items-center gap-2">
        <Cpu className="h-4 w-4 text-violet-400" aria-hidden="true" />
        <h2
          id="electronics-heading"
          className="text-base font-semibold text-foreground"
        >
          Electronics Inventory
        </h2>
      </div>

      <ElectronicsInventoryClient />
    </section>
  );
}

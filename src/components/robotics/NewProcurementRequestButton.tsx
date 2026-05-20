"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { createProcurementRequest } from "@/app/actions/procurement";

interface NewProcurementRequestButtonProps {
  labId: string;
}

export function NewProcurementRequestButton({
  labId,
}: NewProcurementRequestButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    vendor: "",
    quantity: "1",
    unit: "unit",
    notes: "",
    expectedArrival: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit() {
    if (!form.title.trim()) {
      setError("Item name is required.");
      return;
    }
    if (!form.unit.trim()) {
      setError("Unit is required.");
      return;
    }
    const qty = parseInt(form.quantity, 10);
    if (!qty || qty < 1) {
      setError("Quantity must be at least 1.");
      return;
    }
    setError(null);

    startTransition(async () => {
      try {
        await createProcurementRequest({
          title: form.title.trim(),
          vendor: form.vendor.trim() || undefined,
          quantity: qty,
          unit: form.unit.trim(),
          notes: form.notes.trim() || undefined,
          expectedArrival: form.expectedArrival
            ? new Date(form.expectedArrival)
            : undefined,
          labId,
        });
        setOpen(false);
        setForm({
          title: "",
          vendor: "",
          quantity: "1",
          unit: "unit",
          notes: "",
          expectedArrival: "",
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to submit request."
        );
      }
    });
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="text-xs"
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
        aria-label="New procurement request"
      >
        <Plus className="h-3 w-3 mr-1" />
        New Request
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Procurement Request</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <Field label="Item Name *" htmlFor="pr-title">
              <input
                id="pr-title"
                name="title"
                type="text"
                placeholder="e.g. ATmega328P Microcontroller"
                value={form.title}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>

            <Field label="Vendor" htmlFor="pr-vendor">
              <input
                id="pr-vendor"
                name="vendor"
                type="text"
                placeholder="e.g. Mouser Electronics"
                value={form.vendor}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Quantity *" htmlFor="pr-qty">
                <input
                  id="pr-qty"
                  name="quantity"
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Field>

              <Field label="Unit *" htmlFor="pr-unit">
                <input
                  id="pr-unit"
                  name="unit"
                  type="text"
                  placeholder="e.g. pcs, kg"
                  value={form.unit}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Expected Arrival" htmlFor="pr-arrival">
              <input
                id="pr-arrival"
                name="expectedArrival"
                type="date"
                value={form.expectedArrival}
                min={new Date().toISOString().split("T")[0]}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>

            <Field label="Notes" htmlFor="pr-notes">
              <textarea
                id="pr-notes"
                name="notes"
                rows={3}
                placeholder="Additional details or justification…"
                value={form.notes}
                onChange={handleChange}
                className={`${inputClass} resize-none`}
              />
            </Field>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" size="sm" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={isPending}
              aria-label="Submit procurement request"
            >
              {isPending ? "Submitting…" : "Submit Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

const inputClass =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring placeholder:text-muted-foreground";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

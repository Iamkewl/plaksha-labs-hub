"use client";

/**
 * SubmitButton
 *
 * A small wrapper around <Button type="submit"> that uses
 * useFormStatus to render a loading state while the parent
 * <form action={...}> server action is in flight.
 *
 * Drop-in replacement for any submit button inside a server-action
 * form. Keeps the visual style consistent with the rest of the app
 * (uses the same CVA variants as <Button>) and shows a spinner
 * + "Submitting…" copy so the user always gets feedback.
 */

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SubmitButtonProps extends ButtonProps {
  /** Label shown in the idle state. */
  label: string;
  /** Label shown while the server action is pending. */
  pendingLabel?: string;
  /** Optional icon to render before the label. */
  icon?: React.ReactNode;
}

export function SubmitButton({
  label,
  pendingLabel = "Submitting…",
  icon,
  className,
  disabled,
  children,
  ...rest
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={disabled || pending}
      aria-busy={pending}
      aria-disabled={pending}
      className={cn("min-w-[120px]", className)}
      {...rest}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          {pendingLabel}
        </>
      ) : (
        <>
          {icon}
          {children ?? label}
        </>
      )}
    </Button>
  );
}

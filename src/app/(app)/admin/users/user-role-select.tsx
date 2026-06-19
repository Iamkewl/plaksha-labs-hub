"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUserRole } from "@/app/actions/users";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserRoleSelectProps {
  userId: string;
  currentRole: string;
  isSelf: boolean;
}

export function UserRoleSelect({
  userId,
  currentRole,
  isSelf,
}: UserRoleSelectProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pendingRole, setPendingRole] = useState<string | null>(null);

  function handleRoleChange(role: string) {
    if (role === currentRole) return;
    // Open the confirmation dialog instead of confirm()
    setPendingRole(role);
  }

  async function confirmRoleChange() {
    if (!pendingRole) return;
    const role = pendingRole;
    setPendingRole(null);

    setLoading(true);
    try {
      await updateUserRole({ userId, role });
      router.refresh();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to update role",
        description: err instanceof Error ? err.message : "Failed to update role",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Select
        defaultValue={currentRole}
        onValueChange={handleRoleChange}
        disabled={isSelf || loading}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="STUDENT">Student</SelectItem>
          <SelectItem value="MENTOR">Mentor</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
        </SelectContent>
      </Select>

      <AlertDialog
        open={pendingRole !== null}
        onOpenChange={(open) => {
          if (!open) setPendingRole(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change user role?</AlertDialogTitle>
            <AlertDialogDescription>
              Change this user&apos;s role to{" "}
              <span className="font-semibold">{pendingRole}</span>? This affects
              their access immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRoleChange} disabled={loading}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

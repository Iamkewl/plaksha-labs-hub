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

  async function handleRoleChange(role: string) {
    if (role === currentRole) return;

    const confirmation = confirm(
      `Change this user's role to ${role}? This affects their access immediately.`
    );
    if (!confirmation) return;

    setLoading(true);
    try {
      await updateUserRole({ userId, role });
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update role");
    } finally {
      setLoading(false);
    }
  }

  return (
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
  );
}

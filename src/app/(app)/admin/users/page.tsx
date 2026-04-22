import { requireRole } from "@/lib/auth-guard";
import { getUsers } from "@/app/actions/users";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { UserRoleSelect } from "./user-role-select";
import { ReactiveMetric, ReactiveReveal } from "@/components/once-ui/reactive-elements";

export default async function UsersPage() {
  const session = await requireRole("ADMIN");
  const users = await getUsers();

  const roleBadgeVariant: Record<string, "default" | "secondary" | "destructive"> = {
    ADMIN: "destructive",
    MENTOR: "default",
    STUDENT: "secondary",
  };

  return (
    <div>
      <ReactiveReveal className="space-y-1" translateY={0.35}>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">
          View all users and manage their roles
        </p>
      </ReactiveReveal>

      <ReactiveReveal delay={0.06} translateY={0.45}>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>
              All Users (<ReactiveMetric value={users.length} />)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No users registered yet.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Trainings</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Projects</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Change Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.name ?? "—"}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={roleBadgeVariant[user.role] ?? "secondary"}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{user._count.trainings}</TableCell>
                      <TableCell>{user._count.bookings}</TableCell>
                      <TableCell>{user._count.projectMemberships}</TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
                        <UserRoleSelect
                          userId={user.id}
                          currentRole={user.role}
                          isSelf={user.id === session.user.id}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </ReactiveReveal>
    </div>
  );
}

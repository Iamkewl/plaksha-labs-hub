import { requireRole } from "@/lib/auth-guard";
import { StatTile } from "@/components/admin/StatTile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, Wrench, AlertTriangle, Users, BookOpen, ArrowRight, Settings, ClipboardList } from "lucide-react";
import Link from "next/link";
import { PLACEHOLDER_ADMIN_STATS } from "@/lib/placeholder/admin";

export default async function AdminOverviewPage() {
  await requireRole("ADMIN");
  const stats = PLACEHOLDER_ADMIN_STATS;
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Admin Overview</h1>
        <p className="text-muted-foreground">Manage labs, assets, users, and requests across the makerspace.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <StatTile
          title="Material Requests"
          value={stats.openMaterialRequests}
          description="pending approval"
          icon={<Package className="h-4 w-4 text-blue-500" />}
          href="/admin/requests"
        />
        <StatTile
          title="Procurements"
          value={stats.pendingProcurements}
          description="awaiting action"
          icon={<ShoppingCart className="h-4 w-4 text-emerald-500" />}
          href="/admin/requests"
        />
        <StatTile
          title="Active Checkouts"
          value={stats.activeCheckouts}
          description="equipment in use"
          icon={<Wrench className="h-4 w-4 text-violet-500" />}
          href="/admin/assets"
        />
        <StatTile
          title="In Maintenance"
          value={stats.machinesInMaintenance}
          description="machines under repair"
          icon={<AlertTriangle className="h-4 w-4 text-orange-500" />}
          href="/admin/assets"
        />
        <StatTile
          title="New Users"
          value={stats.newUsersThisWeek}
          description="this week"
          icon={<Users className="h-4 w-4 text-pink-500" />}
          href="/admin/users"
        />
        <StatTile
          title="Today's Bookings"
          value={stats.todaysBookings}
          description="scheduled sessions"
          icon={<BookOpen className="h-4 w-4 text-cyan-500" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <QuickLinkCard icon={<Settings className="mr-2 h-4 w-4" />} title="Labs" description="Manage makerspace labs, divisions, and locations." href="/admin/labs" buttonText="Manage Labs" />
        <QuickLinkCard icon={<Wrench className="mr-2 h-4 w-4" />} title="Assets" description="View all machines, tools, and equipment across labs." href="/admin/assets" buttonText="Manage Assets" />
        <QuickLinkCard icon={<ClipboardList className="mr-2 h-4 w-4" />} title="Requests" description="Review and approve material and procurement requests." href="/admin/requests" buttonText="Manage Requests" />
        <QuickLinkCard icon={<Users className="mr-2 h-4 w-4" />} title="Users" description="Manage user accounts, roles, and permissions." href="/admin/users" buttonText="Manage Users" />
      </div>
    </div>
  );
}

function QuickLinkCard({ icon, title, description, href, buttonText }: { icon: React.ReactNode; title: string; description: string; href: string; buttonText: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">{title}</CardTitle>
        <Link href={href}>
          <Button variant="ghost" size="sm">
            View all <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{description}</p>
          <Link href={href}>
            <Button className="w-full" variant="outline" size="sm">
              {icon}
              {buttonText}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

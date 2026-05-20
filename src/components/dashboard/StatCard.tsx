import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  href?: string;
  variant?: "default" | "highlight";
}

export function StatCard({
  title,
  value,
  description,
  icon,
  href,
  variant = "default",
}: StatCardProps) {
  const card = (
    <Card className={href ? "hover:shadow-md transition-shadow cursor-pointer" : ""}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{card}</Link>;
  }

  return card;
}

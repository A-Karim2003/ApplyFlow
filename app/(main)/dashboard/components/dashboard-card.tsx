import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DashboardCardProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

export function DashboardCard({
  title,
  description,
  action,
  className,
  children,
}: DashboardCardProps) {
  return (
    <Card className={cn("rounded-2xl h-full", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent className="overflow-scroll h-full min-h-40">
        {children}
      </CardContent>
    </Card>
  );
}

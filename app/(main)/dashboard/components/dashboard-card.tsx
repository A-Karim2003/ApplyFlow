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
    <Card className={cn("rounded-2xl", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

const AVATAR_COLOURS = [
  "#1f8a56",
  "#c8514b",
  "#5b63c4",
  "#b8901e",
  "#2f7fb8",
  "#8a5bb8",
];

//? Initial on a colour picked from the company name, so each company always gets the same colour
export function CompanyAvatar({ name }: { name: string }) {
  const index =
    [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0) %
    AVATAR_COLOURS.length;

  return (
    <div
      className="flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-white"
      style={{ backgroundColor: AVATAR_COLOURS[index] }}
      aria-hidden
    >
      {name.charAt(0)}
    </div>
  );
}

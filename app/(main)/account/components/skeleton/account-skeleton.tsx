import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AccountSkeleton() {
  return (
    <Card className="max-w-2xl rounded-2xl">
      <CardHeader className="space-y-2">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex items-center gap-4 border-b pb-6">
          <Skeleton className="size-16 rounded-full" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-9" />
          <Skeleton className="h-9" />
        </div>
        <Skeleton className="h-9" />
        <Skeleton className="h-24" />
      </CardContent>
    </Card>
  );
}

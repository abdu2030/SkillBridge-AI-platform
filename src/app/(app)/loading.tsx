import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AppLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-72 mt-2" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} padding="md">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-6 w-16 mt-3" />
          </Card>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-48 w-full mt-4" />
        </Card>
        <Card>
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-48 w-full mt-4" />
        </Card>
      </div>
    </div>
  );
}

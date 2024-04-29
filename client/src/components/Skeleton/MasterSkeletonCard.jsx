import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";


export default function MasterSkeletonCard() {
  return (
    <Card className="max-w-xl">
      <div className="flex flex-col">
        <CardHeader className="flex flex-col gap-2 items-start">
          <Skeleton className="w-64 h-8 rounded-full" />
          <div className="flex flex-row gap-2">
            <Skeleton className="w-28 h-12 rounded-md" />
            <Skeleton className="w-28 h-12 rounded-md" />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-2 w-72" />
            <Skeleton className="h-2 w-64" />
            <Skeleton className="h-2 w-56" />
          </div>
          <div className="flex flex-row gap-8 items-center">
            <Skeleton className="h-2 w-36" />
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </CardContent>
      </div>

      <CardFooter className="flex flex-row gap-4 justify-end">
        <Skeleton className="w-24 h-10 rounded-md" />
        <Skeleton className="w-24 h-10 rounded-md" />
      </CardFooter>
    </Card>
  );
}

import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function LessonSkeletonCard() {
  return (
    <Card>
      <div className="flex flex-col lg:flex-row lg:justify-between mt-4">
        <CardHeader className="flex text-center">
          <Skeleton className="w-64 h-8 rounded-full" />
        </CardHeader>
        <CardContent className="flex flex-col gap-2 mt-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-2 w-72" />
            <Skeleton className="h-2 w-64" />
            <Skeleton className="h-2 w-56" />
          </div>
        </CardContent>
      </div>

      <CardFooter className="flex flex-row gap-4 justify-end">
        <Skeleton className="w-8 h-8 rounded-md" />
        <Skeleton className="w-8 h-8 rounded-md" />
      </CardFooter>
    </Card>
  );
}

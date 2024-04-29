import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function CourseSkeletonCard() {
  return (
    <Card className="max-w-xl">
      <div className="flex flex-col">
        <CardHeader className="flex flex-col gap-2 items-start">
          <Skeleton className="w-24 h-8 rounded-full" />
          <div className="flex flex-row justify-between w-full">
            <div className="flex flex-col gap-1">
              <div className="flex flex-row gap-2">
                <Skeleton className="w-6 h-6 rounded-full" />
                <Skeleton className="w-28 h-6 rounded-md" />
              </div>
              <div className="flex flex-row gap-2">
                <Skeleton className="w-6 h-6 rounded-full" />
                <Skeleton className="w-28 h-6 rounded-md" />
              </div>
              <div className="flex flex-row gap-2">
                <Skeleton className="w-6 h-6 rounded-full" />
                <Skeleton className="w-28 h-6 rounded-md" />
              </div>
            </div>
            <div>
              <Skeleton className="w-16 h-16" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-2 w-72" />
            <Skeleton className="h-2 w-64" />
            <Skeleton className="h-2 w-56" />
          </div>
          <div className="flex flex-row justify-between items-center mt-2">
            <div className="flex flex-row gap-2 items-center">
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
            <div className="flex flex-row gap-2 items-center">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
          </div>
        </CardContent>
      </div>

      <CardFooter className="flex flex-row gap-4 justify-start">
        <Skeleton className="w-28 h-8 rounded-md" />
      </CardFooter>
    </Card>
  );
}

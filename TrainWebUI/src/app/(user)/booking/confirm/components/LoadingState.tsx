import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function LoadingState() {
  return (
    <div className="container mx-auto px-2 lg:px-2 py-5">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-3 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-3 lg:col-span-2">
            {/* Trip Summary Skeleton */}
            <Card className="border-0 shadow-md">
              <div className="p-2">
                <Skeleton className="h-6 w-40 mb-3" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Passenger Forms Skeleton */}
            {[1, 2].map((i) => (
              <Card key={i} className="border-0 shadow-md">
                <div className="p-2">
                  <Skeleton className="h-6 w-64 mb-3" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-md">
              <div className="p-2">
                <Skeleton className="h-6 w-32 mb-3" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-px w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

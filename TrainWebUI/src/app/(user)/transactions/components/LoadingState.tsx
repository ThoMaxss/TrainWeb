import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

export function LoadingState() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border-0 bg-background shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 flex-1">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <div className="text-right space-y-2">
              <Skeleton className="h-5 w-24 ml-auto" />
              <Skeleton className="h-4 w-20 ml-auto" />
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
        </Card>
      ))}
    </div>
  )
}

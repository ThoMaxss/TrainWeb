import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function LoadingState() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-success">
        <div className="container mx-auto px-2 py-12">
          <div className="max-w-4xl mx-auto text-center space-y-3">
            <Skeleton className="h-16 w-16 rounded-full mx-auto" />
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-2 py-5">
        <div className="max-w-4xl mx-auto">
          <Card className="border border-border shadow-sm">
            <div className="p-2 space-y-3">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-px w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

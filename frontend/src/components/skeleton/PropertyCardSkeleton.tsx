import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function NFTCardSkeleton() {
  return (
    <Card className="overflow-hidden border border-zinc-100 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="relative">
        <Skeleton className="w-full h-48" />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
      <CardHeader className="p-4 pb-0 flex-row justify-between items-start">

      </CardHeader>
      <CardContent className="p-4 pt-3 space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-5 w-24" />
          </div>

        </div>

      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between gap-2">
        <Skeleton className="h-9 flex-1" />
      </CardFooter>
    </Card>
  )
}

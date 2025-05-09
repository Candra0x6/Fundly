
import { cn } from '@/lib/utils'
import NFTCardSkeleton from './PropertyCardSkeleton'

function PropertyGridSkeleton({ length = 8, className }: { length?: number, className?: string }) {
  return (
    <div className={cn("w-full h-full grid items-start grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4", className)}>
      {Array.from({ length }).map((_) =>
        <NFTCardSkeleton />
      )}
    </div>
  )
}

export default PropertyGridSkeleton
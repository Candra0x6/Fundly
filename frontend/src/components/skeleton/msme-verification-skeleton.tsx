"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function MSMEVerificationCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
      <div className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <div>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        <div className="flex gap-4 mb-4 w-full justify-between">
          <div className="flex items-center">
            <Skeleton className="h-4 w-4 mr-2 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>

          <div className="flex items-center">
            <Skeleton className="h-4 w-4 mr-2 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
    </div>
  )
}

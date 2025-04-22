import { Skeleton } from "@/components/ui/skeleton"

export default function MSMEVerificationLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Skeleton className="h-9 w-36" />
      </div>
      
      <div className="mb-8">
        <Skeleton className="h-10 w-96 mb-2" />
        <div className="flex flex-wrap gap-4 mt-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-5 w-36" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* MSME Detail Review Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="p-6 border-b dark:border-gray-700">
              <Skeleton className="h-7 w-40" />
            </div>
            <div className="p-6">
              <div className="flex gap-2 mb-6">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Document Reviewer Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="p-6 border-b dark:border-gray-700">
              <Skeleton className="h-7 w-40" />
            </div>
            <div className="p-6">
              <div className="flex gap-2 mb-6">
                <Skeleton className="h-9 w-32" />
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-28" />
              </div>
              
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-md" />
                        <div>
                          <Skeleton className="h-5 w-48 mb-2" />
                          <div className="flex gap-4">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-8">
          {/* Verification Checklist Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="p-6 border-b dark:border-gray-700">
              <Skeleton className="h-7 w-48" />
            </div>
            <div className="p-6">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-2 w-full rounde\

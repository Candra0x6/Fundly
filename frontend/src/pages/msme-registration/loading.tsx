import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="border-b border-gray-200 bg-white p-6">
            <div className="flex justify-between">
              {[1, 2, 3, 4, 5, 6].map((step) => (
                <Skeleton key={step} className="h-8 w-8 rounded-full" />
              ))}
            </div>
          </div>

          <div className="p-6">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-5 w-full mb-8" />

            <div className="space-y-6">
              {[1, 2, 3, 4].map((field) => (
                <div key={field}>
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
            <Skeleton className="h-10 w-24" />
            <div className="flex space-x-3">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>

        <div className="mt-12">
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}

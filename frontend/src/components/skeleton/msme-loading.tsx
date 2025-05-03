import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MSMELoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Cover Image Skeleton */}
      <div className="w-full h-64 bg-zinc-100">
        <Skeleton className="w-full h-full" />
      </div>

      {/* MSME Profile Header Skeleton */}
      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-white rounded-xl border border-zinc-100 shadow-sm p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo and Basic Info Skeleton */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Skeleton className="h-24 w-24 rounded-xl flex-shrink-0" />
              <div className="w-full md:w-auto">
                <div className="flex items-center gap-2 mb-1">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-5 w-36" />
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-20 w-full max-w-3xl" />
              </div>
            </div>

            {/* Stats and Actions Skeleton */}
            <div className="md:ml-auto flex flex-col items-end justify-between w-full md:w-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-zinc-50 p-3 rounded-lg">
                    <Skeleton className="h-4 w-24 mx-auto mb-2" />
                    <Skeleton className="h-6 w-16 mx-auto" />
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4 md:mt-0 w-full md:w-auto justify-end">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start mb-6 bg-zinc-50 p-1 rounded-lg">
            {["Overview", "Financials", "Team", "Roadmap", "Gallery", "NFTs", "Documents"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab.toLowerCase()}
                className="rounded-md data-[state=active]:bg-white"
                disabled
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-32 w-full" />

                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-64 w-full" />

                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-40 w-full" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

export function MSMEVerificationPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/dashboard/verify">
          <Button
            variant="ghost"
            className="pl-0 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <Skeleton className="h-9 w-2/3 max-w-md mb-3" />
        <div className="flex flex-wrap gap-4 mt-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-48" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* MSMEDetailReview skeleton */}
          <div className="border rounded-lg p-6 bg-white dark:bg-gray-800">
            <Skeleton className="h-7 w-48 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </div>
          </div>

          {/* DocumentReviewer skeleton */}
          <div className="border rounded-lg p-6 bg-white dark:bg-gray-800">
            <Skeleton className="h-7 w-48 mb-4" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center p-3 border rounded-md">
                  <Skeleton className="h-10 w-10 rounded-md mr-4" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-9 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* VerificationChecklist skeleton */}
          <div className="border rounded-lg p-6 bg-white dark:bg-gray-800">
            <Skeleton className="h-7 w-48 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded-md" />
                  <Skeleton className="h-5 flex-1" />
                </div>
              ))}
            </div>
          </div>

          {/* FeedbackForm skeleton */}
          <div className="border rounded-lg p-6 bg-white dark:bg-gray-800">
            <Skeleton className="h-7 w-48 mb-4" />
            <div className="space-y-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>

          {/* DecisionControls skeleton */}
          <div className="border rounded-lg p-6 bg-white dark:bg-gray-800">
            <Skeleton className="h-7 w-48 mb-4" />
            <div className="space-y-4">
              <Skeleton className="h-5 w-full" />
              <div className="flex gap-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

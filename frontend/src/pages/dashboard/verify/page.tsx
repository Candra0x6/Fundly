import { VerificationQueue } from "@/components/verification-portal/verification-queue"
import { VerificationFilters } from "@/components/verification-portal/verification-filters"
import { VerificationMetrics } from "@/components/verification-portal/verification-metrics"


export default function VerificationDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Verification Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage verification tasks and track performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <VerificationMetrics />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Verification Queue</h2>
        <VerificationFilters />
        <div className="mt-6">
          <VerificationQueue />
        </div>
      </div>
    </div>
  )
}

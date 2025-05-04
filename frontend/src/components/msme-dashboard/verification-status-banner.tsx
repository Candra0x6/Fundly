

import { motion } from "framer-motion"
import { CheckCircle2, Clock, AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface VerificationStatusProps {
  status: {
    status: "pending" | "verified" | "rejected"
    message: string
    lastUpdated: string
    nextReview?: string
  }
}

export default function VerificationStatusBanner({ status }: VerificationStatusProps) {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`mb-6 p-4 rounded-lg ${status.status === "verified"
          ? "bg-emerald-50 border border-emerald-100"
          : status.status === "pending"
            ? "bg-yellow-50 border border-yellow-100"
            : "bg-red-50 border border-red-100"
        }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${status.status === "verified"
              ? "bg-emerald-100 text-emerald-600"
              : status.status === "pending"
                ? "bg-yellow-100 text-yellow-600"
                : "bg-red-100 text-red-600"
            }`}
        >
          {status.status === "verified" ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : status.status === "pending" ? (
            <Clock className="h-5 w-5" />
          ) : (
            <AlertTriangle className="h-5 w-5" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3
              className={`font-medium ${status.status === "verified"
                  ? "text-emerald-700"
                  : status.status === "pending"
                    ? "text-yellow-700"
                    : "text-red-700"
                }`}
            >
              {status.status === "verified"
                ? "Verified Business"
                : status.status === "pending"
                  ? "Verification Pending"
                  : "Verification Failed"}
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setVisible(false)} className="h-8 w-8 p-0 -mr-2">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p
            className={`mt-1 ${status.status === "verified"
                ? "text-emerald-600"
                : status.status === "pending"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
          >
            {status.message}
          </p>
          <div
            className={`flex items-center text-xs mt-2 ${status.status === "verified"
                ? "text-emerald-500"
                : status.status === "pending"
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
          >
            <span>Last updated: {status.lastUpdated}</span>
            {status.nextReview && (
              <>
                <span className="mx-2">•</span>
                <span>Next review: {status.nextReview}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

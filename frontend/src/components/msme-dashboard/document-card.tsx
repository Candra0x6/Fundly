"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, CheckCircle2, Clock, XCircle } from "lucide-react"

interface DocumentCardProps {
  document: {
    id: string
    title: string
    type: string
    size: string
    uploadDate: string
    status: string
  }
}

export default function DocumentCard({ document }: DocumentCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div
              className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                document.type === "PDF" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
              }`}
            >
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm truncate">{document.title}</h3>
                <Badge
                  className={`ml-2 flex-shrink-0 ${
                    document.status === "approved"
                      ? "bg-emerald-100 text-emerald-700"
                      : document.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {document.status === "approved" ? (
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                  ) : document.status === "pending" ? (
                    <Clock className="h-3 w-3 mr-1" />
                  ) : (
                    <XCircle className="h-3 w-3 mr-1" />
                  )}
                  {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center text-xs text-zinc-500 mt-1">
                <span>{document.type}</span>
                <span className="mx-1">•</span>
                <span>{document.size}</span>
                <span className="mx-1">•</span>
                <span>Uploaded {new Date(document.uploadDate).toLocaleDateString()}</span>
              </div>
              <Button variant="ghost" size="sm" className="mt-2 h-8 w-8 p-0">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

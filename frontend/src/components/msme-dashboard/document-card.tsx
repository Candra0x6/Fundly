"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, CheckCircle2, Clock, XCircle } from "lucide-react"
import { Document } from "@declarations/msme_registration/msme_registration.did"


export default function DocumentCard({ document }: { document: Document }
) {
  console.log(document)
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div
              className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 "PDF" ? "bg-red-100 text-red-600"
              `}
            >
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm truncate">{document.name}</h3>
                <Badge
                  className={`ml-2 flex-shrink-0 ${document.verified
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                    }`}
                >
                  {document.verified ? (
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                  ) :
                    <Clock className="h-3 w-3 mr-1" />}
                </Badge>
              </div>
              <div className="flex items-center text-xs text-zinc-500 mt-1">
                <span>{document.name}</span>
                <span className="mx-1">•</span>
                <span>Uploaded {new Date(Number(document.uploadDate / 1000000n)).toLocaleDateString()}</span>
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

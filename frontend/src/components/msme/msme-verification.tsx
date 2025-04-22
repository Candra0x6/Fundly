"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Shield, Clock, User, FileText, Calendar, ArrowRight } from "lucide-react"

interface MSMEVerificationProps {
  msmeId: string
}

export default function MSMEVerification({ msmeId }: MSMEVerificationProps) {
  // This would normally be fetched from an API based on the ID
  const verification = {
    status: "verified",
    verificationDate: "June 15, 2023",
    expiryDate: "June 15, 2025",
    verifiedBy: "John Verifier",
    verifierRole: "Senior Verification Specialist",
    verificationId: "VER-2023-06-15-001",
    blockchainTxId: "0x7a69c360e6e9c0a8a0b1f270c7b9a1db8ec7b8256142a3a93f0451074eedbc63",
    blockchainNetwork: "Ethereum",
    blockExplorer: "https://etherscan.io/tx/0x7a69c360e6e9c0a8a0b1f270c7b9a1db8ec7b8256142a3a93f0451074eedbc63",
    verificationSteps: [
      {
        id: "1",
        title: "Document Submission",
        description: "All required documents submitted for verification",
        date: "January 15, 2023",
        status: "completed",
      },
      {
        id: "2",
        title: "Initial Review",
        description: "Documents reviewed by verification team",
        date: "January 25, 2023",
        status: "completed",
      },
      {
        id: "3",
        title: "Background Check",
        description: "Company background and history verified",
        date: "February 10, 2023",
        status: "completed",
      },
      {
        id: "4",
        title: "Financial Verification",
        description: "Financial statements and projections analyzed",
        date: "March 5, 2023",
        status: "completed",
      },
      {
        id: "5",
        title: "On-chain Verification",
        description: "Verification data recorded on blockchain",
        date: "June 15, 2023",
        status: "completed",
      },
    ],
  }

  return (
    <div className="space-y-8">
      {/* Verification Status */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Verification Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-emerald-600" />
                </div>
                <div>
                  <Badge className="bg-emerald-100 text-emerald-700 mb-1">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                  <p className="text-sm text-zinc-500">
                    Verified on {verification.verificationDate} • Valid until {verification.expiryDate}
                  </p>
                </div>
              </div>

              <div className="md:ml-auto grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                    <User className="h-3 w-3" />
                    Verified By
                  </p>
                  <p className="font-medium">{verification.verifiedBy}</p>
                  <p className="text-xs text-zinc-500">{verification.verifierRole}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    Verification ID
                  </p>
                  <p className="font-medium">{verification.verificationId}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Renewal Due
                  </p>
                  <p className="font-medium">{verification.expiryDate}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Blockchain Verification */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Blockchain Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-zinc-50 p-4 rounded-lg">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Transaction ID</p>
                  <p className="font-medium font-mono text-sm break-all">{verification.blockchainTxId}</p>
                </div>
                <div className="md:ml-auto">
                  <p className="text-xs text-zinc-500 mb-1">Network</p>
                  <p className="font-medium">{verification.blockchainNetwork}</p>
                </div>
                <a
                  href={verification.blockExplorer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center"
                >
                  View on Block Explorer
                  <ArrowRight className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Verification Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Verification Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute top-0 bottom-0 left-[19px] w-0.5 bg-zinc-200"></div>
              <div className="space-y-6">
                {verification.verificationSteps.map((step, index) => (
                  <div key={step.id} className="flex gap-4">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                        step.status === "completed"
                          ? "bg-emerald-100 text-emerald-600"
                          : step.status === "in-progress"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      {step.status === "completed" ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Clock className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{step.title}</h3>
                        <Badge
                          className={`${
                            step.status === "completed"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {step.status === "completed" ? "Completed" : "In Progress"}
                        </Badge>
                      </div>
                      <p className="text-zinc-500 text-sm">{step.description}</p>
                      <p className="text-xs text-zinc-400 mt-1">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

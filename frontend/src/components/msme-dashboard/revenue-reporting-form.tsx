

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, DollarSign, Upload, Info } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { getSession } from "@/utility/session"
import toast from "react-hot-toast"
import { useFileUpload } from "@/hooks/useFileUpload"
import { Document } from "@declarations/msme_registration/msme_registration.did"
import { DocumentType } from "@declarations/nft_canister/nft_canister.did"
import { useRevenueReporting } from "@/hooks/useRevenueReporting"

interface RevenueReportingFormProps {
  onCancel: () => void
}

export default function RevenueReportingForm({ onCancel }: RevenueReportingFormProps) {
  const {

    uploadFile: uploadDocument
  } = useFileUpload()

  const msmeId = getSession("msme_id")
  const { reportRevenue } = useRevenueReporting()
  const [date, setDate] = useState<Date>()
  const [reportData, setReportData] = useState<{
    revenue: string,
    description: string,
    document: Document,
  }>({
    revenue: "",
    description: "",
    document: {
      id: "",
      assetId: "",
      name: "",
      // @ts-ignore
      docType: { ImpactReport: null } as DocumentType,
      assetCanisterId: [],
      uploadDate: BigInt(0),
      verified: false,
    },
  })


  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setReportData({
      ...reportData,
      [name]: value,
    })
  }

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    docType: string,
    docName: string,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      const result = await uploadDocument(file, {
        entityId: msmeId,
        documentType: docType,
        documentName: docName,
        description: "",
      })
      console.log(result)

      const data: Document = {
        id: result?.assetId ?? "",
        assetId: result?.assetId ?? "",
        name: result?.name ?? "",
        docType: { ImpactReport: null } as DocumentType,
        assetCanisterId: [],
        uploadDate: BigInt(new Date(result?.dateUploaded.toString() ?? "").getTime() ?? 0),
        verified: false,
      }

      console.log(data)
      setReportData((prev) => ({
        ...prev,
        document: data
      }))
    }
  }

  // // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    toast.loading("Reporting revenue...")
    console.log(reportData)
    const result = await reportRevenue(msmeId, BigInt(reportData.revenue), reportData.description, reportData.document)
    // @ts-ignore
    if (result.ok) {
      toast.dismiss()
      toast.success("Revenue reported successfully!, Please wait for verification")
      // @ts-ignore

    } else {
      toast.dismiss()
      toast.error("Failed to report revenue")
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Report Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="space-y-2 flex flex-col">
                <Label htmlFor="date">Report Date</Label>
                <Popover>
                  <PopoverTrigger>
                    <Button type="button" variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="revenue">Total Revenue ($FND)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
                  <Input
                    id="revenue"
                    name="revenue"
                    type="number"
                    placeholder="100000"
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

            </div>


            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Add any additional information about this revenue report"
                onChange={handleInputChange}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="document">Supporting Document</Label>

              <div className="border-2 border-dashed border-zinc-200 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-300 transition-colors relative">
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                  <Upload className="h-5 w-5 text-emerald-600" />
                </div>
                <p className="font-medium text-center">Upload Document</p>
                <p className="text-xs text-zinc-500 text-center mt-1">
                  <br />
                  PDF, Excel, or CSV, max 10MB
                </p>
                <Input type="file" className=" w-full h-full absolute" onChange={(e) => handleFileUpload(e, "ImpactReport", "Impact Report")} />
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-700">
                    Revenue reports are used to calculate distributions to NFT holders. Please ensure the information is
                    accurate. Supporting documents may be reviewed by our team.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600">
                Submit Report
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

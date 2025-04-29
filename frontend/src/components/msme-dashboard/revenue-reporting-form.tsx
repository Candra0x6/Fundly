"use client"

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
import { useRevenueReporting } from "@/hooks/useRevenueReporting"
import { getSession } from "@/utility/session"
import toast from "react-hot-toast"

interface RevenueReportingFormProps {
  onCancel: () => void
}

export default function RevenueReportingForm({ onCancel }: RevenueReportingFormProps) {
  const msmeId = getSession("msme_id")
  const { reportRevenue, distributeRevenue } = useRevenueReporting()
  const [date, setDate] = useState<Date>()
  const [reportData, setReportData] = useState({
    period: "q3-2023",
    revenue: "",
    notes: "",
    document: null,
  })


  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setReportData({
      ...reportData,
      [name]: value,
    })
  }

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setReportData({
      ...reportData,
      [name]: value,
    })
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    toast.loading("Reporting revenue...")
    // In a real app, this would submit the revenue data to the backend
    // Show success message or redirect
    const result = await reportRevenue(msmeId, BigInt(reportData.revenue), reportData.notes)
    if (result.ok) {
      toast.dismiss()
      toast.success("Revenue reported successfully!")
      toast.loading("Distribute Revenue...")
      console.log(result.ok)
      const distributeResult = await distributeRevenue(result.ok)
      if (distributeResult.ok) {
        toast.dismiss()
        toast.success("Revenue distributed successfully!")
        console.log(distributeResult)
      } else {
        toast.dismiss()
        toast.error("Failed to distribute revenue")
        console.log(distributeResult)
      }
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
              <div className="space-y-2">
                <Label htmlFor="period">Reporting Period</Label>
                <Select value={reportData.period} onValueChange={(value) => handleSelectChange("period", value)}>
                  <SelectTrigger id="period">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="q1-2023">Q1 2023 (Jan-Mar)</SelectItem>
                    <SelectItem value="q2-2023">Q2 2023 (Apr-Jun)</SelectItem>
                    <SelectItem value="q3-2023">Q3 2023 (Jul-Sep)</SelectItem>
                    <SelectItem value="q4-2023">Q4 2023 (Oct-Dec)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Report Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="revenue">Total Revenue (USD)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
                <Input
                  id="revenue"
                  name="revenue"
                  type="number"
                  placeholder="100000"
                  value={reportData.revenue}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Add any additional information about this revenue report"
                value={reportData.notes}
                onChange={handleInputChange}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="document">Supporting Document (Optional)</Label>
              <div className="border-2 border-dashed border-zinc-200 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-300 transition-colors">
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                  <Upload className="h-5 w-5 text-emerald-600" />
                </div>
                <p className="font-medium text-center">Upload Document</p>
                <p className="text-xs text-zinc-500 text-center mt-1">
                  Drag and drop or click to upload
                  <br />
                  PDF, Excel, or CSV, max 10MB
                </p>
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

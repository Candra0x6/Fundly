

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Bell, DollarSign, AlertCircle, Info, CheckCircle2 } from "lucide-react"

interface NotificationPanelProps {
  onClose: () => void
}

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
  // Mock notifications
  const notifications = [
    {
      id: "1",
      title: "Earnings Received",
      message: "You've received $280 from Organic Harvest Co.",
      time: "2 hours ago",
      read: false,
      type: "earning",
    },
    {
      id: "2",
      title: "New Investment Opportunity",
      message: "MediTech Solutions just launched a new NFT offering.",
      time: "5 hours ago",
      read: false,
      type: "opportunity",
    },
    {
      id: "3",
      title: "Upcoming Payout",
      message: "GreenTech Q3 Revenue Share payout scheduled for Oct 15.",
      time: "1 day ago",
      read: true,
      type: "payout",
    },
    {
      id: "4",
      title: "Account Security",
      message: "We noticed a login from a new device. Please verify it was you.",
      time: "2 days ago",
      read: true,
      type: "security",
    },
    {
      id: "5",
      title: "System Maintenance",
      message: "Scheduled maintenance on Oct 10 from 2-4 AM UTC.",
      time: "3 days ago",
      read: true,
      type: "system",
    },
  ]

  return (
    <Card className="w-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bell className="h-5 w-5 text-emerald-500" />
          Notifications
          <Badge className="bg-red-500 text-white ml-2">3</Badge>
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-3 rounded-lg border ${notification.read ? "border-zinc-100" : "border-emerald-100 bg-emerald-50"
                }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${notification.type === "earning"
                      ? "bg-emerald-100 text-emerald-600"
                      : notification.type === "opportunity"
                        ? "bg-blue-100 text-blue-600"
                        : notification.type === "payout"
                          ? "bg-purple-100 text-purple-600"
                          : notification.type === "security"
                            ? "bg-red-100 text-red-600"
                            : "bg-zinc-100 text-zinc-600"
                    }`}
                >
                  {notification.type === "earning" ? (
                    <DollarSign className="h-4 w-4" />
                  ) : notification.type === "opportunity" ? (
                    <Info className="h-4 w-4" />
                  ) : notification.type === "payout" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : notification.type === "security" ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : (
                    <Bell className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <span className="text-xs text-zinc-500">{notification.time}</span>
                  </div>
                  <p className="text-xs text-zinc-600 mt-1">{notification.message}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Button variant="link" className="text-emerald-600 text-sm">
            View all notifications
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

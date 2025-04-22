"use client"

import { useState } from "react"
import { Bell, Search, ChevronDown, Plus, Settings, HelpCircle, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface DashboardHeaderProps {
  onMenuClick?: () => void
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  // Mock user data - in a real app, this would come from authentication
  const user = {
    name: "James Chen",
    role: "Investor",
    avatar: "/placeholder.svg?height=40&width=40",
    notifications: 3,
  }

  // Mock notifications
  const notifications = [
    {
      id: "1",
      title: "New investment opportunity",
      description: "GreenTech Solutions has launched a new NFT offering",
      time: "10 minutes ago",
      read: false,
    },
    {
      id: "2",
      title: "Earnings received",
      description: "You've received $280 from Organic Harvest Co.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: "3",
      title: "Upcoming payout",
      description: "GreenTech Q3 Revenue Share payout scheduled for Oct 15",
      time: "1 day ago",
      read: true,
    },
  ]

  return (
    <header className="bg-zinc-50 border-b border-zinc-200 sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left section - Mobile menu trigger and search */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" onClick={onMenuClick} />

          <div className="relative hidden md:block w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
            <Input placeholder="Search..." className="pl-10 bg-zinc-50 border-zinc-200 rounded-xl" />
          </div>
        </div>

        {/* Right section - Actions and profile */}
        <div className="flex items-center gap-3">
          {/* Quick Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span>Actions</span>
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <Plus className="h-4 w-4 mr-2" />
                <span>New Investment</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Plus className="h-4 w-4 mr-2" />
                <span>Add Funds</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Plus className="h-4 w-4 mr-2" />
                <span>Create Report</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {user.notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white">
                    {user.notifications}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-sm">
              <SheetHeader className="pb-4 border-b border-zinc-200">
                <SheetTitle className="flex items-center justify-between">
                  <span>Notifications</span>
                  {user.notifications > 0 && <Badge className="bg-red-500 text-white">{user.notifications} new</Badge>}
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg ${notification.read ? "bg-white" : "bg-emerald-50"} border ${notification.read ? "border-zinc-200" : "border-emerald-200"}`}
                  >
                    <div className="flex justify-between">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <span className="text-xs text-zinc-500">{notification.time}</span>
                    </div>
                    <p className="text-xs text-zinc-600 mt-1">{notification.description}</p>
                  </div>
                ))}
                <Button variant="outline" className="w-full text-sm">
                  View all notifications
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 p-1 rounded-full">
                <Avatar className="h-8 w-8 border border-zinc-200">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs text-zinc-500">{user.role}</p>
                </div>
                <ChevronDown className="h-3 w-3 hidden md:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-zinc-500">{user.role}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

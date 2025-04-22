"use client"


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import {
  Home,
  BarChart3,
  Wallet,
  Settings,
  HelpCircle,
  LogOut,
  FileText,
  Building,
  Briefcase,
  PieChart,
  DollarSign,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useLocation } from "react-router-dom"
import { Link } from "react-router-dom"

type DashboardSidebarProps = {
  navItems: {
    path: string
    label: string
    icon: React.ElementType
  }[]
}
export default function DashboardSidebar({ navItems }: DashboardSidebarProps) {
  const location = useLocation()

  // Mock user data - in a real app, this would come from authentication
  const user = {
    name: "James Chen",
    role: "Investor",
    avatar: "/placeholder.svg?height=40&width=40",
  }


  console.log(navItems)
  const isActive = (path: string) => {
    return location.pathname === path
  }

  const mainNavItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/portfolio", label: "Portfolio", icon: BarChart3 },
    { path: "/marketplace", label: "Marketplace", icon: Wallet },
    { path: "/msmes", label: "MSMEs", icon: Building },
  ]

  const investmentNavItems = [
    { path: "/investments/active", label: "Active Investments", icon: Briefcase },
    { path: "/investments/opportunities", label: "Opportunities", icon: PieChart },
    { path: "/investments/earnings", label: "Earnings", icon: DollarSign },
  ]

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="w-full">
      <SidebarHeader className="border-b border-zinc-200 pb-3 ">
        <div className="flex items-center ">
          <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center">
            <span className="text-white font-bold">FND</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={isActive(item.path)} tooltip={item.label}>
                    <Link to={item.path}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


      </SidebarContent>

      <SidebarFooter className="border-t border-zinc-200">
        <div className="">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-8 w-8 border border-zinc-200">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>

          </div>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Settings">
                <Link to="/settings">
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Logout">
                <Link to="/auth">
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

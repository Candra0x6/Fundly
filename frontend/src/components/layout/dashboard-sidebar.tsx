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
import logo from "@/assets/logo.svg"
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


  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="w-full">
      <SidebarHeader className="border-b border-zinc-200 py-[15px] flex items-center ">
        <img src={logo} />
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

    </Sidebar>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import DashboardSidebar from "@/components/layout/dashboard-sidebar"
import DashboardHeader from "@/components/layout/dashboard-header"

interface DashboardLayoutProps {
  children: React.ReactNode
  navItems: {
    path: string
    label: string
    icon: React.ElementType
  }[]
}

export default function DashboardLayout({ children, navItems }: DashboardLayoutProps) {
  // State to track if the sidebar should be open on mobile
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        window.innerWidth < 768 &&
        !target.closest('[data-sidebar="sidebar"]') &&
        !target.closest('[data-sidebar="trigger"]')
      ) {
        setSidebarOpen(false)
      }
    }

    document.addEventListener("click", handleOutsideClick)
    return () => document.removeEventListener("click", handleOutsideClick)
  }, [])

  return (
    <SidebarProvider defaultOpen={true} open={sidebarOpen} onOpenChange={setSidebarOpen} >
      <div className="min-h-screen bg-white  z-50 flex w-full">
        <DashboardSidebar navItems={navItems} />
        <div className=" min-h-screen w-full">
          <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="p-4 md:p-6 w-full">{children}</main>
          <footer className="border-t border-zinc-200 py-4 px-6 text-sm text-zinc-500 text-center">
            © 2025 Fundify. All rights reserved.
          </footer>
        </div>
      </div>
    </SidebarProvider>
  )
}

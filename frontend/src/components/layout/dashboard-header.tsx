"use client"

import { useEffect, useState } from "react"
import { Bell, Search, ChevronDown, Plus, Settings, HelpCircle, LogOut, User, CreditCard, ExternalLink, History, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/utility/use-auth-client"
import { Principal } from "@dfinity/principal"
import { useTokenActor } from "@/utility/actors/tokenActor"
import { useNavigate } from "react-router-dom"
import { getSession } from "@/utility/session"
import WalletMenu from "@/components/elements/WalletMenu"
interface DashboardHeaderProps {
  onMenuClick?: () => void
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const user = getSession("user")

  let role: string;

  if (user?.role && "MSME" in user.role) {
    role = "msme";
  } else if (user?.role && "Investor" in user.role) {
    role = "user";
  } else if (user?.role && "Admin" in user.role) {
    role = "admin";
  } else if (user?.role && "Verify" in user.role) {
    role = "verify";
  }


  // Mock notifications


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


          {/* User Profile */}
          <WalletMenu />
        </div>
      </div>
    </header>
  )
}

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

interface DashboardHeaderProps {
  onMenuClick?: () => void
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [balance, setBalance] = useState<number>()
  const { principal } = useAuth()
  const user = getSession("user")
  console.log(user)

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

  const tokenActor = useTokenActor()
  const navigate = useNavigate()
  useEffect(() => {
    const fetchBalance = async () => {
      const res = await tokenActor.getBalance()
      setBalance(Number(res))
    }

    fetchBalance()
  }, [])
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
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                className={`ml-2 text-primary hover:bg-primary/20 bg-primary/10 `}
              >
                <Wallet className="mr-2 h-4 w-4" />
                <>
                  <span className="hidden md:inline mr-1">ljlklk</span>
                  <ChevronDown className="h-4 w-4" />
                </>

              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[300px]">
              <DropdownMenuLabel>Wallet</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-2">
                <div className="rounded-lg bg-muted p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Address</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <ExternalLink className="h-3 w-3" />
                      <span className="sr-only">View on Explorer</span>
                    </Button>
                  </div>
                  <code className="text-xs bg-muted-foreground/20 p-1 rounded">
                    {Principal.from(principal).toString() || '-'}
                  </code>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-sm font-medium">Balance</span>
                    <span className="text-xl font-bold">{balance}</span>
                  </div>
                  <div className="mt-1 flex justify-between items-center text-xs text-muted-foreground">
                    <span>$FND</span>
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => navigate(`/dashboard/${role}/transactions`)} className="cursor-pointer">
                  <History className="mr-2 h-4 w-4" />
                  <span>Transaction History</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Deposit Funds</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Wallet Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Disconnect Wallet</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

import { ChevronDown, LayoutDashboard, User, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuGroup, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import React, { useEffect, useState } from 'react'
import { Principal } from '@dfinity/principal'
import { useAuth } from '@/utility/use-auth-client'
import { useNavigate } from 'react-router-dom'
import { LogOut, History } from 'lucide-react'
import { useTokenActor } from '@/utility/actors/tokenActor'
import { truncatePrincipal } from '@/utility/converts/truncatePrincipal'
import { getSession } from '@/utility/session'
function WalletMenui() {
  const { principal, logout } = useAuth()
  const navigate = useNavigate()
  const [balance, setBalance] = useState<number>(0)

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

  const tokenActor = useTokenActor()
  useEffect(() => {
    const fetchBalance = async () => {
      const res = await tokenActor.getBalance()
      setBalance(Number(res) / 1000)
    }

    fetchBalance()
  }, [])
  return (

    <DropdownMenu >
      <DropdownMenuTrigger>
        <Button
          className={`ml-2 text-primary hover:bg-primary/20 bg-primary/10 `}
        >
          <Wallet className="mr-2 h-4 w-4" />
          <>
            <span className="hidden md:inline mr-1">{truncatePrincipal(principal as Principal)}</span>
            <ChevronDown className="h-4 w-4" />
          </>

        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[300px]">
        <DropdownMenuLabel>{user?.name || "Wallet"}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-2">
          <div className="rounded-lg bg-emerald-50 p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Address</span>

            </div>
            <code className="text-xs bg-emerald-800/10 p-1 rounded">
              {Principal.from(principal as Principal).toString() || '-'}
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
          <DropdownMenuItem onClick={() => navigate(`/dashboard/${role}`)} className="cursor-pointer">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate(`/dashboard/${role}/transactions`)} className="cursor-pointer">
            <History className="mr-2 h-4 w-4" />
            <span>Transaction History</span>
          </DropdownMenuItem>

        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={logout}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Disconnect Wallet</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default WalletMenui



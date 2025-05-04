

import { Card, CardContent } from "@/components/ui/card"
import { Coins, Users, BarChart3, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Value } from "@declarations/token_canister/token_canister.did"
import { convertNat } from "@/utility/converts/convertNat"
import { convertBigNumber } from "@/utility/converts/convertBigNumber"
import { splitIdentity } from "@/utility/converts/splitIdentity"
export default function AdminStats({ metadata, minter }: { metadata: [string, Value][], minter: string }) {
  // Mock statistics data
  const stats = [
    {
      title: "Total FND Supply",
      value: convertBigNumber(convertNat(metadata?.find(([key]) => key === "icrc1:total_supply")?.[1] || { Nat: 0n }, 8)),

      icon: Coins,
    },
    {
      title: "Fee",
      value: convertBigNumber(convertNat(metadata?.find(([key]) => key === "icrc1:fee")?.[1] || { Nat: 0n }, 8)),

      icon: Users,
    },
    {
      title: "Symbol",
      // @ts-ignore
      value: "$" + metadata?.find(([key]) => key === "icrc1:symbol")?.[1].Text || "",

      icon: BarChart3,
    },
    {
      title: "Minter",
      value: splitIdentity(minter),

      icon: BarChart3,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-zinc-500">{stat.title}</p>
              <stat.icon className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

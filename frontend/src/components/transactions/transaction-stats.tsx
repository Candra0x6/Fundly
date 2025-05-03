"use client"

import { ArrowDown, ArrowUp, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AllTransactions } from "@/types/transaction"

interface TransactionStatsProps {
  transactions: AllTransactions[]
}

export default function TransactionStats({ transactions }: TransactionStatsProps) {
  // Calculate total transaction volume
  const calculateTotalVolume = () => {
    return transactions.reduce((total, tx) => {
      if ("amount" in tx) {
        return total + Number(tx.amount)
      }
      return total
    }, 0)
  }

  // Calculate incoming transactions
  const calculateIncoming = () => {
    return transactions.reduce((total, tx) => {
      if (tx.category === "distributionTx" && "amount" in tx) {
        return total + Number(tx.amount)
      }
      if (tx.category === "tokenTx" && "to" in tx && "amount" in tx) {
        // Assuming the current user is the recipient
        return total + Number(tx.amount)
      }
      return total
    }, 0)
  }

  // Calculate outgoing transactions
  const calculateOutgoing = () => {
    return transactions.reduce((total, tx) => {
      if (tx.category === "tokenTx" && "from" in tx && "amount" in tx) {
        // Assuming the current user is the sender
        return total + Number(tx.amount)
      }
      return total
    }, 0)
  }

  const totalVolume = calculateTotalVolume()
  const incoming = calculateIncoming()
  const outgoing = calculateOutgoing()

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Transaction Volume</CardTitle>
          <DollarSign className="h-4 w-4 text-zinc-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${Number(totalVolume) / 1000}</div>
          <p className="text-xs text-zinc-500">Across all transaction types</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Incoming</CardTitle>
          <ArrowDown className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">${Number(incoming) / 1000}</div>
          <p className="text-xs text-zinc-500">Total received</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Outgoing</CardTitle>
          <ArrowUp className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">${Number(outgoing) / 1000}</div>
          <p className="text-xs text-zinc-500">Total sent</p>
        </CardContent>
      </Card>
    </>
  )
}

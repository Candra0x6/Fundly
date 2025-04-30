"use client"

import { format } from "date-fns"
import { ArrowLeftRight, ArrowRight, DollarSign, Send } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { AllTransactions } from "@/types/transaction"
import { Principal } from "@dfinity/principal"
interface TransactionCardProps {
  transaction: AllTransactions
}

export default function TransactionCard({ transaction }: TransactionCardProps) {
  // Helper function to truncate account addresses
  const truncateAccount = (account: string) => {
    if (account.length <= 12) return account
    return `${account.slice(0, 6)}...${account.slice(-4)}`

  }

  // Get transaction icon based on type
  const getTransactionIcon = () => {
    switch (transaction.category) {
      case "nftTx":
        return <ArrowLeftRight className="h-5 w-5 text-emerald-500" />
      case "distributionTx":
        return <Send className="h-5 w-5 text-blue-500" />
      case "tokenTx":
        return <DollarSign className="h-5 w-5 text-purple-500" />
      default:
        return null
    }
  }

  // Get transaction type label
  const getTransactionTypeLabel = () => {
    switch (transaction.category) {
      case "nftTx":
        return "NFT Transfer"
      case "distributionTx":
        return "Distribution"
      case "tokenTx":
        return "Revenue Share"
      default:
        return transaction.category
    }
  }

  // Get status badge style


  return (
    <Card
      className="overflow-hidden border-l-4 hover:shadow-md transition-shadow"
      style={{
        borderLeftColor:
          transaction.category === "nftTx"
            ? "rgb(16, 185, 129)"
            : transaction.category === "distributionTx"
              ? "rgb(59, 130, 246)"
              : "rgb(168, 85, 247)",
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-zinc-100">{getTransactionIcon()}</div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{getTransactionTypeLabel()}</span>
              </div>
              <div className="text-sm text-zinc-500">
                {new Date(Number(transaction.timestamp) / 1000000).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="text-right">
            {"amount" in transaction && <div className="font-semibold">${transaction.amount.toLocaleString()}</div>}
            <div className="text-xs text-zinc-500">
              {transaction.category === "nftTx" && `Token #${transaction.tokenId}`}
              {transaction.category === "distributionTx" && `Token #${transaction.tokenId}`}
              {transaction.category === "tokenTx" && "operation" in transaction && transaction.operation}
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-zinc-100">
          <div className="flex items-center justify-between text-sm">
            <div>
              {transaction.category === "nftTx" && (
                <span className="text-zinc-600">
                  From: <span className="font-medium">{truncateAccount(Principal.from(transaction.from.owner).toString())}</span> To:{" "}
                  <span className="font-medium">{truncateAccount(Principal.from(transaction.to.owner).toString())}</span>
                </span>
              )}
              {transaction.category === "distributionTx" && (
                <span className="text-zinc-600">
                  Recipient: <span className="font-medium">{truncateAccount(Principal.from(transaction.recipient.owner).toString())}</span>
                </span>
              )}
              {transaction.category === "tokenTx" && (
                <span className="text-zinc-600">
                  From: <span className="font-medium">{truncateAccount(Principal.from(transaction.from.owner).toString())}</span> To:{" "}
                  <span className="font-medium">{truncateAccount(Principal.from(transaction.to.owner).toString())}</span>
                </span>
              )}
            </div>
            <div className="flex items-center text-emerald-600">
              <span className="mr-1">Details</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}



import { format } from "date-fns"
import { ArrowLeftRight, DollarSign, FileText, Send, User } from "lucide-react"
import type { AllTransactions } from "@/types/transaction"
import { Principal } from "@dfinity/principal"

interface TransactionDetailsProps {
  transaction: AllTransactions
}

export default function TransactionDetails({ transaction }: TransactionDetailsProps) {
  // Helper function to format timestamps
  const formatTimestamp = (timestamp: bigint) => {
    return format(new Date(Number(timestamp) / 1000000), "MMMM d, yyyy 'at' h:mm:ss a")
  }

  // Get transaction type label
  const getTransactionTypeLabel = () => {
    switch (transaction.category) {
      case "tokenTx":
        return "Token Transfer"
      case "distributionTx":
        return "Distribution"
      case "nftTx":
        return "NFT Transfer"
      default:
        return transaction.category
    }
  }



  // Get transaction icon based on type
  const getTransactionIcon = () => {
    switch (transaction.category) {
      case "tokenTx":
        return <ArrowLeftRight className="h-8 w-8 text-emerald-500" />
      case "distributionTx":
        return <Send className="h-8 w-8 text-blue-500" />
      case "nftTx":
        return <DollarSign className="h-8 w-8 text-purple-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-full bg-zinc-100">{getTransactionIcon()}</div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">{getTransactionTypeLabel()}</h2>
          </div>
          <p className="text-zinc-500">
            {transaction.category === "tokenTx" && `Transaction ID: ${transaction.tokenId}`}
            {transaction.category === "distributionTx" && transaction.txId && `Transaction ID: ${transaction.txId}`}
            {transaction.category === "nftTx" && `Transaction ID: ${transaction.id}`}
          </p>
        </div>
      </div>

      {/* Transaction details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Transaction Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-zinc-500">Type</span>
              <span className="font-medium">{getTransactionTypeLabel()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Date & Time</span>
              <span className="font-medium">{formatTimestamp(transaction.timestamp)}</span>
            </div>

            {(transaction.category === "tokenTx" || transaction.category === "distributionTx") && (
              <div className="flex justify-between">
                <span className="text-zinc-500">Token ID</span>
                <span className="font-medium">#{transaction.tokenId}</span>
              </div>
            )}
            {transaction.category === "nftTx" && "operation" in transaction && (
              <div className="flex justify-between">
                <span className="text-zinc-500">Operation</span>
                <span className="font-medium">{transaction.operation}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-lg">Financial Details</h3>
          <div className="space-y-3">
            {"amount" in transaction && (
              <div className="flex justify-between">
                <span className="text-zinc-500">Amount</span>
                <span className="font-medium">${transaction.amount.toLocaleString()}</span>
              </div>
            )}
            {transaction.category === "tokenTx" && "fee" in transaction && transaction.fee !== null && (
              <div className="flex justify-between">
                <span className="text-zinc-500">Fee</span>
                <span className="font-medium">${transaction.fee.toLocaleString()}</span>
              </div>
            )}
            {transaction.category === "tokenTx" && "fee" in transaction && transaction.fee !== null && (
              <div className="flex justify-between">
                <span className="text-zinc-500">Total</span>
                <span className="font-medium">${(Number(transaction.amount) + Number(transaction.fee)).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account information */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(transaction.category === "tokenTx" || transaction.category === "nftTx") && (
            <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-zinc-500" />
                <span className="font-medium">From</span>
              </div>
              <div className="text-sm break-all">{Principal.from(transaction.from.owner).toString()}</div>
            </div>
          )}
          {(transaction.category === "tokenTx" || transaction.category === "nftTx") && (
            <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-zinc-500" />
                <span className="font-medium">To</span>
              </div>
              <div className="text-sm break-all">{Principal.from(transaction.to.owner).toString()}</div>
            </div>
          )}
          {transaction.category === "distributionTx" && (
            <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-zinc-500" />
                <span className="font-medium">Recipient</span>
              </div>
              <div className="text-sm break-all">{Principal.from(transaction.recipient.owner).toString()}</div>
            </div>
          )}
        </div>
      </div>

      {/* Memo/Notes */}
      {((transaction.category === "tokenTx" && "memo" in transaction) ||
        (transaction.category === "nftTx" && "memo" in transaction)) && (
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Memo</h3>
            <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200">
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-zinc-500 mt-0.5" />
                <div className="text-sm">
                  {transaction.category === "tokenTx" && "memo" in transaction && new TextDecoder().decode(transaction.memo[0])}
                  {transaction.category === "nftTx" && "memo" in transaction && new TextDecoder().decode(transaction.memo[0])}
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

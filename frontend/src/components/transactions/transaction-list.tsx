"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { AllTransactions } from "@/types/transaction"
import TransactionCard from "@/components/transactions/transaction-card"
import TransactionDetails from "@/components/transactions/transaction-details"

interface TransactionListProps {
  transactions: AllTransactions[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onTransactionSelect: (transaction: AllTransactions) => void
  selectedTransaction: AllTransactions | null
}

export default function TransactionList({
  transactions,
  currentPage,
  totalPages,
  onPageChange,
  onTransactionSelect,
  selectedTransaction,
}: TransactionListProps) {
  const [detailsOpen, setDetailsOpen] = useState(false)

  // Handle transaction click
  const handleTransactionClick = (transaction: AllTransactions) => {
    onTransactionSelect(transaction)
    setDetailsOpen(true)
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    onPageChange(page)
  }

  // Generate pagination buttons
  const renderPaginationButtons = () => {
    const buttons = []
    const maxButtons = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2))
    const endPage = Math.min(totalPages, startPage + maxButtons - 1)

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1)
    }

    // First page button
    buttons.push(
      <Button
        key="first"
        variant="ghost"
        size="icon"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(1)}
        className="h-8 w-8"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>,
    )

    // Previous page button
    buttons.push(
      <Button
        key="prev"
        variant="ghost"
        size="icon"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>,
    )

    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "ghost"}
          onClick={() => handlePageChange(i)}
          className={`h-8 w-8 ${currentPage === i ? "bg-emerald-500 hover:bg-emerald-600" : ""}`}
        >
          {i}
        </Button>,
      )
    }

    // Next page button
    buttons.push(
      <Button
        key="next"
        variant="ghost"
        size="icon"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>,
    )

    // Last page button
    buttons.push(
      <Button
        key="last"
        variant="ghost"
        size="icon"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(totalPages)}
        className="h-8 w-8"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>,
    )

    return buttons
  }

  return (
    <div className="space-y-6 mt-6">
      {transactions.length === 0 ? (
        <div className="text-center py-12 bg-zinc-50 rounded-lg border border-zinc-200">
          <div className="mx-auto w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">No Transactions Found</h3>
          <p className="text-zinc-500 max-w-md mx-auto">
            No transactions match your current filters. Try adjusting your filters or search criteria.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={`${transaction.category}-${transaction.tokenId}`}
                onClick={() => handleTransactionClick(transaction)}
                className="cursor-pointer transition-transform hover:scale-[1.01]"
              >
                <TransactionCard transaction={transaction} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center pt-4 border-t border-zinc-200">
            <div className="text-sm text-zinc-500">
              Showing {(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, transactions.length)} of{" "}
              {transactions.length} transactions
            </div>
            <div className="flex gap-1">{renderPaginationButtons()}</div>
          </div>

          {/* Transaction Details Dialog */}
          <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader className="flex items-center justify-between">
                <DialogTitle>Transaction Details</DialogTitle>
                <Button variant="ghost" size="icon" onClick={() => setDetailsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </DialogHeader>
              {selectedTransaction && <TransactionDetails transaction={selectedTransaction} />}
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}

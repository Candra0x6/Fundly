"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import TransactionList from "@/components/transactions/transaction-list"
import TransactionStats from "@/components/transactions/transaction-stats"
import TransactionChart from "@/components/transactions/transaction-chart"
import { AllTransactions } from "@/types/transaction"
import { useTokenActor } from "@/utility/actors/tokenActor"
import { useNftActor } from "@/utility/actors/nftActor"
import { useRevenueActor } from "@/utility/actors/revanueActor"
import { useAuth } from "@/utility/use-auth-client"
import { Principal } from "@dfinity/principal"

export default function TransactionsPage() {
  const { principal } = useAuth()
  // State for filters
  const [allTransactions, setAllTransactions] = useState<AllTransactions[]>([])
  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>([undefined, undefined])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [amountRange, setAmountRange] = useState<[number, number]>([0, 10000])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<string>("date-desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTransaction, setSelectedTransaction] = useState<AllTransactions | null>(null)

  // Apply filters to transactions
  const filteredTransactions = allTransactions.filter((transaction) => {
    // Date range filter
    if (dateRange[0] && dateRange[1]) {
      const txDate = new Date(Number(transaction.timestamp))
      if (txDate < dateRange[0] || txDate > dateRange[1]) return false
    }

    // Transaction type filter
    if (selectedTypes.length > 0 && !selectedTypes.includes(transaction.category)) return false

    // Status filter

    // Amount filter (for transactions with amount)
    if ("amount" in transaction) {
      if (transaction.amount < amountRange[0] || transaction.amount > amountRange[1]) return false
    }

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesId = transaction.tokenId.toString().includes(query)
      const matchesType = transaction.category.toLowerCase().includes(query)

      // Check accounts
      let matchesAccounts = false
      if ("from" in transaction && transaction.from) {
        matchesAccounts = Principal.from(transaction.from.owner).toText().toLowerCase().includes(query)
      }
      if ("to" in transaction && transaction.to && !matchesAccounts) {
        matchesAccounts = Principal.from(transaction.to.owner).toText().toLowerCase().includes(query)
      }
      if ("recipient" in transaction && transaction.recipient && !matchesAccounts) {
        matchesAccounts = Principal.from(transaction.recipient.owner).toText().toLowerCase().includes(query)
      }

      // Check memo
      let matchesMemo = false
      if ("memo" in transaction && transaction.memo) {
        matchesMemo = transaction.memo.toString().toLowerCase().includes(query)
      }

      if (!(matchesId || matchesType || matchesAccounts || matchesMemo)) {
        return false
      }
    }

    return true
  })

  // Sort transactions
  // @ts-ignore
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch (sortBy) {
      case "date-asc":
        return new Date(Number(a.timestamp)).getTime() - new Date(Number(b.timestamp)).getTime()
      case "date-desc":
        return new Date(Number(b.timestamp)).getTime() - new Date(Number(a.timestamp)).getTime()
      case "amount-asc":
        return "amount" in a && "amount" in b ? a.amount - b.amount : 0
      case "amount-desc":
        return "amount" in a && "amount" in b ? b.amount - a.amount : 0
      default:
        return new Date(Number(b.timestamp)).getTime() - new Date(Number(a.timestamp)).getTime()
    }
  })

  // Pagination
  const itemsPerPage = 10
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage)
  const paginatedTransactions = sortedTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Handle filter changes
  const handleFilterChange = (
    newDateRange: [Date | undefined, Date | undefined],
    newTypes: string[],
    newAmountRange: [number, number],
    newSearchQuery: string,
  ) => {
    setDateRange(newDateRange)
    setSelectedTypes(newTypes)
    setAmountRange(newAmountRange)
    setSearchQuery(newSearchQuery)
    setCurrentPage(1) // Reset to first page when filters change
  }

  // Handle sort change
  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy)
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Handle transaction selection
  const handleTransactionSelect = (transaction: AllTransactions) => {
    setSelectedTransaction(transaction)
  }

  const tokenActor = useTokenActor()
  const nftActor = useNftActor()
  const revenueActor = useRevenueActor()
  useEffect(() => {
    const fetchTransactions = async () => {
      const tokenTransactions = await tokenActor.getTransationByOwner(principal as Principal)
      const nftTransactions = await nftActor.getTransactionsByOwner(principal as Principal)
      const revenueTransactions = await revenueActor.getTransactionsByOwner(principal as Principal)
      // @ts-ignore
      setAllTransactions([...tokenTransactions, ...nftTransactions, ...revenueTransactions])
    }
    fetchTransactions()
  }, [])

  console.log(allTransactions)

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-zinc-500 mt-1">View and manage your transaction history</p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <TransactionStats transactions={allTransactions} />
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                A complete record of all your transactions. Use the filters to narrow down your search.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* <TransactionFilters
                onFilterChange={handleFilterChange}
                onSortChange={handleSortChange}
                dateRange={dateRange}
                selectedTypes={selectedTypes}
                amountRange={amountRange}
                searchQuery={searchQuery}
                sortBy={sortBy}
              /> */}

              <TransactionList
                transactions={paginatedTransactions}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onTransactionSelect={handleTransactionSelect}
                selectedTransaction={selectedTransaction}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Analytics</CardTitle>
              <CardDescription>
                Visualize your transaction history and identify patterns in your financial activities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionChart transactions={allTransactions} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

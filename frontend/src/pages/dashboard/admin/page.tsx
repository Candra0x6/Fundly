

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, ArrowRight, Settings, Users, Coins, BarChart3 } from "lucide-react"
import TokenAmountInput from "@/components/admin/token-amount-input"
import TokenInitialization from "@/components/admin/token-initialization"
import AdminStats from "@/components/admin/admin-stats"
import { useAuth } from "@/utility/use-auth-client"
import { createActor, canisterId } from "@declarations/token_canister"
import toast from "react-hot-toast"
import { useTokenActor } from "@/utility/actors/tokenActor"
import { Value } from "@declarations/token_canister/token_canister.did"
import { Principal } from "@dfinity/principal"
export default function AdminDashboardPage() {
  const [initialized, setInitialized] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const [tokenAmount, setTokenAmount] = useState("")
  const [metadata, setMetadata] = useState<[string, Value][]>([])
  const [minter, setMinter] = useState("")
  const [tokenError, setTokenError] = useState("")
  const [activeTab, setActiveTab] = useState("token-management")
  const { identity } = useAuth()
  const tokenActor = useTokenActor()

  const actor = createActor(canisterId, {
    agentOptions: {
      // @ts-ignore
      identity,
    },
  });

  useEffect(() => {
    const getMetadata = async () => {
      const metadata = await actor.icrc1_metadata()
      const minter = await actor.icrc1_minter()
      const balance = await actor.icrc1_balance_of({ owner: identity?.getPrincipal() as Principal, subaccount: [] })
      setMetadata(metadata)
      setMinter(minter.toText())
      console.log(balance)
    }
    getMetadata()
  }, [])
  // Mock function to initialize tokens
  const handleInitializeTokens = async () => {
    setIsInitializing(true)

    try {
      setInitialized(true)
      localStorage.setItem("initialized", "true")
      await tokenActor.initialize()
      toast.success("Tokens initialized successfully")
    } catch (error) {
      console.error("Failed to initialize tokens:", error)
      toast.error("Failed to initialize tokens")
    } finally {
      setIsInitializing(false)
    }
  }

  // Handle token amount submission
  const handleSubmitTokenAmount = async () => {
    const metadata = await tokenActor.icrc1_metadata()
    console.log("metadata", metadata)
    if (!tokenAmount) {
      setTokenError("Please enter a token amount")
      return
    }

    const amount = Number.parseFloat(tokenAmount.replace(/,/g, ""))
    if (isNaN(amount)) {
      setTokenError("Please enter a valid number")
      return
    }

    if (amount < 100) {
      setTokenError("Minimum amount is 100 FND")
      return
    }

    if (amount > 1000000) {
      setTokenError("Maximum amount is 1,000,000 FND")
      return
    }

    // Clear error if validation passes
    setTokenError("")

    // Here you would typically make an API call to update the token amount
    console.log("Token amount submitted:", amount)

    // Show success message or redirect
  }


  console.log(identity)
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 onClick={async () => {
                // transfer 100 FND to another account
                const balance = await tokenActor.getBalance()
                console.log(balance)
              }} className="text-2xl font-bold mb-1">Admin Dashboard</h1>
              <p className="text-zinc-500" onClick={async () => {
                const result = await tokenActor.icrc1_transfer({
                  from_subaccount: [],
                  to: {
                    owner: Principal.fromText("p7s44-6t2us-vf3ji-kvq5h-w4ux3-v735x-gix25-zsfx6-i4qxb-mxucl-7qe"),
                    subaccount: [],
                  },
                  amount: BigInt(100),
                  fee: [],
                  memo: [],
                  created_at_time: [],
                })
                console.log(result)
              }}>Manage platform tokens and settings</p>
            </div>
          </div>

          <AdminStats metadata={metadata} minter={minter} />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="token-management" className="flex items-center gap-2">
                <Coins className="h-4 w-4" />
                <span className="hidden sm:inline">Token Management</span>
                <span className="sm:hidden">Tokens</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">User Management</span>
                <span className="sm:hidden">Users</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
                <span className="sm:hidden">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Platform Settings</span>
                <span className="sm:hidden">Settings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="token-management">
              {!initialized ? (
                <TokenInitialization onInitialize={handleInitializeTokens} isInitializing={isInitializing} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Manage FND Tokens</CardTitle>
                      <CardDescription>Configure token amounts and distribution settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <TokenAmountInput
                        label="Total Token Supply"
                        value={metadata?.find(([key]) => key === "symbol")?.[1].toString() || ""}
                        onChange={setTokenAmount}
                        min={100}
                        max={1000000}
                        error={tokenError}
                      />

                      {tokenError ? (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription>{tokenError}</AlertDescription>
                        </Alert>
                      ) : tokenAmount ? (
                        <Alert className="bg-emerald-50 text-emerald-800 border-emerald-200">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          <AlertTitle>Valid Amount</AlertTitle>
                          <AlertDescription>The token amount is valid and ready to be submitted.</AlertDescription>
                        </Alert>
                      ) : null}
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-emerald-500 hover:bg-emerald-600" onClick={handleSubmitTokenAmount}>
                        Update Token Supply
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Token Distribution</CardTitle>
                      <CardDescription>View current token allocation and distribution</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Available for Investment</span>
                          <span className="font-semibold text-emerald-600">750,000 FND</span>
                        </div>
                        <div className="w-full bg-zinc-100 h-2 rounded-full">
                          <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Reserved for Platform</span>
                          <span className="font-semibold text-emerald-600">150,000 FND</span>
                        </div>
                        <div className="w-full bg-zinc-100 h-2 rounded-full">
                          <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "15%" }}></div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Team Allocation</span>
                          <span className="font-semibold text-emerald-600">100,000 FND</span>
                        </div>
                        <div className="w-full bg-zinc-100 h-2 rounded-full">
                          <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "10%" }}></div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        Adjust Distribution <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage platform users and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="py-8 text-center text-zinc-500">
                    <p>User management features will be implemented here.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Analytics</CardTitle>
                  <CardDescription>View platform usage and performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="py-8 text-center text-zinc-500">
                    <p>Analytics dashboard will be implemented here.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Settings</CardTitle>
                  <CardDescription>Configure global platform settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="py-8 text-center text-zinc-500">
                    <p>Platform settings will be implemented here.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

interface TokenInitializationProps {
  onInitialize: () => void
  isInitializing: boolean
}

export default function TokenInitialization({ onInitialize, isInitializing }: TokenInitializationProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Initialize FND Tokens</CardTitle>
          <CardDescription>Before you can manage tokens, you need to initialize the FND token contract</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="bg-amber-50 text-amber-800 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              Token initialization is a one-time process that deploys the FND token contract to the blockchain. This
              action cannot be undone.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0 mt-0.5">
                <CheckCircle className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium">Deploy Token Contract</h3>
                <p className="text-sm text-zinc-500">
                  The FND token contract will be deployed to the blockchain with standard ERC-20 functionality.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0 mt-0.5">
                <CheckCircle className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium">Set Initial Supply</h3>
                <p className="text-sm text-zinc-500">
                  The initial token supply will be minted and assigned to the platform treasury.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0 mt-0.5">
                <CheckCircle className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium">Configure Distribution</h3>
                <p className="text-sm text-zinc-500">
                  Set up token distribution parameters for investors, MSMEs, and platform operations.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-emerald-500 hover:bg-emerald-600 h-12"
            onClick={onInitialize}
            disabled={isInitializing}
          >
            {isInitializing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Initializing Tokens...
              </>
            ) : (
              "Initialize FND Tokens"
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

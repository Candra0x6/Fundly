

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Send, AlertCircle } from "lucide-react"

interface NFTTransferModalProps {
  nftId: string | null
  onClose: () => void
  nfts: any[]
}

export default function NFTTransferModal({ nftId, onClose, nfts }: NFTTransferModalProps) {
  const [recipientAddress, setRecipientAddress] = useState("")
  const [step, setStep] = useState(1)
  const [error, setError] = useState("")

  // Find the selected NFT
  const selectedNFT = nfts.find((nft) => nft.id === nftId)

  // Handle transfer
  const handleTransfer = () => {
    if (!recipientAddress.trim()) {
      setError("Please enter a recipient address")
      return
    }

    // Validate address format (this is a simple example)
    if (!recipientAddress.startsWith("0x") || recipientAddress.length !== 42) {
      setError("Please enter a valid wallet address")
      return
    }

    // Move to confirmation step
    setError("")
    setStep(2)
  }

  // Handle confirmation
  const handleConfirm = () => {
    // In a real app, this would call a blockchain transaction
    // For now, we'll just simulate success
    setStep(3)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Transfer NFT</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg">
                <div className="h-12 w-12 rounded-md bg-zinc-100 overflow-hidden">
                  <img
                    src={selectedNFT?.image || "/placeholder.svg"}
                    alt={selectedNFT?.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{selectedNFT?.title}</p>
                  <p className="text-sm text-zinc-500">{selectedNFT?.company}</p>
                </div>
              </div>

              <div>
                <label htmlFor="recipient" className="block text-sm font-medium mb-1">
                  Recipient Address
                </label>
                <Input
                  id="recipient"
                  placeholder="Enter wallet address (0x...)"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className={error ? "border-red-300" : ""}
                />
                {error && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-red-500">
                    <AlertCircle className="h-3 w-3" />
                    {error}
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={handleTransfer}>
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-700">Confirm Transfer</p>
                    <p className="text-sm text-yellow-600 mt-1">
                      You are about to transfer this NFT to another wallet. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-zinc-500">NFT</p>
                  <p className="font-medium">{selectedNFT?.title}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Value</p>
                  <p className="font-medium">{selectedNFT?.invested}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Recipient</p>
                  <p className="font-medium font-mono text-sm break-all">{recipientAddress}</p>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={handleConfirm}>
                  Confirm Transfer
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Send className="h-8 w-8 text-emerald-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Transfer Initiated</h3>
                <p className="text-zinc-500 mt-1">
                  Your NFT transfer has been initiated. It may take a few minutes to complete.
                </p>
              </div>
              <div className="pt-4">
                <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

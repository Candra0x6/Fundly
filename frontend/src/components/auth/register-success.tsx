"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Mail } from "lucide-react"

interface RegisterSuccessMessageProps {
  onBackToLogin: () => void
}

export default function RegisterSuccessMessage({ onBackToLogin }: RegisterSuccessMessageProps) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
      <div className="mb-6 flex justify-center">
        <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-2">Registration successful!</h1>
      <p className="text-zinc-500 mb-6">
        Your account has been created successfully. We've sent a verification email to your email address. Please check
        your inbox and verify your email to continue.
      </p>

      <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600 text-sm flex items-start gap-2 mb-6">
        <Mail className="h-5 w-5 flex-shrink-0" />
        <span>If you don't see the email in your inbox, please check your spam folder.</span>
      </div>

      <Button onClick={onBackToLogin} className="w-full bg-emerald-500 hover:bg-emerald-600">
        Proceed to login
      </Button>
    </motion.div>
  )
}

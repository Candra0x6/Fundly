"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, AlertCircle, Info } from "lucide-react"
import toast from "react-hot-toast"

interface RegisterFormProps {
  onSuccess: () => void
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("investor")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!agreeTerms) {
      setError("You must agree to the terms and conditions")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (role === "msme") {
        onSuccess()
        toast.success("Registration successful. As an MSME, you'll need to complete a verification process after registration.")
        window.location.href = "/msme-verification"
      } else {
        // TODO: Implement Login Inversor role Dashboard
        toast.success("Registration successful. As an Investor, you'll be able to browse and invest in verified MSMEs.")
        window.location.href = "/dashboard"
      }
    } catch (err) {
      setError("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-zinc-100 shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Create an account</h1>
        <p className="text-zinc-500">Join Fundify to start investing or raising funds</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-start gap-2"
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>I am registering as</Label>
          <RadioGroup value={role} onValueChange={setRole} className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2 rounded-lg border border-zinc-200 p-3 hover:bg-zinc-50">
              <RadioGroupItem value="investor" id="investor" />
              <Label htmlFor="investor" className="flex-1 cursor-pointer">
                <div className="font-medium">Investor</div>
                <div className="text-xs text-zinc-500">I want to invest in MSMEs</div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 rounded-lg border border-zinc-200 p-3 hover:bg-zinc-50">
              <RadioGroupItem value="msme" id="msme" />
              <Label htmlFor="msme" className="flex-1 cursor-pointer">
                <div className="font-medium">MSME</div>
                <div className="text-xs text-zinc-500">I want to raise funds for my business</div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="p-3 rounded-lg bg-blue-50 text-blue-600 text-sm flex items-start gap-2">
          <Info className="h-5 w-5 flex-shrink-0" />
          <span>
            {role === "msme"
              ? "As an MSME, you'll need to complete a verification process after registration."
              : "As an Investor, you'll be able to browse and invest in verified MSMEs."}
          </span>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox id="terms" checked={agreeTerms} onCheckedChange={(checked) => setAgreeTerms(checked as boolean)} />
          <label
            htmlFor="terms"
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the{" "}
            <a href="#" className="text-emerald-600 hover:underline">
              terms of service
            </a>{" "}
            and{" "}
            <a href="#" className="text-emerald-600 hover:underline">
              privacy policy
            </a>
          </label>
        </div>

        <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>



    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, AlertCircle } from "lucide-react"
import { useAuth } from "@/utility/use-auth-client"
import { toast } from "react-hot-toast"
import { Principal } from "@dfinity/principal"
import { clearSession } from "@/utility/session"
import { setSession } from "@/utility/session"
import { useTokenActor } from "@/utility/actors/tokenActor"
interface LoginFormProps {
  onForgotPassword: () => void
}

export default function LoginForm({ onForgotPassword }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { authActor, setUser, identity } = useAuth()
  const tokenActor = useTokenActor()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!email) {
      setError("Please fill in all fields")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      const loginResult = await authActor?.login(email);
      if ('err' in loginResult) {
        throw new Error(`Cannot authenticate: ${JSON.stringify(loginResult.err)}`);
      }

      // After login, check if we can get the profile
      const profileCheck = await authActor?.getMyProfile();
      if ('ok' in profileCheck) {
        console.log(profileCheck)

        const userData = {
          name: profileCheck.ok.username,
          email: profileCheck.ok.email,
          role: profileCheck.ok.roles[0],
          principalAddress: profileCheck.ok.principal.toText(),
          identity: identity
        }

        setUser(userData)
        if (rememberMe) {
          setSession("user", userData)
        } else {
          clearSession("user")
        }
        toast.success("Login successful")
        if ("Investor" in userData.role) {
          window.location.href = "/dashboard/user"
        } else if ("MSME" in userData.role) {
          window.location.href = "/dashboard/msme"
        } else if ("Admin" in userData.role) {
          tokenActor.setMinter(profileCheck.ok.principal)
          window.location.href = "/dashboard/admin"
        } else if ("Verifier" in userData.role) {
          window.location.href = "/dashboard/verifier"
        }
      } else {
        toast.error("Login failed")
      }

      // if (!response.ok) throw new Error('Login failed')


      // Redirect to dashboard
    } catch (err) {
      setError("Invalid email or password")
      toast.error(err instanceof Error ? err.message : "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-zinc-100 shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
        <p className="text-zinc-500">Sign in to your account to continue</p>
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


        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
          />
          <label
            htmlFor="remember"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Remember me
          </label>
        </div>

        <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>



    </div>
  )
}



import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import LoginForm from "@/components/auth/login-form"
import RegisterSuccessMessage from "@/components/auth/register-success"
import RegisterForm from "@/components/auth/register-form"

export default function AuthPage() {
  const [authView, setAuthView] = useState<
    "login" | "register" | "forgot-password" | "reset-success" | "register-success"
  >("login")

  return (
    <div className="min-h-screen bg-white flex flex-col pt-20">


      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {authView === "login" || authView === "register" ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Tabs defaultValue={authView} onValueChange={(value) => setAuthView(value as any)}>
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <LoginForm onForgotPassword={() => setAuthView("forgot-password")} />
                </TabsContent>
                <TabsContent value="register">
                  <RegisterForm onSuccess={() => setAuthView("register-success")} />
                </TabsContent>
              </Tabs>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-xl border border-zinc-100 shadow-sm"
            >
              <RegisterSuccessMessage onBackToLogin={() => setAuthView("login")} />
            </motion.div>
          )}
        </div>
      </main>

    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { useAuth } from '@/utility/use-auth-client'

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { login } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`border-b border-zinc-100 w-full z-50 bg-white ${isScrolled ? 'fixed' : 'relative'}`}>
      <div className="container mx-auto py-4 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center">
            <span className="text-white font-bold">FND</span>
          </div>
          <span className="font-semibold text-xl">Fundify</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 ">
          <a
            href="#how-it-works"
            className="text-sm font-medium text-zinc-600 hover:text-emerald-600 transition-colors"
          >
            How It Works
          </a>
          <a href="#msmes" className="text-sm font-medium text-zinc-600 hover:text-emerald-600 transition-colors">
            For MSMEs
          </a>
          <a href="#investors" className="text-sm font-medium text-zinc-600 hover:text-emerald-600 transition-colors">
            For Investors
          </a>
          <a
            href="/marketplace"
            className="text-sm font-medium text-zinc-600 hover:text-emerald-600 transition-colors"
          >
            Marketplace
          </a>
        </nav>
        <div className="flex items-center gap-3 ">
          <Button variant="ghost" className="text-sm">
            Log In
          </Button>
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-sm" onClick={login}>Register</Button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
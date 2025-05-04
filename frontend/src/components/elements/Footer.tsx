import React from 'react'
import logo from '@/assets/logo.svg'
function Footer() {
  return (
    <footer className="border-t border-zinc-200 container mx-auto text-zinc-400 py-5">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className='flex flex-col items-center justify-center'>
          <div className="flex items-center gap-2">
            <img src={logo} alt="Fundly" className="h-10 w-10 rounded-xl" />
            <span className="font-semibold text-xl text-emerald-900">Fundly</span>
          </div>

        </div>
        <div className="text-sm text-center">
          <p>© 2025 Fundly. All rights reserved.</p>
        </div>
      </div>
    </footer>)
}

export default Footer
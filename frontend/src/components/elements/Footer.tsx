import React from 'react'
import logo from '@/assets/logo.svg'
function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-400 py-10">
      <div className="container mx-auto px-4">
        <div className='flex flex-col items-center justify-center'>
          <div className="flex items-center gap-2 mb-4">
            <img src={logo} alt="Fundly" className="h-10 w-10 rounded-xl" />
            <span className="font-semibold text-xl text-white">Fundly</span>
          </div>
          <p className="text-sm mb-4">
            Connecting MSMEs with investors through tokenized revenue sharing opportunities.
          </p>
        </div>
        <div className="text-sm text-center">
          <p>© 2025 Fundly. All rights reserved.</p>
        </div>
      </div>
    </footer>)
}

export default Footer
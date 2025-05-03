import { Button } from '../ui/button'
import logo from '@/assets/logo.svg'
import { useAuth } from '@/utility/use-auth-client'
import { useNavigate } from 'react-router-dom'
import WalletMenu from './WalletMenu'
function Navbar() {
  // TODO wallet identity
  const navigate = useNavigate()

  const { principal, user, isAuthenticated } = useAuth()

  return (
    <header className={`border-b border-zinc-100 w-full z-50 bg-white fixed`}>
      <div className="container mx-auto py-4 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <img src={logo} alt="Fundly" className="h-10 w-10 rounded-xl" />
          <span className="font-semibold text-xl text-emerald-800">Fundly</span>
        </div>
        <nav className=" items-center gap-8 ">

          <a
            href="/marketplace"
            className="text-sm font-medium text-zinc-600 hover:text-emerald-600 transition-colors"
          >
            Marketplace
          </a>
        </nav>
        {isAuthenticated ? <WalletMenu /> : <div className="flex items-center gap-3 ">
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-sm rounded-[0.5rem]" onClick={() => navigate('/auth')}>Login</Button>
        </div>}
      </div>
    </header>
  )
}

export default Navbar
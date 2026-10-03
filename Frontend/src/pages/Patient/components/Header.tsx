import { Bell, UserCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { clearAuthSession } from "../../../features/auth/AuthService"
import { useEffect, useRef, useState } from "react"
import { toast, Toaster } from "sonner"

const Header = () => {

  const navigate = useNavigate();

  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const handleClickOutside = (event: MouseEvent) => {
      if(accountRef.current && !accountRef.current.contains(event.target as Node)){
        setIsAccountMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  },[])

  const handleLogout = () => {
    clearAuthSession();
    navigate('/signIn')
    toast.success('Signed out successfully')
  }

  return (
    <header className='flex items-center justify-end gap-5 border-b border-slate-100 bg-white px-6 py-4'>
      <button type='button' className='text-xl text-slate-500 transition hover:text-brand hover:cursor-pointer outline-none' aria-label='Notifications'>
        <Bell size={20} />
      </button>

      <div className="relative" ref={accountRef}>
        <button
          type='button'
          onClick={() => setIsAccountMenuOpen((prev) => !prev)}
          className='text-xl text-slate-500 transition hover:text-brand hover:cursor-pointer outline-none'
          aria-label='Account'
        >
          <UserCircle size={20} />
        </button>

        {isAccountMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-100 bg-white py-2 shadow-md">
            <button
              type="button"
              onClick={() => {
                setIsAccountMenuOpen(false)
                navigate('/patient/account')
              }}
              className="block w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 hover:cursor-pointer"
            >
              Account Settings
            </button>
            <button
              type="button"
              onClick={() => handleLogout()}
              className="block w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-slate-50 hover:cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>

    </header>
  )
}

export default Header
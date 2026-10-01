import { Bell, UserCircle } from "lucide-react"

const Header = () => {
  return (
    <header className='flex items-center justify-end gap-5 border-b border-slate-100 bg-white px-6 py-4'>
        <button type='button' className='text-xl text-slate-500 transition hover:text-brand hover:cursor-pointer' aria-label='Notifications'>
            <Bell size={20}/>
        </button>
        
        <button type='button' className='text-xl text-slate-500 transition hover:text-brand hover:cursor-pointer' aria-label='Notifications'>
            <UserCircle size={20}/>
        </button>
        
    </header>
  )
}

export default Header
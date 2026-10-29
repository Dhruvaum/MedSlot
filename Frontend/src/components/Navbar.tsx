import { Link } from 'react-router-dom'
import logo from '../assets/Logo.png'

const navLinks = [
  { label: 'How It Works', to: '/#how-it-works' },
  { label: 'Features', to: '/#features' },
  { label: 'For Doctors', to: '/for-doctors' },
  { label: 'Contact', to: '/contact' },
]

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-white/70 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6 lg:px-12">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="MedSlot logo" className="h-8 w-8" />
          <span className="text-lg font-bold text-slate-800">MedSlot</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-sm font-medium text-slate-600 transition hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/signIn"
            className="text-sm font-semibold text-slate-700 transition hover:text-brand"
          >
            Sign In
          </Link>
          <Link
            to="/signUp"
            className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar

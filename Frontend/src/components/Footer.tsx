import { Link } from 'react-router-dom'
import logo from '../assets/Logo.png'
import Container from './Container'

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <Container className="flex flex-col items-center justify-between gap-6 py-10 md:flex-row">
        <div className="flex items-center gap-2">
          <img src={logo} alt="MedSlot logo" className="h-6 w-6" />
          <span className="font-semibold text-slate-700">MedSlot</span>
        </div>

        <nav className="flex flex-wrap justify-center gap-6 text-sm text-slate-600">
          <Link to="/#how-it-works" className="transition hover:text-brand">
            How It Works
          </Link>
          <Link to="/#features" className="transition hover:text-brand">
            Features
          </Link>
          <Link to="/for-doctors" className="transition hover:text-brand">
            For Doctors
          </Link>
          <a href="mailto:contact@dhruvverse.com" className="transition hover:text-brand">
            Contact
          </a>
        </nav>

        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} MedSlot. All rights reserved.
        </p>
      </Container>
    </footer>
  )
}

export default Footer

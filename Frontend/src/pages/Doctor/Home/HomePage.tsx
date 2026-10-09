import { Link } from 'react-router-dom'
import { CalendarClock, User } from 'lucide-react'
import Page from '../../../components/Page'

const quickLinks = [
  { to: '/doctor/availability', label: 'Availability', icon: CalendarClock },
  { to: '/doctor/profile', label: 'Profile', icon: User },
]

const HomePage = () => {
  return (
    <Page title="Home - MedSlot">
      <div className="mx-auto w-4/5">
        <h1 className="text-2xl font-bold text-slate-800">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500">Here's a quick look at your MedSlot account.</p>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {quickLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.to}
                to={link.to}
                className="flex flex-col items-center gap-3 rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm transition hover:border-brand hover:shadow-md outline-none"
              >
                <Icon size={28} className="text-brand" />
                <span className="text-sm font-medium text-slate-700">{link.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </Page>
  )
}

export default HomePage

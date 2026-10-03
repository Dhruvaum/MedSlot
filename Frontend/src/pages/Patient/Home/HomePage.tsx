import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Stethoscope, CalendarCheck, Receipt, User } from 'lucide-react'
import Page from '../../../components/Page'
import { viewPatientProfile } from '../../../features/patient/patientService'

const quickLinks = [
  { to: '/patient/find-doctor', label: 'Find a Doctor', icon: Stethoscope },
  { to: '/patient/appointments', label: 'My Appointments', icon: CalendarCheck },
  { to: '/patient/transactions', label: 'Transactions', icon: Receipt },
  { to: '/patient/profile', label: 'Profile', icon: User },
]

const HomePage = () => {
  const [fullName, setFullName] = useState<string | null>(null)

  useEffect(() => {
    viewPatientProfile().then((profile) => setFullName(profile.fullName))
  }, [])

  return (
    <Page title="Home - MedSlot">
      <div className="mx-auto w-4/5">
        <h1 className="text-2xl font-bold text-slate-800">
          {fullName ? `Welcome back, ${fullName}` : 'Welcome back'}
        </h1>
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

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarClock, User, ShieldCheck, ShieldAlert } from 'lucide-react'
import Page from '../../../components/Page'
import { viewMyProfile } from '../../../features/doctor/doctorService'

const quickLinks = [
  { to: '/doctor/availability', label: 'Availability', icon: CalendarClock },
  { to: '/doctor/profile', label: 'Profile', icon: User },
]

const HomePage = () => {
  const [isVerified, setIsVerified] = useState<boolean | null>(null)

  useEffect(() => {
    viewMyProfile().then((response) => setIsVerified(response.verificationStatus === 1))
  }, [])

  return (
    <Page title="Home - MedSlot">
      <div className="mx-auto w-4/5">
        <h1 className="text-2xl font-bold text-slate-800">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500">Here's a quick look at your MedSlot account.</p>

        {isVerified === false && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            <ShieldAlert size={18} className="shrink-0" />
            <span>
              Your account is <strong>pending verification</strong>. You can configure your profile and availability
              now, but patients won't be able to find or book you until an admin approves your account.
            </span>
          </div>
        )}

        {isVerified === true && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-brand/20 bg-brand/5 px-4 py-3 text-sm text-slate-700">
            <ShieldCheck size={18} className="shrink-0 text-brand" />
            <span>Your account is verified — patients can find and book you.</span>
          </div>
        )}

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

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarClock, User, ShieldCheck, ShieldAlert, Users } from 'lucide-react'
import Page from '../../../components/Page'
import { Skeleton } from '../../../components/ui/skeleton'
import { viewMyProfile, getDoctorAppointments } from '../../../features/doctor/doctorService'
import type { DoctorAppointmentSummary } from '../../../features/doctor/types'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../components/ui/tooltip'
import { parseUtcDate } from '../../../utils/date'

const quickLinks = [
  { to: '/doctor/availability', label: 'Availability', icon: CalendarClock },
  { to: '/doctor/profile', label: 'Profile', icon: User },
]

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

const todayDateString = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const formatTime = (iso: string) =>
  parseUtcDate(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })

const HomePage = () => {
  const [isVerified, setIsVerified] = useState<boolean | null>(null)
  const [todaysAppointments, setTodaysAppointments] = useState<DoctorAppointmentSummary[]>([])
  const [isLoadingToday, setIsLoadingToday] = useState(true)

  useEffect(() => {
    viewMyProfile().then((response) => setIsVerified(response.verificationStatus === 1))
    getDoctorAppointments({ date: todayDateString(), status: null, pageNumber: 1, pageSize: 50 })
      .then((response) => setTodaysAppointments(response.items))
      .finally(() => setIsLoadingToday(false))
  }, [])

  const nextAppointment = todaysAppointments
    .filter((a) => a.status === 'Confirmed' && parseUtcDate(a.startTime) > new Date())
    .sort((a, b) => parseUtcDate(a.startTime).getTime() - parseUtcDate(b.startTime).getTime())[0]

  return (
    <Page title="Home - MedSlot">
      <div className="mx-auto w-4/5">
        <h1 className="text-2xl font-bold text-slate-800">{getGreeting()}</h1>
        <p className="mt-1 text-sm text-slate-500">Here's a quick look at your MedSlot account.</p>

        {isVerified === false && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            <ShieldAlert size={18} className="shrink-0" />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-help underline decoration-dotted underline-offset-2">
                    Your account is <strong>pending verification</strong>.
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  You can configure your profile and availability now, but patients won't be able to find or book
                  you until MedSlot's Support Staff approves your account.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
                className="flex flex-col items-center gap-3 rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md outline-none"
              >
                <Icon size={28} className="text-brand" />
                <span className="text-sm font-medium text-slate-700">{link.label}</span>
              </Link>
            )
          })}
        </div>

        {isLoadingToday ? (
          <Skeleton className="mt-6 h-28 w-full rounded-2xl" />
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl bg-linear-to-br from-brand to-teal-800 p-5 text-white shadow-sm">
            <div className="flex items-center gap-2 text-xs font-medium text-white/70">
              <Users size={14} />
              Today
            </div>
            <h2 className="mt-1 text-lg font-semibold">
              {todaysAppointments.length === 0
                ? 'No appointments today'
                : `${todaysAppointments.length} appointment${todaysAppointments.length === 1 ? '' : 's'} today`}
            </h2>
            {nextAppointment && (
              <div className="mt-3 flex items-center gap-2 text-sm text-white/90">
                <CalendarClock size={16} className="shrink-0" />
                Next: {nextAppointment.patientName} at {formatTime(nextAppointment.startTime)}
              </div>
            )}
          </div>
        )}
      </div>
    </Page>
  )
}

export default HomePage

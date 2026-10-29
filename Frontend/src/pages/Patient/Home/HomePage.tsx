import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Stethoscope, CalendarCheck, Receipt, User, CalendarClock, MapPin } from 'lucide-react'
import Page from '../../../components/Page'
import { Skeleton } from '../../../components/ui/skeleton'
import { viewPatientProfile } from '../../../features/patient/patientService'
import { getMyAppointments } from '../../../features/appointment/appointmentService'
import type { AppointmentSummary } from '../../../features/appointment/types'
import { parseUtcDate } from '../../../utils/date'

const quickLinks = [
  { to: '/patient/book-doctor', label: 'Book a Doctor', icon: Stethoscope },
  { to: '/patient/appointments', label: 'My Appointments', icon: CalendarCheck },
  { to: '/patient/transactions', label: 'Transactions', icon: Receipt },
  { to: '/patient/profile', label: 'Profile', icon: User },
]

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

const formatDateTime = (iso: string) =>
  parseUtcDate(iso).toLocaleString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })

const HomePage = () => {
  const [fullName, setFullName] = useState<string | null>(null)
  const [appointments, setAppointments] = useState<AppointmentSummary[]>([])
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true)

  useEffect(() => {
    viewPatientProfile().then((profile) => setFullName(profile.fullName))
    getMyAppointments()
      .then((response) => setAppointments(response.appointments))
      .finally(() => setIsLoadingAppointments(false))
  }, [])

  const nextAppointment = appointments
    .filter((a) => a.status === 'Confirmed' && parseUtcDate(a.startTime) > new Date())
    .sort((a, b) => parseUtcDate(a.startTime).getTime() - parseUtcDate(b.startTime).getTime())[0]

  return (
    <Page title="Home - MedSlot">
      <div className="mx-auto w-4/5">
        <h1 className="text-2xl font-bold text-slate-800">
          {getGreeting()}{fullName ? `, ${fullName}` : ''}
        </h1>
        <p className="mt-1 text-sm text-slate-500">Here's a quick look at your MedSlot account.</p>


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
        
        {isLoadingAppointments ? (
          <Skeleton className="mt-6 h-28 w-full rounded-2xl" />
        ) : nextAppointment ? (
          <div className="mt-6 overflow-hidden rounded-2xl bg-linear-to-br from-brand to-teal-800 p-5 text-white shadow-sm">
            <p className="text-xs font-medium text-white/70">Next Appointment</p>
            <h2 className="mt-1 text-lg font-semibold">{nextAppointment.doctorName}</h2>
            {nextAppointment.specializationName && (
              <p className="text-sm text-white/80">{nextAppointment.specializationName}</p>
            )}
            <div className="mt-3 flex items-center gap-2 text-sm text-white/90">
              <CalendarClock size={16} className="shrink-0" />
              {formatDateTime(nextAppointment.startTime)}
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm text-white/90">
              <MapPin size={16} className="shrink-0" />
              {nextAppointment.workAddress}
            </div>
          </div>
        ) : (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white p-5 text-sm text-slate-500">
            <CalendarClock size={20} className="shrink-0 text-slate-300" />
            No upcoming appointments —{' '}
            <Link to="/patient/book-doctor" className="font-medium text-brand hover:underline">
              book one now
            </Link>
            .
          </div>
        )}
      </div>
    </Page>
  )
}

export default HomePage

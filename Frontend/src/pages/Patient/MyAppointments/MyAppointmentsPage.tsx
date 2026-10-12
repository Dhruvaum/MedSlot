import { Link } from 'react-router-dom'
import { Stethoscope, CalendarClock, MessageSquare } from 'lucide-react'
import Page from '../../../components/Page'
import { useMyAppointments } from './useMyAppointments'

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })

const statusStyles: Record<string, string> = {
  Confirmed: 'bg-brand/10 text-brand',
  Completed: 'bg-slate-100 text-slate-600',
  Cancelled: 'bg-red-50 text-red-600',
  NoShow: 'bg-amber-50 text-amber-600',
}

const MyAppointmentsPage = () => {
  const { appointments, isLoading } = useMyAppointments()

  return (
    <Page title="My Appointments - MedSlot">
      <div className="mx-auto w-4/5">
        <h1 className="text-2xl font-bold text-slate-800">My Appointments</h1>
        <p className="mt-1 text-sm text-slate-500">Track your upcoming and past appointments.</p>

        <div className="mt-8">
          {isLoading ? (
            <div className="py-20 text-center text-sm text-slate-400">Loading appointments...</div>
          ) : appointments.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <CalendarClock size={32} className="text-slate-300" />
              <p className="text-sm text-slate-400">You haven't booked any appointments yet.</p>
              <Link
                to="/patient/find-doctor"
                className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white transition hover:opacity-90"
              >
                Find a Doctor
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand/10">
                      <Stethoscope size={22} className="text-brand" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-slate-800">{appointment.doctorName}</h2>
                      {appointment.specializationName && (
                        <span className="text-xs font-medium text-brand">{appointment.specializationName}</span>
                      )}
                      <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                        <CalendarClock size={14} className="shrink-0" />
                        {formatDateTime(appointment.startTime)}
                      </div>
                      {appointment.concern && (
                        <div className="mt-1 flex items-start gap-2 text-sm text-slate-500">
                          <MessageSquare size={14} className="mt-0.5 shrink-0" />
                          <span className="line-clamp-2">{appointment.concern}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${statusStyles[appointment.status] ?? 'bg-slate-100 text-slate-600'}`}
                  >
                    {appointment.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Page>
  )
}

export default MyAppointmentsPage

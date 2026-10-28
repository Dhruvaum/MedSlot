import { Link } from 'react-router-dom'
import { User, MessageSquare, Clock, CheckCircle2, CalendarClock, XCircle } from 'lucide-react'
import Page from '../../../components/Page'
import ConfirmDialog from '../../../components/ConfirmDialog'
import CollapsibleSection from '../../../components/CollapsibleSection'
import ListCardSkeleton from '../../../components/ListCardSkeleton'
import { useMyAppointments } from './useMyAppointments'
import { parseUtcDate } from '../../../utils/date'

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })

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
  PendingPayment: 'bg-blue-50 text-blue-600',
  PaymentFailed: 'bg-orange-50 text-orange-600',
}

const statusBarStyles: Record<string, string> = {
  Confirmed: 'bg-brand',
  Completed: 'bg-slate-400',
  Cancelled: 'bg-red-400',
  NoShow: 'bg-amber-400',
  PendingPayment: 'bg-blue-400',
  PaymentFailed: 'bg-orange-400',
}

const CONFIRMED_STATUSES = new Set(['Confirmed', 'Completed', 'NoShow'])

const canResumePayment = (appointment: { status: string; holdExpiresAt: string | null }) =>
  appointment.status === 'PendingPayment' &&
  !!appointment.holdExpiresAt &&
  parseUtcDate(appointment.holdExpiresAt) > new Date()

const MyAppointmentsPage = () => {
  const {
    appointments,
    isLoading,
    resumingId,
    handleResumePayment,
    cancellingId,
    cancelTargetId,
    cancelCase,
    cancelRefundType,
    handleCancelClick,
    closeCancelDialog,
    handleConfirmCancel,
  } = useMyAppointments()

  const cancelDialogDescription =
    cancelCase !== 'InitiateRefundAndCancel'
      ? 'This appointment will be cancelled and the slot will be released.'
      : cancelRefundType === 'FullRefund'
      ? 'You will receive a full refund since this is more than 2 hours before the appointment.'
      : 'A Rs 50 late-cancellation penalty will apply since this is within 2 hours of the appointment.'

  return (
    <Page title="My Appointments - MedSlot">
      <div className="mx-auto w-4/5">
        <h1 className="text-2xl font-bold text-slate-800">My Appointments</h1>
        <p className="mt-1 text-sm text-slate-500">Track your upcoming and past appointments.</p>

        <div className="mt-8">
          {isLoading ? (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <ListCardSkeleton key={i} />
              ))}
            </div>
          ) : appointments.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <CalendarClock size={32} className="text-slate-300" />
              <p className="text-sm text-slate-400">You haven't booked any appointments yet.</p>
              <Link
                to="/patient/book-doctor"
                className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white transition hover:opacity-90"
              >
                Book a Doctor
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 pl-7 shadow-sm"
                >
                  <div
                    className={`absolute inset-y-0 left-0 w-1.5 ${
                      statusBarStyles[appointment.status] ?? 'bg-slate-200'
                    }`}
                  />

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/10">
                        <User size={20} className="text-brand" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-slate-800">{appointment.doctorName}</h2>
                        {appointment.specializationName && (
                          <div className="text-xs font-medium text-brand">{appointment.specializationName}</div>
                        )}
                        <span
                          className={`mt-1 inline-block w-fit rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            statusStyles[appointment.status] ?? 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <div className="text-base font-bold text-slate-800">{formatDate(appointment.startTime)}</div>
                      <div className="text-sm text-slate-500">
                        {formatTime(appointment.startTime)} – {formatTime(appointment.endTime)}
                      </div>
                    </div>
                  </div>

                  <CollapsibleSection>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Visit</p>
                        <div className="flex items-start gap-2 text-sm text-slate-500">
                          <MessageSquare size={15} className="mt-0.5 shrink-0 text-slate-400" />
                          <span className="line-clamp-2">{appointment.concern || 'No concern specified'}</span>
                        </div>
                      </div>

                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Booking</p>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Clock size={15} className="shrink-0 text-slate-400" />
                          Requested {formatDateTime(appointment.createdAt)}
                        </div>
                        {CONFIRMED_STATUSES.has(appointment.status) && (
                          <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                            <CheckCircle2 size={15} className="shrink-0 text-slate-400" />
                            Confirmed {formatDateTime(appointment.bookedAt)}
                          </div>
                        )}
                      </div>
                    </div>
                  </CollapsibleSection>

                  {(canResumePayment(appointment) || appointment.cancellable) && (
                    <div className="mt-5 flex gap-3 border-t border-slate-100 pt-4">
                      {canResumePayment(appointment) && (
                        <button
                          type="button"
                          disabled={resumingId === appointment.id}
                          onClick={() => handleResumePayment(appointment.id, appointment.holdExpiresAt)}
                          className="flex-1 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                        >
                          {resumingId === appointment.id ? 'Opening checkout...' : 'Resume Payment'}
                        </button>
                      )}
                      {appointment.cancellable && (
                        <button
                          type="button"
                          onClick={() => handleCancelClick(appointment.id)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50 cursor-pointer"
                        >
                          <XCircle size={16} />
                          Cancel Appointment
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!cancelTargetId}
        title="Cancel this appointment?"
        description={cancelDialogDescription}
        confirmLabel="Yes, Cancel"
        isConfirming={!!cancellingId}
        onConfirm={handleConfirmCancel}
        onCancel={closeCancelDialog}
      />
    </Page>
  )
}

export default MyAppointmentsPage

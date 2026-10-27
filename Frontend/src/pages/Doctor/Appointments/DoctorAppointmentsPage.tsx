import { User, MessageSquare, CalendarClock, ChevronLeft, ChevronRight, CheckCircle2, XCircle } from 'lucide-react'
import Page from '../../../components/Page'
import ConfirmDialog from '../../../components/ConfirmDialog'
import { useDoctorAppointments } from './useDoctorAppointments'
import { parseUtcDate } from '../../../utils/date'

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })

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

const canMarkOutcome = (appointment: { status: string; endTime: string }) =>
  appointment.status === 'Confirmed' && parseUtcDate(appointment.endTime) <= new Date()

const DoctorAppointmentsPage = () => {
  const {
    appointments,
    totalPages,
    pageNumber,
    setPageNumber,
    isLoading,
    date,
    handleDateChange,
    statusOptions,
    status,
    handleStatusChange,
    clearFilters,
    updatingId,
    outcomeTarget,
    handleOutcomeClick,
    closeOutcomeDialog,
    handleConfirmOutcome,
  } = useDoctorAppointments()

  return (
    <Page title="Appointments - MedSlot">
      <div className="mx-auto w-4/5">
        <h1 className="text-2xl font-bold text-slate-800">Appointments</h1>
        <p className="mt-1 text-sm text-slate-500">Your patient appointments, upcoming and past.</p>

        <div className="mt-6 flex flex-wrap items-end gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Date</label>
            <input
              type="date"
              value={date ?? ''}
              onChange={(e) => handleDateChange(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-brand"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Status</label>
            <select
              value={status ?? ''}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-brand"
            >
              <option value="">All</option>
              {statusOptions.map((option) => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>
          </div>

          {(date || status) && (
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:text-brand hover:cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="mt-6">
          {isLoading ? (
            <div className="py-20 text-center text-sm text-slate-400">Loading appointments...</div>
          ) : appointments.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <CalendarClock size={32} className="text-slate-300" />
              <p className="text-sm text-slate-400">
                {date || status ? 'No appointments match these filters.' : "You don't have any appointments yet."}
              </p>
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
                        <h2 className="font-semibold text-slate-800">{appointment.patientName}</h2>
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

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <div className="flex items-start gap-2 text-sm text-slate-500">
                      <MessageSquare size={15} className="mt-0.5 shrink-0 text-slate-400" />
                      <span className="line-clamp-2">{appointment.concern || 'No concern specified'}</span>
                    </div>
                  </div>

                  {canMarkOutcome(appointment) && (
                    <div className="mt-5 flex gap-3 border-t border-slate-100 pt-4">
                      <button
                        type="button"
                        disabled={updatingId === appointment.id}
                        onClick={() => handleOutcomeClick(appointment.id, 'Completed')}
                        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                      >
                        <CheckCircle2 size={16} />
                        Mark Completed
                      </button>
                      <button
                        type="button"
                        disabled={updatingId === appointment.id}
                        onClick={() => handleOutcomeClick(appointment.id, 'NoShow')}
                        className="flex flex-1 items-center justify-center gap-2 rounded-full border border-amber-200 px-5 py-2.5 text-sm font-semibold text-amber-600 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                      >
                        <XCircle size={16} />
                        Mark No-Show
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {!isLoading && appointments.length > 0 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                type="button"
                disabled={pageNumber === 1}
                onClick={() => setPageNumber((prev) => prev - 1)}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer disabled:hover:border-slate-200 disabled:hover:text-slate-600"
              >
                <ChevronLeft size={16} />
                Prev
              </button>
              <span className="text-sm text-slate-500">
                Page {pageNumber} of {totalPages}
              </span>
              <button
                type="button"
                disabled={pageNumber === totalPages}
                onClick={() => setPageNumber((prev) => prev + 1)}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer disabled:hover:border-slate-200 disabled:hover:text-slate-600"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!outcomeTarget}
        title={outcomeTarget?.outcome === 'Completed' ? 'Mark this appointment as completed?' : 'Mark this patient as a no-show?'}
        description={
          outcomeTarget?.outcome === 'Completed'
            ? 'This confirms the consultation took place.'
            : 'This confirms the patient did not show up for this appointment.'
        }
        confirmLabel="Confirm"
        isConfirming={!!updatingId}
        onConfirm={handleConfirmOutcome}
        onCancel={closeOutcomeDialog}
      />
    </Page>
  )
}

export default DoctorAppointmentsPage

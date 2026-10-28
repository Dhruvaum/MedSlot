import { CalendarDays, CalendarX2, Clock, MessageSquare, Stethoscope } from 'lucide-react'
import { Calendar } from '../../../../components/ui/calendar'
import type { AvailableSlot } from '../../../../features/appointment/types'

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })

interface BookingPanelProps {
  isBookingActive: boolean
  doctorName?: string
  isLoadingSlots: boolean
  availableDates: Date[]
  selectedDate: Date | undefined
  onSelectDate: (date: Date | undefined) => void
  slotsForSelectedDate: AvailableSlot[]
  selectedSlotId: string | null
  onSelectSlot: (slotId: string) => void
  patientConcern: string
  onPatientConcernChange: (value: string) => void
  isBooking: boolean
  onConfirmBooking: () => void
}

const DoctorBanner = ({ doctorName }: { doctorName?: string }) =>
  doctorName ? (
    <div className="relative overflow-hidden bg-linear-to-br from-brand to-teal-800 px-5 py-5">
      {/* <div className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-white/10 blur-xl" /> */}
      <div className="pointer-events-none absolute -bottom-10 -left-4 h-20 w-20 rounded-full bg-white/10 blur-xl" />

      <div className="relative flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30">
          <Stethoscope size={20} className="text-white" />
        </div>
        <div>
          <p className="text-xs font-medium text-white/70">Booking with</p>
          <h3 className="text-sm font-semibold text-white">{doctorName}</h3>
        </div>
      </div>
    </div>
  ) : null

const BookingPanel = ({
  isBookingActive,
  doctorName,
  isLoadingSlots,
  availableDates,
  selectedDate,
  onSelectDate,
  slotsForSelectedDate,
  selectedSlotId,
  onSelectSlot,
  patientConcern,
  onPatientConcernChange,
  isBooking,
  onConfirmBooking,
}: BookingPanelProps) => {
  if (!isBookingActive) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center">
        <CalendarDays size={32} className="text-slate-300" />
        <p className="text-sm text-slate-400">
          Click <span className="font-medium text-slate-500">Book Now</span> on a doctor to start booking an appointment.
        </p>
      </div>
    )
  }

  if (!isLoadingSlots && availableDates.length === 0) {
    return (
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
        <DoctorBanner doctorName={doctorName} />

        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-5 text-center">
          <CalendarX2 size={32} className="text-slate-300" />
          <p className="text-sm text-slate-400">No upcoming availability for this doctor.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
      <DoctorBanner doctorName={doctorName} />

      <div className="flex flex-1 flex-col gap-5 p-5">
        <div className="rounded-xl border border-slate-100 p-4">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
            <CalendarDays size={16} className="text-brand" />
            Select a Date
          </h2>

          {isLoadingSlots ? (
            <div className="py-10 text-center text-sm text-slate-400">Loading availability...</div>
          ) : (
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onSelectDate}
              disabled={(date) => !availableDates.some((d) => d.toDateString() === date.toDateString())}
              className="rounded-xl border border-slate-100 p-2"
            />
          )}

          {selectedDate && (
            <div className="mt-4 border-t border-slate-100 pt-4">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                <Clock size={16} className="text-brand" />
                Available Slots
              </h3>
              {slotsForSelectedDate.length === 0 ? (
                <p className="text-sm text-slate-400">No slots left on this day.</p>
              ) : (
                <div className="scrollbar-thin grid max-h-64 grid-cols-3 gap-2 overflow-y-auto pr-1">
                  {slotsForSelectedDate.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => onSelectSlot(slot.id)}
                      className={`rounded-lg border px-2 py-2 text-xs font-medium transition hover:cursor-pointer ${
                        selectedSlotId === slot.id
                          ? 'border-brand bg-brand text-white'
                          : 'border-slate-200 text-slate-600 hover:border-brand hover:text-brand'
                      }`}
                    >
                      {formatTime(slot.startTime)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-100 p-4">
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
            <MessageSquare size={16} className="text-brand" />
            Patient Concern
          </label>
          <textarea
            value={patientConcern}
            onChange={(e) => onPatientConcernChange(e.target.value)}
            placeholder="Briefly describe your symptoms or reason for the visit..."
            rows={4}
            className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-brand"
          />
        </div>

        <button
          type="button"
          onClick={onConfirmBooking}
          disabled={!selectedSlotId || isBooking}
          className="mt-auto w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          {isBooking ? 'Booking...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  )
}

export default BookingPanel

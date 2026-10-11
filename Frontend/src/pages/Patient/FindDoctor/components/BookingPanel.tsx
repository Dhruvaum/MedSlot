import { CalendarDays, Clock, MessageSquare } from 'lucide-react'
import { Calendar } from '../../../../components/ui/calendar'
import type { AvailableSlot } from '../../../../features/appointment/types'

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })

interface BookingPanelProps {
  isBookingActive: boolean
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

const BookingPanel = ({
  isBookingActive,
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
      <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center">
        <CalendarDays size={32} className="text-slate-300" />
        <p className="text-sm text-slate-400">
          Click <span className="font-medium text-slate-500">Book Now</span> on a doctor to start booking an appointment.
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-5 rounded-2xl border border-brand/20 bg-white p-5 shadow-sm">
      <div>
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <CalendarDays size={16} className="text-brand" />
          Select a Date
        </h2>
      </div>

      {isLoadingSlots ? (
        <div className="py-10 text-center text-sm text-slate-400">Loading availability...</div>
      ) : availableDates.length === 0 ? (
        <div className="py-10 text-center text-sm text-slate-400">No upcoming availability for this doctor.</div>
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
        <div>
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
            <Clock size={16} className="text-brand" />
            Available Slots
          </h3>
          {slotsForSelectedDate.length === 0 ? (
            <p className="text-sm text-slate-400">No slots left on this day.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
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

      <div>
        <label className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
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
        className="mt-auto w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isBooking ? 'Booking...' : 'Confirm Booking'}
      </button>
    </div>
  )
}

export default BookingPanel

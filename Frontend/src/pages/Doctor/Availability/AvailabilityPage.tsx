import { Clock, Coffee, Copy } from 'lucide-react'
import Page from '../../../components/Page'
import { DAY_LABELS } from '../../../types/common'
import { DAY_ORDER, useAvailability } from './useAvailability'

const AvailabilityPage = () => {
  const {
    days,
    consultDurationMinutes,
    setConsultDurationMinutes,
    consultationFee,
    setConsultationFee,
    isNewSetup,
    isLoading,
    isSaving,
    updateDay,
    toggleBreak,
    applyToAllDays,
    handleSave,
    emptyDay,
  } = useAvailability()

  if (isLoading) {
    return (
      <Page title="My Availability - MedSlot">
        <div className="py-20 text-center text-sm text-slate-400">Loading...</div>
      </Page>
    )
  }

  return (
    <Page title="My Availability - MedSlot">
      <div className="mx-auto w-4/5 max-w-3xl">
        <h1 className="text-2xl font-bold text-slate-800">My Availability</h1>
        <p className="mt-1 text-sm text-slate-500">
          Set your weekly working hours so patients can see when you're free to book.
        </p>

        {isNewSetup && (
          <div className="mt-6 rounded-xl border border-brand/20 bg-brand/5 px-4 py-3 text-sm text-slate-700">
            You haven't set up your schedule yet — fill this in to start accepting bookings.
          </div>
        )}

        <div className="mt-8 flex flex-col gap-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:flex-row sm:gap-10">
          <div>
            <label className="text-sm font-medium text-slate-700">Consultation Duration</label>
            <p className="mt-1 text-xs text-slate-400">How long each appointment slot should be.</p>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                min={5}
                step={5}
                value={consultDurationMinutes}
                onChange={(e) => setConsultDurationMinutes(e.target.value ? Number(e.target.value) : '')}
                className="w-28 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-brand"
                placeholder="20"
              />
              <span className="text-sm text-slate-500">minutes</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Consultation Fee</label>
            <p className="mt-1 text-xs text-slate-400">What patients pay per appointment.</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-slate-500">₹</span>
              <input
                type="number"
                min={0}
                step={1}
                value={consultationFee}
                onChange={(e) => setConsultationFee(e.target.value ? Number(e.target.value) : '')}
                className="w-28 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-brand"
                placeholder="500"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {DAY_ORDER.map((dayOfWeek) => {
            const day = days.find((d) => d.dayOfWeek === dayOfWeek) ?? emptyDay(dayOfWeek)
            const hasBreak = !!day.breakStartTime && !!day.breakEndTime

            return (
              <div
                key={dayOfWeek}
                className={`rounded-2xl border bg-white p-5 shadow-sm transition ${day.isOff ? 'border-slate-100' : 'border-brand/20'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">{DAY_LABELS[dayOfWeek]}</span>
                  <label className="flex items-center gap-2 text-sm text-slate-500">
                    <input
                      type="checkbox"
                      checked={!day.isOff}
                      onChange={(e) => updateDay(dayOfWeek, { isOff: !e.target.checked })}
                      className="h-4 w-4 accent-brand"
                    />
                    Available
                  </label>
                </div>

                {!day.isOff && (
                  <div className="mt-4 flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-slate-400" />
                        <input
                          type="time"
                          value={day.startTime ?? ''}
                          onChange={(e) => updateDay(dayOfWeek, { startTime: e.target.value })}
                          className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-800 outline-none focus:border-brand"
                        />
                        <span className="text-sm text-slate-400">to</span>
                        <input
                          type="time"
                          value={day.endTime ?? ''}
                          onChange={(e) => updateDay(dayOfWeek, { endTime: e.target.value })}
                          className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-800 outline-none focus:border-brand"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => applyToAllDays(day)}
                        className="flex items-center gap-1 text-xs font-medium text-brand hover:underline"
                      >
                        <Copy size={14} />
                        Apply to all days
                      </button>
                    </div>

                    <label className="flex w-fit items-center gap-2 text-sm text-slate-500">
                      <input
                        type="checkbox"
                        checked={hasBreak}
                        onChange={(e) => toggleBreak(dayOfWeek, e.target.checked)}
                        className="h-4 w-4 accent-brand"
                      />
                      <Coffee size={14} />
                      Add a break
                    </label>

                    {hasBreak && (
                      <div className="flex items-center gap-2 pl-6">
                        <input
                          type="time"
                          value={day.breakStartTime ?? ''}
                          onChange={(e) => updateDay(dayOfWeek, { breakStartTime: e.target.value })}
                          className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-800 outline-none focus:border-brand"
                        />
                        <span className="text-sm text-slate-400">to</span>
                        <input
                          type="time"
                          value={day.breakEndTime ?? ''}
                          onChange={(e) => updateDay(dayOfWeek, { breakEndTime: e.target.value })}
                          className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-800 outline-none focus:border-brand"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="mt-8 w-full rounded-full bg-brand px-6 py-3 font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          {isSaving ? 'Saving...' : 'Save Availability'}
        </button>
      </div>
    </Page>
  )
}

export default AvailabilityPage

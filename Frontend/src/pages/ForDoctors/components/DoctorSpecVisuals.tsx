import {
  Check,
  ShieldCheck,
  Coffee,
  CalendarDays,
  ArrowDown,
  IndianRupee,
  UserX,
  CheckCircle2,
  XCircle,
  User,
} from 'lucide-react'

const card = 'rounded-2xl bg-white shadow-lg ring-1 ring-slate-900/5'

export const VerificationStepsVisual = () => {
  const steps = [
    { label: 'Profile submitted', detail: 'Registration number & council' },
    { label: 'Reviewed by MedSlot Support', detail: 'Manual verification' },
    { label: 'Live in patient search', detail: 'Patients can now book you' },
  ]

  return (
    <div className={`${card} p-5`}>
      <div className="flex flex-col">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1
          return (
            <div key={step.label} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                    isLast ? 'bg-brand text-white ring-4 ring-brand/20' : 'bg-brand/15 text-brand'
                  }`}
                >
                  {isLast ? <ShieldCheck size={14} /> : <Check size={14} />}
                </div>
                {!isLast && <div className="my-1 w-px flex-1 bg-brand/30" />}
              </div>
              <div className={isLast ? '' : 'pb-5'}>
                <p className="text-sm font-semibold text-slate-800">{step.label}</p>
                <p className="text-xs text-slate-500">{step.detail}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const WeeklyScheduleVisual = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div className={`${card} p-5`}>
      <div className="mb-3 flex items-center justify-between text-[11px] text-slate-400">
        <span>8 AM</span>
        <span className="flex items-center gap-1">
          <Coffee size={11} /> Break 1–2 PM
        </span>
        <span>8 PM</span>
      </div>

      <div className="flex flex-col gap-2">
        {days.map((day) => {
          const isOff = day === 'Sun'
          return (
            <div key={day} className="flex items-center gap-3">
              <span className={`w-8 text-xs font-medium ${isOff ? 'text-slate-300' : 'text-slate-600'}`}>{day}</span>
              <div className="relative h-2.5 flex-1 rounded-full bg-slate-100">
                {isOff ? (
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-slate-400">
                    Off
                  </span>
                ) : (
                  <>
                    <div className="absolute inset-y-0 left-[16.6%] w-[25%] rounded-full bg-brand" />
                    <div className="absolute inset-y-0 left-[50%] w-[33.3%] rounded-full bg-brand" />
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
        <span>20 min consultations</span>
        <span className="flex items-center font-semibold text-brand">
          <IndianRupee size={11} />800
        </span>
      </div>
    </div>
  )
}

export const SlotGenerationVisual = () => {
  const slots = ['10:00', '10:20', '10:40', '11:00', '11:20', '11:40']

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`${card} flex w-full items-center gap-3 p-4`}>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10">
          <CalendarDays size={18} className="text-brand" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-800">Your weekly template</p>
          <p className="text-[11px] text-slate-500">Mon–Sat · 10 AM–6 PM · 20 min</p>
        </div>
      </div>

      <ArrowDown size={18} className="text-brand motion-safe:animate-bounce" />

      <div className={`${card} w-full p-4`}>
        <p className="mb-2 text-[11px] font-medium text-slate-400">Generated automatically, every night</p>
        <div className="grid grid-cols-3 gap-2">
          {slots.map((slot, index) => (
            <div
              key={slot}
              style={{ animationDelay: `${index * 0.4}s` }}
              className="rounded-lg border border-brand/30 bg-brand/5 py-1.5 text-center text-xs font-medium text-brand motion-safe:animate-float"
            >
              {slot}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const PrepaidVisual = () => (
  <div className="flex flex-col gap-3">
    <div className={`${card} p-4`}>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10">
          <User size={16} className="text-brand" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-800">Rohan Mehta</p>
          <p className="text-xs text-slate-500">Today · 4:00 PM</p>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
          <IndianRupee size={11} />800 paid
        </span>
      </div>
    </div>

    <div className={`${card} flex items-center gap-3 p-4 motion-safe:animate-float`}>
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50">
        <UserX size={16} className="text-amber-600" />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-800">Patient didn't show up?</p>
        <p className="text-[11px] text-slate-500">The prepaid amount isn't refunded.</p>
      </div>
    </div>
  </div>
)

export const OutcomeVisual = () => (
  <div className="relative">
    <div className={`${card} p-5`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800">Rohan Mehta</p>
          <span className="mt-1 inline-block rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-medium text-brand">
            Confirmed
          </span>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-slate-800">Mon, Nov 2</p>
          <p className="text-xs text-slate-500">4:00 – 4:20 PM</p>
        </div>
      </div>

      <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
        <div className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-brand py-2 text-xs font-semibold text-white ring-4 ring-brand/20">
          <CheckCircle2 size={14} /> Mark Completed
        </div>
        <div className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-amber-200 py-2 text-xs font-semibold text-amber-600">
          <XCircle size={14} /> Mark No-Show
        </div>
      </div>
    </div>

    <div className="absolute -bottom-5 -right-3 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-emerald-600 shadow-md ring-1 ring-slate-900/5 motion-safe:animate-float">
      <CheckCircle2 size={14} /> Marked as completed
    </div>
  </div>
)

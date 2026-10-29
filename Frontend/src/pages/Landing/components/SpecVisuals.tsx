import {
  Lock,
  CheckCircle2,
  XCircle,
  Timer,
  ShieldCheck,
  IndianRupee,
  Undo2,
  Stethoscope,
  Clock,
  SlidersHorizontal,
  Receipt,
  Hash,
} from 'lucide-react'

const card = 'rounded-2xl bg-white shadow-lg ring-1 ring-slate-900/5'
const floatingPill = 'absolute flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium shadow-md ring-1 ring-slate-900/5'

export const SlotLockVisual = () => {
  const slots = ['10:00', '10:20', '10:40', '11:00', '11:20', '11:40']

  return (
    <div className="relative">
      <div className={`${card} p-4`}>
        <p className="mb-3 text-xs font-semibold text-slate-500">Available slots · Mon, Nov 2</p>
        <div className="grid grid-cols-3 gap-2">
          {slots.map((slot) => {
            const isHeld = slot === '10:40'
            return (
              <div
                key={slot}
                className={`flex items-center justify-center gap-1 rounded-lg border py-2 text-xs font-medium ${
                  isHeld ? 'border-brand bg-brand text-white' : 'border-slate-200 text-slate-600'
                }`}
              >
                {isHeld && <Lock size={11} />}
                {slot}
              </div>
            )
          })}
        </div>
      </div>

      <div className={`${floatingPill} -right-3 -top-5 text-emerald-600 motion-safe:animate-float`}>
        <CheckCircle2 size={14} /> Booked for you
      </div>
      <div className={`${floatingPill} -bottom-5 -left-3 text-rose-500 motion-safe:animate-float [animation-delay:3s]`}>
        <XCircle size={14} /> Slot just taken
      </div>
    </div>
  )
}

export const HoldTimerVisual = () => (
  <div className={`${card} p-6`}>
    <div className="flex items-center gap-5">
      <div className="relative h-24 w-24 shrink-0">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r="42" fill="none" strokeWidth="8" className="stroke-slate-100" />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="264"
            className="stroke-brand motion-safe:animate-countdown"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Timer size={16} className="text-brand" />
          <span className="text-sm font-bold text-slate-800">9:42</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-800">Slot held for you</p>
        <p className="mt-1 text-xs text-slate-500">
          Finish payment before the hold ends — otherwise it's released for the next patient.
        </p>
      </div>
    </div>
    <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-xs">
      <span className="text-slate-500">Dr. Ananya Sharma · 10:40 AM</span>
      <span className="flex items-center font-semibold text-brand">
        <IndianRupee size={12} />800
      </span>
    </div>
  </div>
)

export const SignatureVisual = () => (
  <div className={`${card} p-5`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-slate-400">Payment</p>
        <p className="flex items-center text-xl font-bold text-slate-800">
          <IndianRupee size={18} />800
        </p>
      </div>
      <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
        <ShieldCheck size={14} /> Verified
      </span>
    </div>

    <div className="mt-4 rounded-xl bg-slate-900 p-3 font-mono text-[11px] text-slate-300">
      <p className="text-slate-500">// HMAC-SHA256, checked server-side</p>
      <div className="relative mt-1 overflow-hidden">
        <p className="truncate">signature: 9f3a7c1e5d…b82d04</p>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-transparent via-brand/50 to-transparent motion-safe:animate-scan" />
      </div>
      <p className="mt-1 text-emerald-400">✓ matches gateway signature</p>
    </div>

    <p className="mt-3 text-xs text-slate-500">Never trusted from the browser alone.</p>
  </div>
)

export const RefundVisual = () => (
  <div className={`${card} p-5`}>
    <p className="text-xs font-semibold text-slate-500">If you cancel…</p>

    <div className="mt-5 flex h-2.5 overflow-hidden rounded-full">
      <div className="w-2/3 bg-emerald-400" />
      <div className="w-1/3 bg-amber-400" />
    </div>
    <div className="relative mt-2 h-4 text-[11px] text-slate-400">
      <span className="absolute left-0">Booked</span>
      <span className="absolute left-2/3 -translate-x-1/2">2 hrs before</span>
      <span className="absolute right-0">Visit</span>
    </div>

    <div className="mt-4 grid grid-cols-2 gap-3">
      <div className="rounded-xl bg-emerald-50 p-3">
        <p className="text-xs font-semibold text-emerald-700">Full refund</p>
        <p className="mt-0.5 text-[11px] text-emerald-600">More than 2 hrs before</p>
      </div>
      <div className="rounded-xl bg-amber-50 p-3">
        <p className="text-xs font-semibold text-amber-700">₹50 penalty</p>
        <p className="mt-0.5 text-[11px] text-amber-600">Within 2 hrs</p>
      </div>
    </div>

    <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
      <Undo2 size={14} className="shrink-0 text-brand" /> Settlement confirmed with the gateway
    </div>
  </div>
)

export const VerifiedDoctorVisual = () => (
  <div className="relative pt-8">
    <div className={`${card} absolute inset-x-6 top-0 -rotate-3 p-3 opacity-70`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-slate-100" />
          <span className="text-xs font-medium text-slate-500">New applicant</span>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-600">
          <Clock size={11} /> Under review
        </span>
      </div>
    </div>

    <div className={`${card} relative p-5 motion-safe:animate-float`}>
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10">
          <Stethoscope size={22} className="text-brand" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-slate-800">Dr. Ananya Sharma</p>
          <p className="text-xs font-medium text-brand">General Medicine</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-xs text-slate-500">MBBS · Medical Council of India</span>
        <span className="flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-1 text-[11px] font-semibold text-brand">
          <ShieldCheck size={12} /> Verified
        </span>
      </div>
    </div>
  </div>
)

export const FilterVisual = () => {
  const results = [
    { name: 'Dr. Ananya Sharma', fee: 800 },
    { name: 'Dr. Rahul Verma', fee: 650 },
  ]

  return (
    <div className={`${card} p-5`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 text-xs font-semibold text-slate-500">
          <SlidersHorizontal size={13} /> Filters
        </span>
        {['General Medicine', 'MBBS', 'Under ₹1000'].map((chip) => (
          <span key={chip} className="rounded-full bg-brand px-2.5 py-1 text-[11px] font-medium text-white">
            {chip}
          </span>
        ))}
      </div>

      <div className="mt-4 h-1.5 rounded-full bg-slate-100">
        <div className="relative h-full w-1/2 rounded-full bg-slate-800">
          <div className="absolute -right-1.5 -top-1 h-3.5 w-3.5 rounded-full border-2 border-slate-800 bg-white" />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        {results.map((doctor) => (
          <div key={doctor.name} className="flex items-center gap-3 rounded-xl border border-slate-100 p-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10">
              <Stethoscope size={14} className="text-brand" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-800">{doctor.name}</p>
              <p className="text-[11px] text-brand">General Medicine</p>
            </div>
            <span className="flex items-center text-xs font-semibold text-slate-700">
              <IndianRupee size={11} />
              {doctor.fee}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export const LedgerVisual = () => {
  const rows = [
    { label: 'Refunded', sign: '+', amount: '1500', tone: 'text-emerald-600', icon: Undo2, ref: '74102938' },
    { label: 'Paid', sign: '', amount: '800', tone: 'text-slate-800', icon: Receipt, ref: '4977417' },
    { label: 'Paid', sign: '', amount: '1500', tone: 'text-slate-800', icon: Receipt, ref: '4977122' },
  ]

  return (
    <div className={`${card} p-5`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-800">Transactions</p>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">All statuses</span>
      </div>

      <div className="mt-4 flex flex-col divide-y divide-slate-100">
        {rows.map((row) => {
          const Icon = row.icon
          return (
            <div key={row.ref} className="flex items-center gap-3 py-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50">
                <Icon size={14} className="text-slate-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-700">{row.label}</p>
                <p className="flex items-center gap-0.5 text-[11px] text-slate-400">
                  <Hash size={10} />
                  {row.ref}
                </p>
              </div>
              <span className={`flex items-center text-sm font-bold ${row.tone}`}>
                {row.sign}
                <IndianRupee size={12} />
                {row.amount}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

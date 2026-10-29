import { CheckCircle2 } from 'lucide-react'
import type { ReactNode } from 'react'
import Reveal from './Reveal'

interface SpecRowProps {
  eyebrow: string
  title: string
  description: string
  points?: string[]
  visual: ReactNode
  reverse?: boolean
}

const SpecRow = ({ eyebrow, title, description, points = [], visual, reverse = false }: SpecRowProps) => {
  return (
    <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
      <Reveal direction={reverse ? 'right' : 'left'} className={reverse ? 'md:order-2' : ''}>
        <div className="relative flex aspect-4/3 items-center justify-center overflow-hidden rounded-3xl border border-white/60 bg-linear-to-br from-brand/20 via-white to-teal-50 p-6 shadow-sm sm:p-10">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-teal-200/50 blur-3xl" />
          <div className="relative w-full max-w-sm">{visual}</div>
        </div>
      </Reveal>

      <Reveal direction={reverse ? 'left' : 'right'} delay={150} className={reverse ? 'md:order-1' : ''}>
        <p className="text-xs font-semibold uppercase tracking-widest text-brand">{eyebrow}</p>
        <h3 className="mt-3 text-2xl font-bold text-slate-800 md:text-3xl">{title}</h3>
        <p className="mt-4 text-slate-600">{description}</p>

        {points.length > 0 && (
          <ul className="mt-6 flex flex-col gap-3">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-slate-700">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand" />
                {point}
              </li>
            ))}
          </ul>
        )}
      </Reveal>
    </div>
  )
}

export default SpecRow

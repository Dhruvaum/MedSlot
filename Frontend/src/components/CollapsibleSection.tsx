import { ChevronDown } from 'lucide-react'
import { useState, type ReactNode } from 'react'

interface CollapsibleSectionProps {
  label?: string
  children: ReactNode
}

const CollapsibleSection = ({ label = 'Details', children }: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mt-5 border-t border-slate-100 pt-4">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-400 transition hover:text-brand cursor-pointer"
      >
        {label}
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && <div className="mt-3">{children}</div>}
    </div>
  )
}

export default CollapsibleSection

import { Stethoscope, MapPin, GraduationCap, IndianRupee } from 'lucide-react'
import type { DoctorSummaryResponse } from '../../../../features/doctor/types'

interface DoctorCardProps {
  doctor: DoctorSummaryResponse
  isSelected: boolean
  isBooking: boolean
  onViewDetail: (doctorId: string) => void
  onBookNow: (doctorId: string) => void
}

const DoctorCard = ({ doctor, isSelected, isBooking, onViewDetail, onBookNow }: DoctorCardProps) => {
  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl border bg-white p-6 shadow-sm transition ${
        isBooking ? 'border-brand shadow-md ring-2 ring-brand/30' : isSelected ? 'border-brand/40' : 'border-slate-100 hover:border-brand hover:shadow-md'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand/10">
          <Stethoscope size={22} className="text-brand" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-800">{doctor.fullName}</h2>
          {doctor.specializationName && (
            <span className="text-xs font-medium text-brand">{doctor.specializationName}</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 text-sm text-slate-500">
        {doctor.qualificationName && (
          <div className="flex items-center gap-2">
            <GraduationCap size={16} className="shrink-0 text-slate-400" />
            <span>{doctor.qualificationName}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <MapPin size={16} className="shrink-0 text-slate-400" />
          <span className="line-clamp-1">{doctor.workAddress}</span>
        </div>
        {doctor.consultationFee != null && (
          <div className="flex items-center gap-2">
            <IndianRupee size={16} className="shrink-0 text-slate-400" />
            <span>{doctor.consultationFee} per consultation</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={() => onBookNow(doctor.id)}
          className="flex-1 rounded-xl bg-brand px-3 py-2 text-sm font-medium text-white transition hover:opacity-90 hover:cursor-pointer"
        >
          Book Now
        </button>
        <button
          type="button"
          onClick={() => onViewDetail(doctor.id)}
          className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-brand hover:text-brand hover:cursor-pointer"
        >
          Detail
        </button>
      </div>
    </div>
  )
}

export default DoctorCard

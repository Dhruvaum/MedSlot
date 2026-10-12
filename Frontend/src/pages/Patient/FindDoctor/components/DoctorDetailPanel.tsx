import { Stethoscope, GraduationCap, BadgeCheck, Landmark, MapPin } from 'lucide-react'
import type { ViewDoctorProfileResponse } from '../../../../features/doctor/types'

interface DoctorDetailPanelProps {
  isLoading: boolean
  doctor: ViewDoctorProfileResponse | null
}

const DoctorDetailPanel = ({ isLoading, doctor }: DoctorDetailPanelProps) => {
  if (!doctor) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center">
        <Stethoscope size={32} className="text-slate-300" />
        <p className="text-sm text-slate-400">
          Click <span className="font-medium text-slate-500">Detail</span> on a doctor to see their profile here.
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex-1 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="py-10 text-center text-sm text-slate-400">Loading...</div>
      </div>
    )
  }

  const details = [
    { label: 'Qualification', value: doctor.qualificationName, icon: GraduationCap },
    { label: 'Registration No.', value: doctor.registrationNumber, icon: BadgeCheck },
    { label: 'Registering Council', value: doctor.registeringCouncil, icon: Landmark },
    { label: 'Work Address', value: doctor.workAddress, icon: MapPin },
  ]

  return (
    <div className="flex-1 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col items-center gap-3 border-b border-slate-100 pb-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand/10">
          <Stethoscope size={36} className="text-brand" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">{doctor.fullName}</h2>
          {doctor.specializationName && (
            <span className="text-sm font-medium text-brand">{doctor.specializationName}</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-5">
        {details.map((detail) => {
          const Icon = detail.icon
          if (!detail.value) return null
          return (
            <div key={detail.label} className="flex items-start gap-3">
              <Icon size={16} className="mt-0.5 shrink-0 text-slate-400" />
              <div>
                <p className="text-xs font-medium text-slate-400">{detail.label}</p>
                <p className="text-sm text-slate-700">{detail.value}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DoctorDetailPanel

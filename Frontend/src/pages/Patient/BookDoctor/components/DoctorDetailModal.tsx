import { Stethoscope, GraduationCap, BadgeCheck, Landmark, MapPin } from 'lucide-react'
import Modal from '../../../../components/Modal'
import type { ViewDoctorProfileResponse } from '../../../../features/doctor/types'

interface DoctorDetailModalProps {
  open: boolean
  onClose: () => void
  isLoading: boolean
  doctor: ViewDoctorProfileResponse | null
}

const DoctorDetailModal = ({ open, onClose, isLoading, doctor }: DoctorDetailModalProps) => {
  const details = doctor
    ? [
        { label: 'Qualification', value: doctor.qualificationName, icon: GraduationCap },
        { label: 'Registration No.', value: doctor.registrationNumber, icon: BadgeCheck },
        { label: 'Registering Council', value: doctor.registeringCouncil, icon: Landmark },
        { label: 'Work Address', value: doctor.workAddress, icon: MapPin },
      ]
    : []

  return (
    <Modal open={open} onClose={onClose}>
      {isLoading || !doctor ? (
        <div className="py-10 text-center text-sm text-slate-400">Loading...</div>
      ) : (
        <>
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
        </>
      )}
    </Modal>
  )
}

export default DoctorDetailModal

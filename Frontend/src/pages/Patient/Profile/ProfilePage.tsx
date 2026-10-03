import { useEffect, useState } from 'react'
import { UserCircle } from 'lucide-react'
import Page from '../../../components/Page'
import { viewPatientProfile } from '../../../features/patient/patientService'
import type { ViewPatientProfileResponse } from '../../../features/patient/types'

const ProfilePage = () => {
  const [profile, setProfile] = useState<ViewPatientProfileResponse | null>(null)

  useEffect(() => {
    viewPatientProfile().then(setProfile)
  }, [])

  if (!profile) {
    return (
      <Page title="Profile - MedSlot">
        <div>Loading...</div>
      </Page>
    )
  }

  const details = [
    { label: 'Date of Birth', value: profile.dob },
    { label: 'Gender', value: profile.gender },
    { label: 'Email', value: profile.email },
    { label: 'Phone', value: profile.phone },
    { label: 'Address', value: profile.address },
  ]

  return (
    <Page title="Profile - MedSlot">
      <div className="mx-auto w-4/5 rounded-2xl border border-slate-100 bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center gap-3 pb-6 pt-16">
          <UserCircle size={125} className="text-brand" strokeWidth={1} />
          <h1 className="text-2xl font-bold text-slate-800">{profile.fullName}</h1>
        </div>

        <div className="grid grid-cols-2 gap-x-16 gap-y-6">
          {details.map((detail) => (
            <div key={detail.label} className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-sm font-medium text-slate-500">{detail.label}</span>
              <span className="text-sm text-slate-800">{detail.value}</span>
            </div>
          ))}
        </div>
      </div>
    </Page>
  )
}

export default ProfilePage

import { useEffect, useState } from 'react'
import { UserCircle } from 'lucide-react'
import Page from '../../../components/Page'
import { viewProfileInfo } from '../../../features/patient/patientService'
import type { ViewProfileResponse } from '../../../features/patient/types'

const ProfilePage = () => {
  const [profile, setProfile] = useState<ViewProfileResponse | null>(null)

  useEffect(() => {
    viewProfileInfo().then(setProfile)
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
    { label: 'Phone', value: profile.phone },
    { label: 'Address', value: profile.address },
  ]

  return (
    <Page title="Profile - MedSlot">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center gap-3">
          <UserCircle size={96} className="text-brand" strokeWidth={1} />
          <h1 className="text-2xl font-bold text-slate-800">{profile.fullName}</h1>
        </div>

        <div className="mt-8 flex flex-col gap-4">
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
import { ShieldCheck, GraduationCap, Landmark, MapPin, UserRoundCheck } from 'lucide-react'
import Page from '../../components/Page'
import { usePendingDoctors } from './usePendingDoctors'

const PendingDoctorsPage = () => {
  const { doctors, isLoading, verifyingId, handleVerify } = usePendingDoctors()

  return (
    <Page title="Pending Doctor Verifications - MedSlot">
      <div className="mx-auto w-4/5">
        <h1 className="text-2xl font-bold text-slate-800">Pending Doctor Verifications</h1>
        <p className="mt-1 text-sm text-slate-500">Review and approve doctors waiting to become visible to patients.</p>

        <div className="mt-8">
          {isLoading ? (
            <div className="py-20 text-center text-sm text-slate-400">Loading...</div>
          ) : doctors.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <ShieldCheck size={32} className="text-slate-300" />
              <p className="text-sm text-slate-400">No doctors are waiting for verification.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {doctors.map((doctor) => (
                <div
                  key={doctor.doctorId}
                  className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-semibold text-slate-800">{doctor.fullName}</h2>
                      <p className="mt-1 text-sm text-slate-500">Reg. No. {doctor.registrationNumber}</p>
                    </div>

                    <button
                      type="button"
                      disabled={verifyingId === doctor.doctorId}
                      onClick={() => handleVerify(doctor.doctorId)}
                      className="flex shrink-0 items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                    >
                      <UserRoundCheck size={16} />
                      {verifyingId === doctor.doctorId ? 'Verifying...' : 'Verify'}
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-2 border-t border-slate-100 pt-4 sm:grid-cols-3">
                    {doctor.qualificationName && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <GraduationCap size={15} className="shrink-0 text-slate-400" />
                        {doctor.qualificationName}
                      </div>
                    )}
                    {doctor.registeringCouncilName && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Landmark size={15} className="shrink-0 text-slate-400" />
                        {doctor.registeringCouncilName}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin size={15} className="shrink-0 text-slate-400" />
                      {doctor.workAddress}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Page>
  )
}

export default PendingDoctorsPage

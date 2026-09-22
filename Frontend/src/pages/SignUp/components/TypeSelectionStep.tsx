import React from 'react'

import patientIllustration from '../../../assets/illustrations/patient.svg'
import doctorIllustration from '../../../assets/illustrations/doctor.svg'

const TypeSelectionStep = ({setType}:
  {setType: React.Dispatch<React.SetStateAction<'Patient' | 'Doctor' | null>>}
) => {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-10 px-4 text-center">
        <h1 className="text-3xl font-bold text-slate-800">Sign up as a Patient or Doctor</h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setType('Patient')}
              className="flex flex-col items-center gap-4 rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition hover:border-brand hover:shadow-md"
            >
              <img src={patientIllustration} alt="Patient" className="h-40 w-40" />
              <span className="text-lg font-semibold text-slate-800">I'm a Patient</span>
            </button>

            <button
              type="button"
              onClick={() => setType('Doctor')}
              className="flex flex-col items-center gap-4 rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition hover:border-brand hover:shadow-md"
            >
              <img src={doctorIllustration} alt="Doctor" className="h-40 w-40" />
              <span className="text-lg font-semibold text-slate-800">I'm a Doctor</span>
            </button>
          </div>
    </div>
  )
}

export default TypeSelectionStep
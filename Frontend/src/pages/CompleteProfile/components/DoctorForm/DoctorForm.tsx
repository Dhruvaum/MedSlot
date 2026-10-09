import { useEffect, useState } from "react"
import type { DoctorProfileData } from "./UseDoctorForm"
import { useDoctorForm } from "./UseDoctorForm"
import { getAllSpecializations, getAllQualifications, getAllRegisteringCouncils } from "../../../../features/doctor/doctorService";
import type { QualificationOptions, RegisteringCouncilOptions, SpecializationOptions } from "../../../../features/doctor/types";

const DoctorForm = () => {

  const [specializationOptions, setSpecializationOptions] = useState<SpecializationOptions[]>([]);
  const [qualificationOptions, setQualificationOptions] = useState<QualificationOptions[]>([]);
  const [councilOptions, setCouncilOptions] = useState<RegisteringCouncilOptions[]>([]);

  const fields: {name: keyof DoctorProfileData, label: string, type: string, options?: {id: string, name: string}[]}[] = [
    { name: 'fullName', label: 'Full Name', type: 'text' },
    { name: 'phone', label: 'Phone', type: 'text' },
    { name: 'specializationId', label: 'Specialization', type: 'select', options: specializationOptions },
    { name: 'qualificationId', label: 'Qualification', type: 'select', options: qualificationOptions },
    { name: 'registeringCouncilId', label: 'Registering Council', type: 'select', options: councilOptions },
    { name: 'registrationNumber', label: 'Registration Number', type: 'text' },
    { name: 'workAddress', label: 'Work Address', type: 'text' },
  ]

  useEffect(() => {
    getAllSpecializations().then((res) => setSpecializationOptions(res));
    getAllQualifications().then((res) => setQualificationOptions(res));
    getAllRegisteringCouncils().then((res) => setCouncilOptions(res));
  },[])
  
  // Destructure Properties
  const {profile, errors, handleChange, handleSubmit} = useDoctorForm();

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-8 px-4">
      <h1 className="text-3xl mt-6 font-bold text-slate-800">Complete Your Profile</h1>

      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-md flex-col gap-5 rounded-2xl border border-slate-100 bg-white p-8 shadow-sm"
      >
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col gap-1">
            <label htmlFor={field.name} className="text-sm font-medium text-slate-700">
              {field.label}
            </label>
            
            {
              field.type === 'select' ? (
                <select
                  id={field.name}
                  value={profile[field.name]}
                  onChange={handleChange(field.name)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-slate-800 outline-none transition focus:border-brand"
                >
                  <option value="">Select {field.label}</option>
                  {
                    field.options?.map((option) => (
                      <option key={option.id} value={option.id}>{option.name}</option>
                    ))
                  }
                </select>
              ) : (
                <input
                  id={field.name}
                  type={field.type}
                  value={profile[field.name]}
                  onChange={handleChange(field.name)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-slate-800 outline-none transition focus:border-brand"
                />
              )
            }
            {
              errors[field.name] && (
                <span className="text-sm text-slate-500">{errors[field.name]}</span>
              )
            }

          </div>
        ))}
        
        <button
          type="submit"
          className="mt-2 rounded-full bg-brand px-6 py-3 font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          Save Profile
        </button>
      </form>
    </div>
  )
}

export default DoctorForm;
import { useEffect, useState } from 'react'
import type { ViewDoctorProfileResponse } from '../../../features/doctor/types';
import { viewMyProfile } from '../../../features/doctor/doctorService';
import Page from '../../../components/Page';
import { Stethoscope } from 'lucide-react';

const ViewDoctor = () => {

    const [doctor, setDoctor] = useState<ViewDoctorProfileResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        viewMyProfile()
            .then((response) => {
                setDoctor(response);
            })
            .finally(() => setIsLoading(false))
    }, []);

    if (isLoading || !doctor) {
        return (
            <Page title="Doctor Profile - MedSlot">
                <div>Loading...</div>
            </Page>
        )
    }

    const details = [
        { label: 'Specialization', value: doctor.specializationName },
        { label: 'Qualification', value: doctor.qualificationName },
        { label: 'Registration Number', value: doctor.registrationNumber },
        { label: 'Registering Council', value: doctor.registeringCouncil },
        { label: 'Work Address', value: doctor.workAddress, span: true },
    ]

    return (
        <Page title={`${doctor.fullName} - MedSlot`}>
            <div className="mx-auto w-4/5 rounded-2xl border border-slate-100 bg-white p-8 shadow-lg">
                <div className="flex flex-col items-center gap-3 pb-6 pt-16">
                    <Stethoscope size={100} className="text-brand" strokeWidth={1} />
                    <h1 className="text-2xl font-bold text-slate-800">{doctor.fullName}</h1>
                </div>

                <div className="grid grid-cols-2 gap-x-16 gap-y-6">
                    {details.map((detail) => (
                        <div
                            key={detail.label}
                            className={`flex justify-between border-b border-slate-100 pb-2 ${detail.span ? 'col-span-2' : ''}`}
                        >
                            <span className="text-sm font-medium text-slate-500">{detail.label}</span>
                            <span className="text-sm text-slate-800">{detail.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Page>
    )
}

export default ViewDoctor
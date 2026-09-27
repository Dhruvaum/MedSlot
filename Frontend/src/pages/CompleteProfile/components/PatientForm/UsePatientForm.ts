import { useState, type ChangeEvent, type FormEvent } from "react"
import { patientFormSchema } from "./schema";
import * as yup from 'yup'
import { completePatientProfile } from "../../../../services/CompleteProfile";

export interface PatientProfileData{
    fullName: string,
    dob: string,
    gender: string,
    phone: string,
    address: string
}

type FormErrors = Partial<Record<keyof PatientProfileData, string>>;

export const usePatientForm = () => {
    const [profile, setProfile] = useState<PatientProfileData>({
        fullName: '',
        dob: '',
        gender: '',
        phone: '',
        address: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const handleChange = (field: keyof PatientProfileData) => async (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const updatedProfile = {...profile, field:e.target.value};
        setProfile(updatedProfile);

        try{
            await patientFormSchema.validateAt(field, updatedProfile);
            setErrors((prev) => ({...prev, [field]: undefined}))
        }
        catch(err){
            if(err instanceof yup.ValidationError){
                setErrors((prev) => ({...prev, [field]: err.message}))
            }
        }
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try{
            await patientFormSchema.validate(profile, {abortEarly: false});
            setErrors({});

            // Prepare profile payload
            await completePatientProfile(profile);
        }
        catch(err){
            if(err instanceof yup.ValidationError){
                const newErrors: FormErrors = {}
                err.inner.forEach((validationError) => {
                    if(validationError.path){
                        newErrors[validationError.path as keyof PatientProfileData] = validationError.message;
                    }
                })
                setErrors(newErrors);
            }
        }
    }

    return {profile, errors, handleChange, handleSubmit}
}
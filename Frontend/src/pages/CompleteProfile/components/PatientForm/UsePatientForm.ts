import { useState, type ChangeEvent, type FormEvent } from "react"
import { patientFormSchema } from "./schema";
import * as yup from 'yup'
import { completePatientProfile } from "../../../../features/completeProfile/CompleteProfileService";
import type { CompletePatientProfileResponse } from "../../../../features/completeProfile/types";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export interface PatientProfileData{
    fullName: string,
    dob: string,
    gender: string,
    phone: string,
    address: string
}

type FormErrors = Partial<Record<keyof PatientProfileData, string>>;

export const usePatientForm = () => {

    const navigate = useNavigate();

    const [profile, setProfile] = useState<PatientProfileData>({
        fullName: '',
        dob: '',
        gender: '',
        phone: '',
        address: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const handleChange = (field: keyof PatientProfileData) => async (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const updatedProfile = {...profile, [field]:e.target.value};
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
            const response: CompletePatientProfileResponse = await completePatientProfile(profile);

            if(response && response.authToken){
                toast.success('Profile completed successfully!');

                localStorage.removeItem("authToken");
                localStorage.setItem("authToken", response.authToken);

                // Navigate to Patient Dashboard
                navigate('/patient');
            }
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
                toast.error(`Error ${err}`);
            }
        }
    }

    return {profile, errors, handleChange, handleSubmit}
}
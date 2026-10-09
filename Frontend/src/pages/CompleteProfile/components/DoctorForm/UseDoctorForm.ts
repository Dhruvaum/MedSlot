import { useState, type ChangeEvent, type FormEvent } from "react"
import { doctorFormSchema } from "./schema";
import * as yup from 'yup'
import { completeDoctorProfile } from "../../../../features/completeProfile/CompleteProfileService";
import type { CompleteDoctorProfileResponse } from "../../../../features/completeProfile/types";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export interface DoctorProfileData{
    fullName: string,
    phone: string,
    specializationId: string,
    qualificationId: string,
    registrationNumber: string,
    registeringCouncilId: string,
    workAddress: string
}

type FormErrors = Partial<Record<keyof DoctorProfileData, string>>;

export const useDoctorForm = () => {

    const navigate = useNavigate();

    const [profile, setProfile] = useState<DoctorProfileData>({
        fullName: '',
        phone: '',
        specializationId: '',
        qualificationId: '',
        registrationNumber: '',
        registeringCouncilId: '',
        workAddress: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const handleChange = (field: keyof DoctorProfileData) => async (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const updatedProfile = {...profile, [field]:e.target.value};
        setProfile(updatedProfile);

        try{
            await doctorFormSchema.validateAt(field, updatedProfile);
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
            await doctorFormSchema.validate(profile, {abortEarly: false});
            setErrors({});

            // Prepare profile payload
            const response: CompleteDoctorProfileResponse = await completeDoctorProfile(profile);

            if(response && response.authToken){
                toast.success('Profile completed successfully!');

                localStorage.removeItem("authToken");
                localStorage.setItem("authToken", response.authToken);

                // Navigate to Doctor Dashboard
                navigate('/doctor');
            }
        }
        catch(err){
            if(err instanceof yup.ValidationError){
                const newErrors: FormErrors = {}
                err.inner.forEach((validationError) => {
                    if(validationError.path){
                        newErrors[validationError.path as keyof DoctorProfileData] = validationError.message;
                    }
                })
                setErrors(newErrors);
                toast.error(`Error ${err}`);
            }
        }
    }

    return {profile, errors, handleChange, handleSubmit}
}
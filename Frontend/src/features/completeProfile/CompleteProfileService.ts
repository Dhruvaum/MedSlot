import { axiosClient } from "../../api/axiosClient";
import type { PatientProfileData } from "../../pages/CompleteProfile/components/PatientForm/UsePatientForm";
import type { DoctorProfileData } from "../../pages/CompleteProfile/components/DoctorForm/UseDoctorForm";
import type { CompletePatientProfileResponse, CompleteDoctorProfileResponse } from "./types";

export const completePatientProfile = async (profile: PatientProfileData): Promise<CompletePatientProfileResponse> => {
    const response = await axiosClient.post(`/patients/complete-profile`, profile);
    return response.data;
}

export const completeDoctorProfile = async (doctor: DoctorProfileData): Promise<CompleteDoctorProfileResponse> => {
    const response = await axiosClient.post('/doctors/complete-profile', doctor);
    return response.data;
}
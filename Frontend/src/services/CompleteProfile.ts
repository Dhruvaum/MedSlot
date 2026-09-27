import { axiosClient } from "../api/axiosClient";
import type { PatientProfileData } from "../pages/CompleteProfile/components/PatientForm/UsePatientForm";

export const completePatientProfile = async (profile: PatientProfileData): Promise<void> => {
    await axiosClient.post(`/patients/complete-profile`, profile);
}
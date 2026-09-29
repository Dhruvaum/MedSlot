import { axiosClient } from "../../api/axiosClient";
import type { PatientProfileData } from "../../pages/CompleteProfile/components/PatientForm/UsePatientForm";
import type { CompletePatientProfileResponse } from "./types";

export const completePatientProfile = async (profile: PatientProfileData): Promise<CompletePatientProfileResponse> => {
    const response = await axiosClient.post(`/patients/complete-profile`, profile);
    return response.data;
}
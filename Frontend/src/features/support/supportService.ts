import { axiosClient } from "../../api/axiosClient";
import type { PendingDoctorVerificationSummary } from "./types";

export const getPendingVerifications = async (): Promise<PendingDoctorVerificationSummary[]> => {
    const response = await axiosClient.get<PendingDoctorVerificationSummary[]>('/medslot-support/getPendingVerifications');
    return response.data;
}

export const verifyDoctor = async (doctorId: string): Promise<void> => {
    await axiosClient.post('/medslot-support/verifyDoctor', null, {
        params: { doctorId }
    });
}

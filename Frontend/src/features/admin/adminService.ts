import { axiosClient } from "../../api/axiosClient";
import type { PendingDoctorVerificationSummary } from "./types";

export const getPendingVerifications = async (): Promise<PendingDoctorVerificationSummary[]> => {
    const response = await axiosClient.get<PendingDoctorVerificationSummary[]>('/admin/getPendingVerifications');
    return response.data;
}

export const verifyDoctor = async (doctorId: string): Promise<void> => {
    await axiosClient.post('/admin/verifyDoctor', null, {
        params: { doctorId }
    });
}

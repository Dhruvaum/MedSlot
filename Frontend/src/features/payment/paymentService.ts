import { axiosClient } from "@/api/axiosClient";
import type { ResumeBookingPaymentResponse } from "./types";

export const resumeBookingPayment = async (appointmentId: string): Promise<ResumeBookingPaymentResponse> => {
    const response = await axiosClient.get<ResumeBookingPaymentResponse>('/payments/resumeBookingPayment', {
        params: {appointmentId: appointmentId}
    });
    return response.data;
}
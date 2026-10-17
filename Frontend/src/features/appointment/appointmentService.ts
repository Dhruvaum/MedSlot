import { axiosClient } from "../../api/axiosClient";
import type { AvailableSlot, BookAppointmentRequest, BookAppointmentResponse, AppointmentSummaryResponse, VerifyPaymentRequest } from "./types";

export const getAvailableSlots = async (doctorId: string): Promise<AvailableSlot[]> => {
    const response = await axiosClient.get<AvailableSlot[]>(`/patient-appointment/getAvailableSlots`, {
        params: {DoctorId: doctorId}
    });

    return response.data;
}

export const bookAppointment = async (request: BookAppointmentRequest): Promise<BookAppointmentResponse> => {
    const response = await axiosClient.post<BookAppointmentResponse>('/patient-appointment/bookAppointment', request);
    return response.data;
}

export const verifyPayment = async (Request: VerifyPaymentRequest): Promise<void> => {
    await axiosClient.post('/payments/verifyPayment', Request);
}

export const getMyAppointments = async (): Promise<AppointmentSummaryResponse> => {
    const response = await axiosClient.get<AppointmentSummaryResponse>('/patient-appointment/getMyAppointments');
    return response.data;
}

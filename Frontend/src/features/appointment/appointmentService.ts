import { axiosClient } from "../../api/axiosClient";
import type { AvailableSlot, BookAppointmentRequest, BookAppointmentResponse } from "./types";

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

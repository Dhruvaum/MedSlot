export interface AvailableSlot {
    id: string,
    startTime: string,
    endTime: string
}

export interface BookAppointmentRequest {
    timeSlotId: string,
    patientConcern?: string
}

export interface BookAppointmentResponse {
    appointmentId: string,
    startTime: string,
    endTime: string
}

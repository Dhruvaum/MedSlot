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
    endTime: string,
    razorpayOrderId: string,
    amount: number,
    razorpayKeyId: string
}

export interface VerifyPaymentRequest {
    razorpayPaymentId: string,
    razorpayOrderId: string,
    razorpaySignature: string
}

export interface AppointmentSummary{
    id: string,
    doctorName: string,
    specializationName: string | null,
    startTime: string,
    endTime: string,
    status: string,
    bookedAt: string,
    createdAt: string,
    concern?: string
}

export interface AppointmentSummaryResponse{
    appointments: AppointmentSummary[]
}

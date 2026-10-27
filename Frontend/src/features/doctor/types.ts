import type { DayOfWeek } from "../../types/common"

export interface SpecializationOptions{
    id: string,
    name: string
}

export interface QualificationOptions{
    id: string,
    name: string
}

export interface RegisteringCouncilOptions{
    id: string,
    name: string
}

export interface GetDoctorsListingRequest{
    search?: string,
    specializationId?: string,
    qualificationId?: string,
    maxConsultationFee?: number,
    pageNumber: number,
    pageSize: number
}

export interface DoctorSummaryResponse{
    id: string,
    fullName: string,
    specializationName: string | null,
    qualificationName: string | null,
    consultationFee: number | null
    workAddress: string
}

export interface ViewDoctorProfileResponse{
    id: string,
    fullName: string,
    specializationName: string | null,
    qualificationName: string | null,
    registrationNumber: string,
    registeringCouncil: string,
    workAddress: string,
    verificationStatus: number
}

export interface DayAvailability{
    dayOfWeek: DayOfWeek,
    isOff: boolean,
    startTime: string | null,
    endTime: string | null,
    breakStartTime: string | null,
    breakEndTime: string | null
}

export interface DoctorAvailability{
    days: DayAvailability[],
    consultDurationMinutes: number,
    consultationFee: number
}

export interface GetDoctorAppointmentsRequest{
    date?: string | null,
    status?: string | null,
    pageNumber: number,
    pageSize: number
}

export interface DoctorAppointmentSummary{
    id: string,
    patientName: string,
    startTime: string,
    endTime: string,
    status: string,
    concern?: string | null
}

export interface AppointmentStatusOptions{
    id: string,
    name: string
}

export interface MarkAppointmentOutcomeRequest{
    appointmentId: string,
    outcome: 'Completed' | 'NoShow'
}
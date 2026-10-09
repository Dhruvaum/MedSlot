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
    pageNumber: number,
    pageSize: number
}

export interface DoctorSummaryResponse{
    id: string,
    fullName: string,
    specializationName: string | null,
    qualificationName: string | null,
    workAddress: string
}

export interface ViewDoctorProfileResponse{
    id: string,
    fullName: string,
    specializationName: string | null,
    qualificationName: string | null,
    registrationNumber: string,
    registeringCouncil: string,
    workAddress: string
}
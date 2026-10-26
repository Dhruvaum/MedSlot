export interface PendingDoctorVerificationSummary{
    doctorId: string,
    fullName: string,
    registrationNumber: string,
    qualificationName: string | null,
    registeringCouncilName: string | null,
    workAddress: string
}

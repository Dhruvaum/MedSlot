import { axiosClient } from "../../api/axiosClient";
import type { PagedResponse } from "../../types/common";
import type { SpecializationOptions, QualificationOptions, RegisteringCouncilOptions, GetDoctorsListingRequest, DoctorSummaryResponse, ViewDoctorProfileResponse } from "./types";

export const getAllSpecializations = async (): Promise<SpecializationOptions[]> =>{
    const response = await axiosClient.get<SpecializationOptions[]>('/doctors/getSpecializationOptions');
    return response.data;
}

export const getAllQualifications = async (): Promise<QualificationOptions[]> =>{
    const response = await axiosClient.get<QualificationOptions[]>('/doctors/getQualificationOptions');
    return response.data;
}

export const getAllRegisteringCouncils = async (): Promise<RegisteringCouncilOptions[]> =>{
    const response = await axiosClient.get<RegisteringCouncilOptions[]>('/doctors/getRegisteringCouncilOptions');
    return response.data;
}

export const getDoctorsListing = async (req: GetDoctorsListingRequest): Promise<PagedResponse<DoctorSummaryResponse>> => {
    const response = await axiosClient.post<PagedResponse<DoctorSummaryResponse>>('/doctors/getDoctorsListing', req);
    return response.data;
}

export const ViewDoctorProfile = async (doctorId: string): Promise<ViewDoctorProfileResponse> => {
    const response = await axiosClient.get('doctors/viewDoctorProfile', {
        params: {doctorId}
    });

    return response.data;
}
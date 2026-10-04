import { axiosClient } from "../../api/axiosClient";
import type { PagedResponse } from "../../types/common";
import type { GetDoctorsListingRequest, DoctorSummaryResponse, ViewDoctorProfileResponse } from "./types";

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
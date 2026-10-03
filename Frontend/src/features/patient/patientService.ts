import { axiosClient } from "../../api/axiosClient";
import type { ViewPatientProfileResponse } from "./types";

export const viewPatientProfile = async (): Promise<ViewPatientProfileResponse> => {
    const response = await axiosClient.get<ViewPatientProfileResponse>('/patients/viewPatientProfile');
    return response.data;
}
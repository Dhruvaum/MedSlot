import { axiosClient } from "../../api/axiosClient";
import type { ViewProfileResponse } from "./types";

export const viewProfileInfo = async (): Promise<ViewProfileResponse> => {
    const response = await axiosClient.get<ViewProfileResponse>('/patients/viewProfileInfo');
    return response.data;
}
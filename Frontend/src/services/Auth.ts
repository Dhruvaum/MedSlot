import { axiosClient } from "../api/axiosClient";
import type { RegisterRequest, RegisterResponse } from "../features/auth/types";

export const registerAccount = async (request: RegisterRequest): Promise<RegisterResponse> => {
    const response = await axiosClient.post<RegisterResponse>(`/auth/register`, request);
    return response.data;
}
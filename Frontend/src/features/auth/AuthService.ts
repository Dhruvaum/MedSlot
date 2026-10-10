import { axiosClient } from "../../api/axiosClient";
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "./types";
import { toast } from "sonner";

export const registerAccount = async (request: RegisterRequest): Promise<RegisterResponse> => {
    const response = await axiosClient.post<RegisterResponse>(`/auth/register`, request);
    return response.data;
}

export const login = async (request: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosClient.post<LoginResponse>(`/auth/login`, request);
    return response.data;
}

export const clearAuthSession = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("isRegistrationCompleted")
}

export const logoutAndRedirect = (message?: string) => {
    clearAuthSession();
    window.location.href = '/signIn';
    toast.info(message ? message : "Signed Out");
}
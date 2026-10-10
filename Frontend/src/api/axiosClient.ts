import axios from "axios";
import { Environment } from "../configs/env";
import { isTokenExpired } from "../utils/token";
import { logoutAndRedirect } from "../features/auth/AuthService";

const axiosClient = axios.create({
    baseURL: Environment.BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");

    if(token){
        if(isTokenExpired(token)){
            logoutAndRedirect();
            return Promise.reject(new Error('Token expired'));
        }
        config.headers.Authorization = `Bearer ${token}`
    }

    return config;
});

export {axiosClient};
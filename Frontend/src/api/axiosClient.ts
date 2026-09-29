import { Environment } from "../configs/env";
import axios from "axios";

const axiosClient = axios.create({
    baseURL: Environment.BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken")
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    
    return config;
});

export {axiosClient};
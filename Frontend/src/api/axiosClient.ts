import { Environment } from "../configs/env";
import axios from "axios";

export const axiosClient = axios.create({
    baseURL: Environment.BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})
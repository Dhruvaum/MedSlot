import type { PagedResponse } from "@/types/common";
import { axiosClient } from "../../api/axiosClient";
import type { GetTransactionsRequest, TransactionSummaryResponse, ViewPatientProfileResponse, PaymentStatusOption } from "./types";

export const viewPatientProfile = async (): Promise<ViewPatientProfileResponse> => {
    const response = await axiosClient.get<ViewPatientProfileResponse>('/patients/viewPatientProfile');
    return response.data;
}

export const getMyTransactions = async (req: GetTransactionsRequest): Promise<PagedResponse<TransactionSummaryResponse>> => {
    const response = await axiosClient.post<PagedResponse<TransactionSummaryResponse>>('/payments/getPatientTransactionsListing', req);
    return response.data;
}

export const getPaymentStatusOptions = async (): Promise<PaymentStatusOption[]> => {
    const response = await axiosClient.get<PaymentStatusOption[]>('/payments/getPaymentStatusOptions');
    return response.data;
}
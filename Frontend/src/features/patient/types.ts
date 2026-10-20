export interface ViewPatientProfileResponse{
    fullName: string,
    dob: string,
    gender: string,
    email: string,
    phone: string,
    address: string
}

export interface GetTransactionsRequest{
    paymentStatus?: string | null;
    date?: string | null;
    pageNumber: number;
    pageSize: number;
}

export interface PaymentStatusOption{
    id: string;
    name: string;
}

export interface TransactionSummaryResponse{
    id: string;
    transactionAmount: number;
    transactionDate: string;
    transactionStatus: string;
    referenceNumber: string | null;
    appointmentDate: string;
    slotStartTime: string;
    slotEndTime: string;
    concern: string | null;
    doctorName: string;
}
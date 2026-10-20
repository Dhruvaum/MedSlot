import { useEffect, useState } from 'react'
import { getMyTransactions, getPaymentStatusOptions } from '../../../features/patient/patientService'
import type { TransactionSummaryResponse, PaymentStatusOption } from '../../../features/patient/types'

const PAGE_SIZE = 6

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<TransactionSummaryResponse[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [pageNumber, setPageNumber] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const [statusOptions, setStatusOptions] = useState<PaymentStatusOption[]>([])
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null)
  const [date, setDate] = useState<string | null>(null)

  useEffect(() => {
    getPaymentStatusOptions()
      .then(setStatusOptions)
      .catch(() => setStatusOptions([]))
  }, [])

  useEffect(() => {
    setIsLoading(true)
    getMyTransactions({ paymentStatus, date, pageNumber, pageSize: PAGE_SIZE })
      .then((response) => {
        setTransactions(response.items)
        setTotalPages(response.totalPages)
      })
      .finally(() => setIsLoading(false))
  }, [paymentStatus, date, pageNumber])

  const handleStatusChange = (value: string) => {
    setPaymentStatus(value || null)
    setPageNumber(1)
  }

  const handleDateChange = (value: string) => {
    setDate(value || null)
    setPageNumber(1)
  }

  const clearFilters = () => {
    setPaymentStatus(null)
    setDate(null)
    setPageNumber(1)
  }

  return {
    transactions,
    totalPages,
    pageNumber,
    setPageNumber,
    isLoading,
    statusOptions,
    paymentStatus,
    date,
    handleStatusChange,
    handleDateChange,
    clearFilters,
  }
}

import { useEffect, useState } from 'react'
import { getDoctorAppointments } from '../../../features/doctor/doctorService'
import type { DoctorAppointmentSummary } from '../../../features/doctor/types'

const PAGE_SIZE = 6

export const useDoctorAppointments = () => {
  const [appointments, setAppointments] = useState<DoctorAppointmentSummary[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [pageNumber, setPageNumber] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [date, setDate] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    getDoctorAppointments({ date, status: null, pageNumber, pageSize: PAGE_SIZE })
      .then((response) => {
        setAppointments(response.items)
        setTotalPages(response.totalPages)
      })
      .finally(() => setIsLoading(false))
  }, [date, pageNumber])

  const handleDateChange = (value: string) => {
    setDate(value || null)
    setPageNumber(1)
  }

  const clearFilters = () => {
    setDate(null)
    setPageNumber(1)
  }

  return {
    appointments,
    totalPages,
    pageNumber,
    setPageNumber,
    isLoading,
    date,
    handleDateChange,
    clearFilters,
  }
}

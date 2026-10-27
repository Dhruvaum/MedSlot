import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { getDoctorAppointments, markAppointmentOutcome, getAppointmentStatusOptions } from '../../../features/doctor/doctorService'
import type { DoctorAppointmentSummary, AppointmentStatusOptions } from '../../../features/doctor/types'

const PAGE_SIZE = 6

export const useDoctorAppointments = () => {
  const [appointments, setAppointments] = useState<DoctorAppointmentSummary[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [pageNumber, setPageNumber] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [date, setDate] = useState<string | null>(null)
  const [statusOptions, setStatusOptions] = useState<AppointmentStatusOptions[]>([])
  const [status, setStatus] = useState<string | null>(null)

  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [outcomeTarget, setOutcomeTarget] = useState<{ appointmentId: string; outcome: 'Completed' | 'NoShow' } | null>(null)

  const loadAppointments = () => {
    setIsLoading(true)
    getDoctorAppointments({ date, status, pageNumber, pageSize: PAGE_SIZE })
      .then((response) => {
        setAppointments(response.items)
        setTotalPages(response.totalPages)
      })
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    getAppointmentStatusOptions().then(setStatusOptions)
  }, [])

  useEffect(() => {
    loadAppointments()
  }, [date, status, pageNumber])

  const handleDateChange = (value: string) => {
    setDate(value || null)
    setPageNumber(1)
  }

  const handleStatusChange = (value: string) => {
    setStatus(value || null)
    setPageNumber(1)
  }

  const clearFilters = () => {
    setDate(null)
    setStatus(null)
    setPageNumber(1)
  }

  const handleOutcomeClick = (appointmentId: string, outcome: 'Completed' | 'NoShow') => {
    setOutcomeTarget({ appointmentId, outcome })
  }

  const closeOutcomeDialog = () => {
    setOutcomeTarget(null)
  }

  const handleConfirmOutcome = async () => {
    if (!outcomeTarget) return

    setUpdatingId(outcomeTarget.appointmentId)
    try {
      await markAppointmentOutcome(outcomeTarget)
      toast.success(outcomeTarget.outcome === 'Completed' ? 'Marked as completed' : 'Marked as no-show')
      loadAppointments()
    } catch {
      toast.error('Could not update this appointment. Please try again.')
    } finally {
      setUpdatingId(null)
      setOutcomeTarget(null)
    }
  }

  return {
    appointments,
    totalPages,
    pageNumber,
    setPageNumber,
    isLoading,
    date,
    handleDateChange,
    statusOptions,
    status,
    handleStatusChange,
    clearFilters,
    updatingId,
    outcomeTarget,
    handleOutcomeClick,
    closeOutcomeDialog,
    handleConfirmOutcome,
  }
}

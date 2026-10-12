import { useEffect, useState } from 'react'
import { getMyAppointments } from '../../../features/appointment/appointmentService'
import type { AppointmentSummary } from '../../../features/appointment/types'

export const useMyAppointments = () => {
  const [appointments, setAppointments] = useState<AppointmentSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getMyAppointments()
      .then((response) => setAppointments(response.appointments))
      .finally(() => setIsLoading(false))
  }, [])

  return { appointments, isLoading }
}

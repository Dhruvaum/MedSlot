import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { getMyAppointments } from '../../../features/appointment/appointmentService'
import { resumeBookingPayment } from '../../../features/payment/paymentService'
import type { AppointmentSummary } from '../../../features/appointment/types'
import { openRazorpayCheckout } from '../../../lib/openRazorpayCheckout'
import { parseUtcDate } from '../../../utils/date'

export const useMyAppointments = () => {
  const [appointments, setAppointments] = useState<AppointmentSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [resumingId, setResumingId] = useState<string | null>(null)

  const loadAppointments = () => {
    setIsLoading(true)
    getMyAppointments()
      .then((response) => setAppointments(response.appointments))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    loadAppointments()
  }, [])

  const handleResumePayment = async (appointmentId: string, holdExpiresAt: string | null) => {
    setResumingId(appointmentId)
    try {
      const checkout = await resumeBookingPayment(appointmentId)

      const expiresInMs = holdExpiresAt ? parseUtcDate(holdExpiresAt).getTime() - Date.now() : 0

      await openRazorpayCheckout({
        razorpayKeyId: checkout.razorpayKeyId,
        razorpayOrderId: checkout.razorpayOrderId,
        amount: checkout.amount,
        expiresInMs,
        onSuccess: () => {
          toast.success('Payment confirmed')
          loadAppointments()
        },
        onFailure: (message) => toast.error(message),
        onDismiss: () => toast.info('Payment not completed - your slot will expire automatically if unpaid'),
        onExpire: () => toast.error('Your booking session has expired. Please try again.'),
      })
    } catch {
      toast.error('This booking session has expired. Please book again.')
      loadAppointments()
    } finally {
      setResumingId(null)
    }
  }

  return { appointments, isLoading, resumingId, handleResumePayment }
}

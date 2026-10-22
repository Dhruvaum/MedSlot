import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { getMyAppointments, cancelAppointment } from '../../../features/appointment/appointmentService'
import { resumeBookingPayment } from '../../../features/payment/paymentService'
import type { AppointmentSummary } from '../../../features/appointment/types'
import { openRazorpayCheckout } from '../../../lib/openRazorpayCheckout'
import { parseUtcDate } from '../../../utils/date'

export const useMyAppointments = () => {
  const [appointments, setAppointments] = useState<AppointmentSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [resumingId, setResumingId] = useState<string | null>(null)
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null)
  const [cancelCase, setCancelCase] = useState<string | null>(null)
  const [isCheckingCancellation, setIsCheckingCancellation] = useState(false)

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

  const handleCancelClick = async (appointmentId: string) => {
    setIsCheckingCancellation(true)
    try {
      const response = await cancelAppointment(appointmentId, false)

      if (!response.confirmationRequired) {
        toast.error(response.message)
        return
      }

      setCancelCase(response.case)
      setCancelTargetId(appointmentId)
    } catch {
      toast.error('Could not check this appointment. Please try again.')
    } finally {
      setIsCheckingCancellation(false)
    }
  }

  const closeCancelDialog = () => {
    setCancelTargetId(null)
    setCancelCase(null)
  }

  const handleConfirmCancel = async () => {
    if (!cancelTargetId) return

    const appointmentId = cancelTargetId
    setCancellingId(appointmentId)
    try {
      const response = await cancelAppointment(appointmentId, true)

      if (response.confirmationRequired) {
        toast.error(response.message)
        return
      }

      if (response.statusCode === 200) {
        toast.success(response.message)
        loadAppointments()
      } else {
        toast.error(response.message)
      }
    } catch {
      toast.error('Could not cancel this appointment. Please try again.')
    } finally {
      setCancellingId(null)
      setCancelTargetId(null)
      setCancelCase(null)
    }
  }

  return {
    appointments,
    isLoading,
    resumingId,
    handleResumePayment,
    cancellingId,
    cancelTargetId,
    cancelCase,
    isCheckingCancellation,
    handleCancelClick,
    closeCancelDialog,
    handleConfirmCancel,
  }
}

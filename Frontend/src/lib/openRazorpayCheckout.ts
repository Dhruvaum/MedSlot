import { loadRazorpayScript } from './loadRazorpayScript'
import { verifyPayment } from '../features/appointment/appointmentService'

interface OpenRazorpayCheckoutParams {
  razorpayKeyId: string
  razorpayOrderId: string
  amount: number
  expiresInMs: number
  onSuccess: () => void
  onFailure: (message: string) => void
  onDismiss: () => void
  onExpire: () => void
}

export const openRazorpayCheckout = async ({
  razorpayKeyId,
  razorpayOrderId,
  amount,
  expiresInMs,
  onSuccess,
  onFailure,
  onDismiss,
  onExpire,
}: OpenRazorpayCheckoutParams) => {
  const scriptLoaded = await loadRazorpayScript()
  if (!scriptLoaded) {
    onFailure('Could not load payment gateway. Please try again')
    return
  }

  let expired = false

  const options = {
    key: razorpayKeyId,
    amount: Math.round(amount * 100),
    currency: 'INR',
    name: 'MedSlot',
    description: 'Consultation Fee',
    order_id: razorpayOrderId,
    handler: async (response: any) => {
      try {
        await verifyPayment({
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        })
        onSuccess()
      } catch {
        onFailure('Payment succeeded but confirmation failed')
      }
    },
    modal: {
      ondismiss: () => {
        if (!expired) onDismiss()
      },
    },
  }

  const razorpay = new window.Razorpay(options)
  razorpay.open()

  setTimeout(() => {
    expired = true
    razorpay.close()
    onExpire()
  }, Math.max(expiresInMs, 0))
}

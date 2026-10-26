import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { getPendingVerifications, verifyDoctor } from '../../features/admin/adminService'
import type { PendingDoctorVerificationSummary } from '../../features/admin/types'

export const usePendingDoctors = () => {
  const [doctors, setDoctors] = useState<PendingDoctorVerificationSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [verifyingId, setVerifyingId] = useState<string | null>(null)

  const loadDoctors = () => {
    setIsLoading(true)
    getPendingVerifications()
      .then(setDoctors)
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    loadDoctors()
  }, [])

  const handleVerify = async (doctorId: string) => {
    setVerifyingId(doctorId)
    try {
      await verifyDoctor(doctorId)
      toast.success('Doctor verified')
      loadDoctors()
    } catch {
      toast.error('Could not verify this doctor. Please try again.')
    } finally {
      setVerifyingId(null)
    }
  }

  return { doctors, isLoading, verifyingId, handleVerify }
}

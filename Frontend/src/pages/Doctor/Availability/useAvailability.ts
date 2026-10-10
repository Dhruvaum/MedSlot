import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { getDoctorAvailability, setDoctorAvailability } from '../../../features/doctor/doctorService'
import type { DayAvailability } from '../../../features/doctor/types'
import { DAY_LABELS, type DayOfWeek } from '../../../types/common'

export const DAY_ORDER: DayOfWeek[] = [0, 1, 2, 3, 4, 5, 6]

const emptyDay = (dayOfWeek: DayOfWeek): DayAvailability => ({
  dayOfWeek,
  isOff: true,
  startTime: '09:00',
  endTime: '17:00',
  breakStartTime: null,
  breakEndTime: null,
})

export const useAvailability = () => {
  const [days, setDays] = useState<DayAvailability[]>(DAY_ORDER.map(emptyDay))
  const [consultDurationMinutes, setConsultDurationMinutes] = useState<number | ''>('')
  const [isNewSetup, setIsNewSetup] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const loadAvailability = async () => {
    const res = await getDoctorAvailability()
    if (res.consultDurationMinutes != null) {
      setIsNewSetup(false)
      setConsultDurationMinutes(res.consultDurationMinutes)
    }
    if (res.days?.length) {
      setDays(res.days)
    }
  }

  useEffect(() => {
    loadAvailability().finally(() => setIsLoading(false))
  }, [])

  const updateDay = (dayOfWeek: DayOfWeek, patch: Partial<DayAvailability>) => {
    setDays((prev) => prev.map((d) => (d.dayOfWeek === dayOfWeek ? { ...d, ...patch } : d)))
  }

  const toggleBreak = (dayOfWeek: DayOfWeek, hasBreak: boolean) => {
    updateDay(dayOfWeek, hasBreak
      ? { breakStartTime: '13:00', breakEndTime: '14:00' }
      : { breakStartTime: null, breakEndTime: null })
  }

  const applyToAllDays = (source: DayAvailability) => {
    setDays((prev) => prev.map((d) => ({
      ...d,
      isOff: source.isOff,
      startTime: source.startTime,
      endTime: source.endTime,
      breakStartTime: source.breakStartTime,
      breakEndTime: source.breakEndTime,
    })))
    toast.success(`${DAY_LABELS[source.dayOfWeek]}'s hours applied to every day`)
  }

  const handleSave = async () => {
    if (!consultDurationMinutes || consultDurationMinutes <= 0) {
      toast.error('Enter a consultation duration before saving')
      return
    }

    setIsSaving(true)
    try {
      // Backend expects TimeOnly? as "HH:mm:ss" or JSON null.
      const toApiTime = (value: string | null) => {
        if (!value) return null
        return value.split(':').length >= 3 ? value : `${value}:00`
      }

      const payloadDays = days.map((d) => ({
        ...d,
        startTime: toApiTime(d.startTime),
        endTime: toApiTime(d.endTime),
        breakStartTime: toApiTime(d.breakStartTime),
        breakEndTime: toApiTime(d.breakEndTime),
      }))

      await setDoctorAvailability({ days: payloadDays, consultDurationMinutes })
      await loadAvailability()
      toast.success('Availability saved')
    } catch {
      toast.error('Could not save availability, please try again')
    } finally {
      setIsSaving(false)
    }
  }

  return {
    days,
    consultDurationMinutes,
    setConsultDurationMinutes,
    isNewSetup,
    isLoading,
    isSaving,
    updateDay,
    toggleBreak,
    applyToAllDays,
    handleSave,
    emptyDay,
  }
}

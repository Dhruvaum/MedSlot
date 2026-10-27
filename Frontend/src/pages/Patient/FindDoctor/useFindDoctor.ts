import { useEffect, useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { getDoctorsListing, getAllSpecializations, getAllQualifications } from '../../../features/doctor/doctorService'
import { ViewDoctorProfile } from '../../../features/doctor/doctorService'
import type { DoctorSummaryResponse, ViewDoctorProfileResponse, SpecializationOptions, QualificationOptions } from '../../../features/doctor/types'
import { getAvailableSlots, bookAppointment } from '../../../features/appointment/appointmentService'
import type { AvailableSlot } from '../../../features/appointment/types'
import { openRazorpayCheckout } from '@/lib/openRazorpayCheckout'

const PAGE_SIZE = 9

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

export const useFindDoctor = () => {
  // Center panel — doctor listing
  const [doctors, setDoctors] = useState<DoctorSummaryResponse[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [pageNumber, setPageNumber] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [isLoadingList, setIsLoadingList] = useState(true)

  // Filters
  const [specializations, setSpecializations] = useState<SpecializationOptions[]>([])
  const [qualifications, setQualifications] = useState<QualificationOptions[]>([])
  const [specializationId, setSpecializationId] = useState<string | undefined>(undefined)
  const [qualificationId, setQualificationId] = useState<string | undefined>(undefined)
  const [maxConsultationFee, setMaxConsultationFee] = useState<number | undefined>(undefined)

  // Right panel — doctor detail
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null)
  const [doctorDetail, setDoctorDetail] = useState<ViewDoctorProfileResponse | null>(null)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)

  // Left panel — booking
  const [bookingDoctorId, setBookingDoctorId] = useState<string | null>(null)
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null)
  const [patientConcern, setPatientConcern] = useState('')
  const [isBooking, setIsBooking] = useState(false)

  useEffect(() => {
    getAllSpecializations().then(setSpecializations)
    getAllQualifications().then(setQualifications)
  }, [])

  useEffect(() => {
    setIsLoadingList(true)
    getDoctorsListing({
      search: search || undefined,
      specializationId,
      qualificationId,
      maxConsultationFee,
      pageNumber,
      pageSize: PAGE_SIZE,
    })
      .then((response) => {
        setDoctors(response.items)
        setTotalPages(response.totalPages)
      })
      .finally(() => setIsLoadingList(false))
  }, [search, specializationId, qualificationId, maxConsultationFee, pageNumber])

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault()
    setPageNumber(1)
    setSearch(searchInput.trim())
  }

  const handleSpecializationChange = (specializationId: string | undefined) => {
    setPageNumber(1)
    setSpecializationId(specializationId)
  }

  const handleQualificationChange = (qualificationId: string | undefined) => {
    setPageNumber(1)
    setQualificationId(qualificationId)
  }

  const handleMaxFeeChange = (maxFee: number | undefined) => {
    setPageNumber(1)
    setMaxConsultationFee(maxFee)
  }

  const loadDoctorDetail = (doctorId: string) => {
    setIsLoadingDetail(true)
    ViewDoctorProfile(doctorId)
      .then((response) => setDoctorDetail(response))
      .finally(() => setIsLoadingDetail(false))
  }

  const handleViewDetail = (doctorId: string) => {
    setSelectedDoctorId(doctorId)
    loadDoctorDetail(doctorId)
  }

  const handleBookNow = (doctorId: string) => {
    setSelectedDoctorId(doctorId)
    loadDoctorDetail(doctorId)

    setBookingDoctorId(doctorId)
    setSelectedDate(undefined)
    setSelectedSlotId(null)
    setPatientConcern('')

    setIsLoadingSlots(true)
    getAvailableSlots(doctorId)
      .then((response) => setAvailableSlots(response))
      .finally(() => setIsLoadingSlots(false))
  }

  const availableDates = Array.from(
    new Map(
      availableSlots.map((slot) => {
        const date = new Date(slot.startTime)
        date.setHours(0, 0, 0, 0)
        return [date.getTime(), date]
      })
    ).values()
  )

  const slotsForSelectedDate = selectedDate
    ? availableSlots.filter((slot) => sameDay(new Date(slot.startTime), selectedDate))
    : []

  const handleSelectDate = (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedSlotId(null)
  }

  const handleConfirmBooking = async () => {
    if (!selectedSlotId) {
      toast.error('Select a time slot before confirming')
      return
    }

    setIsBooking(true)
    try {
      const booking = await bookAppointment({ timeSlotId: selectedSlotId, patientConcern: patientConcern || undefined })

      await openRazorpayCheckout({
        razorpayKeyId: booking.razorpayKeyId,
        razorpayOrderId: booking.razorpayOrderId,
        amount: booking.amount,
        expiresInMs: 10 * 60 * 1000,
        onSuccess: () => {
          toast.success('Appointment booked and payment confirmed')
          setSelectedSlotId(null)
          setPatientConcern('')
          if (bookingDoctorId) getAvailableSlots(bookingDoctorId).then((res) => setAvailableSlots(res))
        },
        onFailure: (message) => toast.error(message),
        onDismiss: () => toast.info('Payment not completed - your slot will expire automatically if unpaid'),
        onExpire: () => toast.error('Your booking session has expired. Please try again.'),
      })
    }

    catch {
      toast.error('This slot was just booked by someone else — pick another one')
      if (bookingDoctorId) {
        getAvailableSlots(bookingDoctorId).then((response) => setAvailableSlots(response))
      }
      setSelectedSlotId(null)
    }
    
    finally {
      setIsBooking(false)
    }
  }

  return {
    doctors,
    totalPages,
    pageNumber,
    setPageNumber,
    searchInput,
    setSearchInput,
    isLoadingList,
    handleSearchSubmit,

    specializations,
    qualifications,
    specializationId,
    qualificationId,
    maxConsultationFee,
    handleSpecializationChange,
    handleQualificationChange,
    handleMaxFeeChange,

    selectedDoctorId,
    doctorDetail,
    isLoadingDetail,
    handleViewDetail,

    bookingDoctorId,
    availableSlots,
    availableDates,
    slotsForSelectedDate,
    isLoadingSlots,
    selectedDate,
    handleSelectDate,
    selectedSlotId,
    setSelectedSlotId,
    patientConcern,
    setPatientConcern,
    isBooking,
    handleBookNow,
    handleConfirmBooking,
  }
}

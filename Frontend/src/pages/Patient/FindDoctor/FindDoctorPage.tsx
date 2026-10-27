import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import Page from '../../../components/Page'
import DoctorCard from './components/DoctorCard'
import BookingPanel from './components/BookingPanel'
import DoctorDetailPanel from './components/DoctorDetailPanel'
import { Slider } from '../../../components/ui/slider'
import { useFindDoctor } from './useFindDoctor'

const MAX_FEE_CEILING = 2000

const FindDoctorPage = () => {
  const {
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
  } = useFindDoctor()

  return (
    <Page title="Find a Doctor - MedSlot">
      <div className="mx-auto w-full max-w-350">
        <h1 className="text-2xl font-bold text-slate-800">Find a Doctor</h1>
        <p className="mt-1 text-sm text-slate-500">Search verified doctors and book an appointment.</p>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr_320px]">
          {/* Left — Booking panel */}
          <div className="order-2 flex min-h-[80vh] flex-col lg:order-1">
            <BookingPanel
              isBookingActive={!!bookingDoctorId}
              isLoadingSlots={isLoadingSlots}
              availableDates={availableDates}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
              slotsForSelectedDate={slotsForSelectedDate}
              selectedSlotId={selectedSlotId}
              onSelectSlot={setSelectedSlotId}
              patientConcern={patientConcern}
              onPatientConcernChange={setPatientConcern}
              isBooking={isBooking}
              onConfirmBooking={handleConfirmBooking}
            />
          </div>

          {/* Center — Doctor listing */}
          <div className="order-1 lg:order-2">
            <form onSubmit={handleSearchSubmit} className="flex gap-3">
              <div className="relative flex-1">
                <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by doctor name..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-brand"
                />
              </div>
              <button
                type="submit"
                className="rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 hover:cursor-pointer"
              >
                Search
              </button>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3">
              <select
                value={specializationId ?? ''}
                onChange={(e) => handleSpecializationChange(e.target.value || undefined)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none transition focus:border-brand"
              >
                <option value="">All Specializations</option>
                {specializations.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>

              <select
                value={qualificationId ?? ''}
                onChange={(e) => handleQualificationChange(e.target.value || undefined)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none transition focus:border-brand"
              >
                <option value="">All Qualifications</option>
                {qualifications.map((q) => (
                  <option key={q.id} value={q.id}>{q.name}</option>
                ))}
              </select>

              <div className="flex min-w-55 flex-1 items-center gap-3">
                <span className="shrink-0 text-xs font-medium text-slate-500">
                  Max fee: {maxConsultationFee ? `Rs ${maxConsultationFee}` : 'Any'}
                </span>
                <Slider
                  value={[maxConsultationFee ?? MAX_FEE_CEILING]}
                  max={MAX_FEE_CEILING}
                  step={50}
                  onValueChange={([value]) => handleMaxFeeChange(value === MAX_FEE_CEILING ? undefined : value)}
                  className="flex-1 cursor-pointer"
                />
              </div>
            </div>

            <div className="mt-6">
              {isLoadingList ? (
                <div className="py-20 text-center text-sm text-slate-400">Loading doctors...</div>
              ) : doctors.length === 0 ? (
                <div className="py-20 text-center text-sm text-slate-400">No doctors found.</div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {doctors.map((doctor) => (
                    <DoctorCard
                      key={doctor.id}
                      doctor={doctor}
                      isSelected={selectedDoctorId === doctor.id}
                      isBooking={bookingDoctorId === doctor.id}
                      onViewDetail={handleViewDetail}
                      onBookNow={handleBookNow}
                    />
                  ))}
                </div>
              )}
            </div>

            {!isLoadingList && doctors.length > 0 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  type="button"
                  disabled={pageNumber === 1}
                  onClick={() => setPageNumber((prev) => prev - 1)}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer disabled:hover:border-slate-200 disabled:hover:text-slate-600"
                >
                  <ChevronLeft size={16} />
                  Prev
                </button>
                <span className="text-sm text-slate-500">
                  Page {pageNumber} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={pageNumber === totalPages}
                  onClick={() => setPageNumber((prev) => prev + 1)}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer disabled:hover:border-slate-200 disabled:hover:text-slate-600"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Right — Doctor detail */}
          <div className="order-3 flex min-h-[80vh] flex-col">
            <DoctorDetailPanel isLoading={isLoadingDetail} doctor={doctorDetail} />
          </div>
        </div>
      </div>
    </Page>
  )
}

export default FindDoctorPage

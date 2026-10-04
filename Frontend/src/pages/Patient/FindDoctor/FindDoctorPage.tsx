import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Search, Stethoscope, MapPin, GraduationCap, ChevronLeft, ChevronRight } from 'lucide-react'
import Page from '../../../components/Page'
import { getDoctorsListing } from '../../../features/doctor/doctorService'
import type { DoctorSummaryResponse } from '../../../features/doctor/types'

const PAGE_SIZE = 9

const FindDoctorPage = () => {
  const [doctors, setDoctors] = useState<DoctorSummaryResponse[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [pageNumber, setPageNumber] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    getDoctorsListing({ search: search || undefined, pageNumber, pageSize: PAGE_SIZE })
      .then((response) => {
        setDoctors(response.items)
        setTotalPages(response.totalPages)
      })
      .finally(() => setIsLoading(false))
  }, [search, pageNumber])

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault()
    setPageNumber(1)
    setSearch(searchInput.trim())
  }

  return (
    <Page title="Find a Doctor - MedSlot">
      <div className="mx-auto w-4/5">
        <h1 className="text-2xl font-bold text-slate-800">Find a Doctor</h1>
        <p className="mt-1 text-sm text-slate-500">Search verified doctors and book an appointment.</p>

        <form onSubmit={handleSearchSubmit} className="mt-6 flex gap-3">
          <div className="relative flex-1">
            <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              autoFocus
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

        <div className="mt-8">
          {isLoading ? (
            <div className="py-20 text-center text-sm text-slate-400">Loading doctors...</div>
          ) : doctors.length === 0 ? (
            <div className="py-20 text-center text-sm text-slate-400">No doctors found.</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {doctors.map((doctor) => (
                <Link
                  key={doctor.id}
                  to={`/patient/find-doctor/${doctor.id}`}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:border-brand hover:shadow-md cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand/10">
                      <Stethoscope size={22} className="text-brand" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-slate-800">{doctor.fullName}</h2>
                      {doctor.specializationName && (
                        <span className="text-xs font-medium text-brand">{doctor.specializationName}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 text-sm text-slate-500">
                    {doctor.qualificationName && (
                      <div className="flex items-center gap-2">
                        <GraduationCap size={16} className="shrink-0 text-slate-400" />
                        <span>{doctor.qualificationName}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="shrink-0 text-slate-400" />
                      <span className="line-clamp-1">{doctor.workAddress}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {!isLoading && doctors.length > 0 && (
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
    </Page>
  )
}

export default FindDoctorPage

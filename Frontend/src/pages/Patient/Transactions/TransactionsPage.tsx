import { Receipt, CalendarClock, User, Hash, MessageSquare, ChevronLeft, ChevronRight, IndianRupee, Undo2 } from 'lucide-react'
import Page from '../../../components/Page'
import { useTransactions } from './useTransactions'

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })

const statusStyles: Record<string, string> = {
  Created: 'bg-blue-50 text-blue-600',
  Captured: 'bg-brand/10 text-brand',
  Failed: 'bg-orange-50 text-orange-600',
  Refunded: 'bg-slate-100 text-slate-600',
  PartiallyRefunded: 'bg-amber-50 text-amber-600',
}

const statusBarStyles: Record<string, string> = {
  Created: 'bg-blue-400',
  Captured: 'bg-brand',
  Failed: 'bg-orange-400',
  Refunded: 'bg-slate-300',
  PartiallyRefunded: 'bg-amber-400',
}

const TransactionsPage = () => {
  const {
    transactions,
    totalPages,
    pageNumber,
    setPageNumber,
    isLoading,
    statusOptions,
    paymentStatus,
    date,
    handleStatusChange,
    handleDateChange,
    clearFilters,
  } = useTransactions()

  const hasFilters = !!paymentStatus || !!date

  return (
    <Page title="Transactions - MedSlot">
      <div className="mx-auto w-4/5">
        <h1 className="text-2xl font-bold text-slate-800">Transactions</h1>
        <p className="mt-1 text-sm text-slate-500">Track every payment made for your appointments.</p>

        <div className="mt-6 flex flex-wrap items-end gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Status</label>
            <select
              value={paymentStatus ?? ''}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-brand"
            >
              <option value="">All statuses</option>
              {statusOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Date</label>
            <input
              type="date"
              value={date ?? ''}
              onChange={(e) => handleDateChange(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-brand"
            />
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:text-brand hover:cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="mt-6">
          {isLoading ? (
            <div className="py-20 text-center text-sm text-slate-400">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <Receipt size={32} className="text-slate-300" />
              <p className="text-sm text-slate-400">
                {hasFilters ? 'No transactions match these filters.' : "You don't have any transactions yet."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {transactions.map((transaction) => {
                const isRefund = transaction.transactionStatus === 'Refunded' || transaction.transactionStatus === 'PartiallyRefunded'

                return (
                <div
                  key={transaction.id}
                  className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 pl-7 shadow-sm"
                >
                  <div
                    className={`absolute inset-y-0 left-0 w-1.5 ${
                      statusBarStyles[transaction.transactionStatus] ?? 'bg-slate-200'
                    }`}
                  />

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/10">
                        <User size={20} className="text-brand" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-slate-800">{transaction.doctorName}</h2>
                        <span
                          className={`mt-1 inline-block w-fit rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            statusStyles[transaction.transactionStatus] ?? 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {transaction.transactionStatus}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <div
                        className={`flex items-center justify-end gap-0.5 text-xl font-bold ${
                          isRefund ? 'text-emerald-600' : 'text-slate-800'
                        }`}
                      >
                        {isRefund && <span>+</span>}
                        <IndianRupee size={17} className={isRefund ? 'text-emerald-500' : 'text-slate-500'} />
                        {transaction.transactionAmount}
                      </div>
                      <div className="text-xs text-slate-400">{isRefund ? 'Refunded' : 'Amount'}</div>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-5 border-t border-slate-100 pt-4 sm:grid-cols-2">
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Appointment</p>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <CalendarClock size={15} className="shrink-0 text-slate-400" />
                        {formatDateTime(transaction.slotStartTime)} – {formatTime(transaction.slotEndTime)}
                      </div>
                      {transaction.concern && (
                        <div className="mt-2 flex items-start gap-2 text-sm text-slate-500">
                          <MessageSquare size={15} className="mt-0.5 shrink-0 text-slate-400" />
                          <span className="line-clamp-2">{transaction.concern}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        {isRefund ? 'Refund' : 'Payment'}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        {isRefund ? (
                          <Undo2 size={15} className="shrink-0 text-slate-400" />
                        ) : (
                          <Receipt size={15} className="shrink-0 text-slate-400" />
                        )}
                        {isRefund ? 'Refunded on' : 'Paid on'} {formatDate(transaction.transactionDate)}
                      </div>
                      {transaction.referenceNumber && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                          <Hash size={15} className="shrink-0 text-slate-400" />
                          Ref: {transaction.referenceNumber}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                )
              })}
            </div>
          )}

          {!isLoading && transactions.length > 0 && (
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
      </div>
    </Page>
  )
}

export default TransactionsPage

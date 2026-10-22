interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  isConfirming?: boolean
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  isConfirming = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-6 shadow-lg">
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        <p className="mt-2 text-sm text-slate-500">{description}</p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isConfirming}
            className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            Go Back
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className="flex-1 rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            {isConfirming ? 'Cancelling...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog

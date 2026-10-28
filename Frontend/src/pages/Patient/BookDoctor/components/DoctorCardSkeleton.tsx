import { Skeleton } from '../../../../components/ui/skeleton'

const DoctorCardSkeleton = () => {
  return (
    <div className="flex w-72 flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-slate-100 pt-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-36" />
        <Skeleton className="h-3 w-28" />
      </div>

      <div className="flex gap-2 pt-1">
        <Skeleton className="h-9 flex-1 rounded-xl" />
        <Skeleton className="h-9 flex-1 rounded-xl" />
      </div>
    </div>
  )
}

export default DoctorCardSkeleton

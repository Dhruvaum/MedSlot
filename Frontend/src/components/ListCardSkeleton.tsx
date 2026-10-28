import { Skeleton } from './ui/skeleton'

const ListCardSkeleton = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 pl-7 shadow-sm">
      <Skeleton className="absolute inset-y-0 left-0 w-1.5 rounded-none" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
    </div>
  )
}

export default ListCardSkeleton

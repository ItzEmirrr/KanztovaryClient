import { cn } from '../../lib/utils'

interface SkeletonProps { className?: string; style?: React.CSSProperties }

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse bg-stone-200 rounded', className)} style={style} />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="w-full rounded-lg" style={{ aspectRatio: '4/5' }} />
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  )
}

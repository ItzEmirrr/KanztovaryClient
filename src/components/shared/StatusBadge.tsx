import { cn, STATUS_MAP } from '../../lib/utils'

interface Props { status: string; className?: string }

export function StatusBadge({ status, className }: Props) {
  const info = STATUS_MAP[status] ?? { label: status, color: 'bg-gray-100 text-gray-700' }
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', info.color, className)}>
      {info.label}
    </span>
  )
}

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Pencil, Trash2 } from 'lucide-react'
import type { Review } from '../../types'
import { StarDisplay } from './StarDisplay'
import { formatDate } from '../../lib/utils'

// Pastel palette — 6 colours, picked by userId % 6
const AVATAR_PALETTE = [
  { bg: '#fde8d8', text: '#c2410c' },
  { bg: '#dbeafe', text: '#1d4ed8' },
  { bg: '#dcfce7', text: '#15803d' },
  { bg: '#fce7f3', text: '#be185d' },
  { bg: '#ede9fe', text: '#6d28d9' },
  { bg: '#fef9c3', text: '#92400e' },
]

// Rotation classes that alternate via modulo
const ROTATIONS = [
  '-rotate-1',
  'rotate-[0.5deg]',
  '-rotate-[0.3deg]',
  'rotate-[0.8deg]',
  '-rotate-[0.6deg]',
  'rotate-[0.2deg]',
]

interface Props {
  review: Review
  index: number
  isOwn: boolean
  onEdit: () => void
  onDelete: () => void
}

export function ReviewCard({ review, index, isOwn, onEdit, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false)

  const palette = AVATAR_PALETTE[review.userId % 6]
  const rotation = ROTATIONS[index % ROTATIONS.length]
  const initial = review.username[0]?.toUpperCase() ?? '?'
  const isLong = (review.comment?.length ?? 0) > 200
  const displayComment =
    !expanded && isLong ? review.comment!.slice(0, 200) + '…' : (review.comment ?? '')

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.4) }}
      className={`relative group bg-white border border-[#e7e5e0] rounded-2xl p-5 shadow-sm
        hover:shadow-md hover:rotate-0 transition-all duration-300 ${rotation}`}
    >
      {/* Own-review actions — appear on hover */}
      {isOwn && (
        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg hover:bg-[#f5f0e8] text-[#78716c] hover:text-[#1e3a5f] transition-colors"
            aria-label="Редактировать"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg hover:bg-red-50 text-[#78716c] hover:text-red-500 transition-colors"
            aria-label="Удалить"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header row */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 select-none"
          style={{ background: palette.bg, color: palette.text }}
        >
          {initial}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#1c1917] truncate">{review.username}</p>
          <p className="text-xs text-[#78716c]">{formatDate(review.createdAt)}</p>
        </div>
      </div>

      {/* Stars */}
      <StarDisplay rating={review.rating} size={16} />

      {/* Comment */}
      {review.comment && (
        <div className="mt-3">
          <p className="text-sm text-[#1c1917] leading-relaxed">{displayComment}</p>
          {isLong && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-1 text-xs text-[#1e3a5f] font-medium hover:underline"
            >
              {expanded ? 'Свернуть' : 'Читать далее'}
            </button>
          )}
        </div>
      )}

      {/* Own badge */}
      {isOwn && (
        <span className="absolute bottom-3 right-3 text-[10px] font-semibold text-[#1e3a5f] bg-[#e8f0f8] px-2 py-0.5 rounded-full">
          Мой отзыв
        </span>
      )}
    </motion.div>
  )
}

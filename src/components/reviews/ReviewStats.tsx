import { motion } from 'framer-motion'
import type { ReviewStats as StatsType } from '../../types'
import { StarDisplay } from './StarDisplay'

interface Props {
  stats: StatsType
}

const BAR_COLORS = [
  'from-[#1e3a5f] to-[#2d5282]',   // 5★
  'from-[#2d5282] to-[#3b6ba5]',   // 4★
  'from-[#3b6ba5] to-[#6b93c4]',   // 3★
  'from-[#6b93c4] to-[#a8c4df]',   // 2★
  'from-[#a8c4df] to-[#d4e5f0]',   // 1★
]

export function ReviewStats({ stats }: Props) {
  const { averageRating, totalReviews, distribution } = stats
  const maxCount = Math.max(...Object.values(distribution), 1)

  return (
    <div className="w-full bg-white border border-[#e7e5e0] rounded-3xl p-8 mb-10">
      <div className="flex flex-col md:flex-row items-center md:items-stretch gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-[#e7e5e0]">

        {/* Left — big average */}
        <div className="flex flex-col items-center justify-center md:pr-10 gap-2 w-full md:w-auto">
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring', bounce: 0.35 }}
            className="font-serif font-bold text-[#1c1917] leading-none"
            style={{ fontSize: 96 }}
          >
            {averageRating.toFixed(1)}
          </motion.span>
          <StarDisplay rating={averageRating} size={28} />
          <p className="text-sm text-[#78716c] mt-1">средняя оценка</p>
        </div>

        {/* Center — distribution bars */}
        <div className="flex-1 flex flex-col justify-center gap-2 md:px-10 w-full pt-6 md:pt-0">
          {[5, 4, 3, 2, 1].map((star, idx) => {
            const count = distribution[String(star)] ?? 0
            const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0
            const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0

            return (
              <div key={star} className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[#78716c] w-5 text-right shrink-0">
                  {star}
                </span>
                <svg width="14" height="14" viewBox="0 0 20 20" className="shrink-0">
                  <path
                    d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.27l-4.94 2.43.94-5.49-4-3.9 5.53-.8z"
                    fill="#1e3a5f"
                    opacity={0.4 + idx * 0.1}
                  />
                </svg>
                <div className="flex-1 h-3 bg-[#f5f0e8] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ duration: 0.7, delay: idx * 0.08, ease: 'easeOut' }}
                    className={`h-full rounded-full bg-gradient-to-r ${BAR_COLORS[idx]}`}
                  />
                </div>
                <span className="text-xs text-[#78716c] w-8 text-right shrink-0">
                  {pct.toFixed(0)}%
                </span>
              </div>
            )
          })}
        </div>

        {/* Right — total count */}
        <div className="flex flex-col items-center justify-center md:pl-10 gap-1 w-full md:w-auto pt-6 md:pt-0">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="font-serif font-bold text-[#1e3a5f] text-5xl leading-none"
          >
            {totalReviews}
          </motion.span>
          <p className="text-sm text-[#78716c] text-center mt-1">
            покупателей<br />доверяют нам
          </p>
        </div>

      </div>
    </div>
  )
}

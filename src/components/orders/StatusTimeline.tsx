import { motion } from 'framer-motion'
import type { OrderStatusHistory } from '../../types'
import { formatDateTime, STATUS_MAP } from '../../lib/utils'

interface Props { history: OrderStatusHistory[] }

export function StatusTimeline({ history }: Props) {
  return (
    <div className="relative pl-6">
      <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-divider" />
      <div className="space-y-6">
        {history.map((entry, i) => {
          const info = STATUS_MAP[entry.newStatus] ?? { label: entry.newStatus, color: 'bg-gray-200' }
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              <div className={`absolute -left-4 top-1 w-3 h-3 rounded-full border-2 border-white ${info.color.split(' ')[0]}`} />
              <div className="ml-2">
                <p className="text-sm font-semibold text-[#1c1917]">
                  {entry.previousStatus === null ? 'Заказ оформлен' : info.label}
                </p>
                <p className="text-xs text-[#78716c]">{formatDateTime(entry.changedAt)}</p>
                <p className="text-xs text-[#78716c]">{entry.changedBy}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

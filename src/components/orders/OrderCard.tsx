import { Link } from 'react-router-dom'
import { Store, Truck } from 'lucide-react'
import type { Order } from '../../types'
import { formatDate, formatPrice } from '../../lib/utils'
import { getImageUrl } from '../../lib/utils'
import { StatusBadge } from '../shared/StatusBadge'

interface Props { order: Order }

export function OrderCard({ order }: Props) {
  const firstImages = order.items.slice(0, 3)
  const extra = order.items.length - 3

  return (
    <div className="bg-white border border-divider rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <span className="font-serif font-semibold text-[#1c1917]">Заказ #{order.id}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#78716c]">{formatDate(order.createdAt)}</span>
          <StatusBadge status={order.status} />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        {firstImages.map((item, i) => (
          <div key={i} className="w-14 h-14 rounded-lg overflow-hidden bg-[#f5f0e8] shrink-0">
            <img
              src={getImageUrl(item.product?.images?.find((img) => img.isMain)?.imageUrl)}
              alt={item.productName}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {extra > 0 && (
          <div className="w-14 h-14 rounded-lg bg-[#f5f0e8] flex items-center justify-center text-sm text-[#78716c] font-medium shrink-0">
            +{extra}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-sm text-[#78716c]">
          {order.deliveryType === 'PICKUP' ? (
            <><Store className="w-4 h-4" /> Самовывоз</>
          ) : (
            <><Truck className="w-4 h-4" /> Доставка</>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="font-semibold text-[#1c1917]">{formatPrice(order.grandTotal)}</span>
          <Link
            to={`/orders/${order.id}`}
            className="text-sm text-[#1e3a5f] hover:underline font-medium"
          >
            Подробнее →
          </Link>
        </div>
      </div>
    </div>
  )
}

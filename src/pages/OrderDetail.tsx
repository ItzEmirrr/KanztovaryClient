import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Store, Truck, ArrowLeft } from 'lucide-react'
import { useOrder } from '../hooks/useOrders'
import { StatusBadge } from '../components/shared/StatusBadge'
import { StatusTimeline } from '../components/orders/StatusTimeline'
import { getImageUrl, formatDate, formatPrice } from '../lib/utils'
import { Skeleton } from '../components/shared/Skeleton'

export function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: order, isLoading } = useOrder(Number(id))

  useEffect(() => {
    if (order) document.title = `Заказ #${order.id} — Канцтовары`
  }, [order])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10 space-y-6">
        {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
      </div>
    )
  }

  if (!order) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <p className="text-[#78716c]">Заказ не найден</p>
      <Link to="/orders" className="text-[#1e3a5f] hover:underline mt-2 inline-block">← Мои заказы</Link>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-10">
      <Link to="/orders" className="flex items-center gap-1.5 text-sm text-[#78716c] hover:text-[#1e3a5f] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Мои заказы
      </Link>

      <div className="flex flex-wrap items-center gap-3 mb-8">
        <h1 className="font-serif text-3xl font-semibold text-[#1c1917]">Заказ #{order.id}</h1>
        <StatusBadge status={order.status} />
        <span className="text-sm text-[#78716c]">{formatDate(order.createdAt)}</span>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Delivery */}
          <div className="bg-white border border-divider rounded-xl p-5">
            <h2 className="font-semibold text-[#1c1917] mb-4 flex items-center gap-2">
              {order.deliveryType === 'PICKUP'
                ? <><Store className="w-5 h-5 text-[#1e3a5f]" /> Самовывоз</>
                : <><Truck className="w-5 h-5 text-[#1e3a5f]" /> Доставка</>}
            </h2>
            <div className="text-sm text-[#78716c] space-y-1">
              <p>{order.deliveryAddress ?? 'Самoвывоз из магазина: г. Бишкек, ул. Киевская 96Б'}</p>
              <p>Телефон: {order.phoneNumber}</p>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white border border-divider rounded-xl overflow-hidden">
            <div className="p-5 border-b border-divider">
              <h2 className="font-semibold text-[#1c1917]">Позиции заказа</h2>
            </div>
            <div className="divide-y divide-divider">
              {order.items.map((item, i) => (
                <div key={i} className="p-4 flex items-center gap-4">
                  <img
                    src={getImageUrl(item.product?.images?.find((img) => img.isMain)?.imageUrl)}
                    alt={item.productName}
                    className="w-14 h-14 object-cover rounded-lg shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1c1917] line-clamp-2">{item.productName}</p>
                  </div>
                  <div className="text-sm text-[#78716c] text-right shrink-0">
                    <p>× {item.quantity}</p>
                    <p>{formatPrice(item.price)}</p>
                  </div>
                  <div className="text-sm font-semibold text-[#1c1917] shrink-0 w-24 text-right">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-5 border-t border-divider space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#78716c]">Товары</span>
                <span>{formatPrice(order.totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78716c]">Доставка</span>
                <span>{order.deliveryFee > 0 ? formatPrice(order.deliveryFee) : 'Бесплатно'}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-1 border-t border-divider">
                <span>К оплате</span>
                <span className="text-[#1e3a5f]">{formatPrice(order.grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white border border-divider rounded-xl p-5">
          <h2 className="font-semibold text-[#1c1917] mb-5">История статусов</h2>
          <StatusTimeline history={order.statusHistory} />
        </div>
      </div>
    </div>
  )
}

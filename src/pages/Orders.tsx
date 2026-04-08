import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PackageSearch } from 'lucide-react'
import { useOrders } from '../hooks/useOrders'
import { OrderCard } from '../components/orders/OrderCard'
import { Pagination } from '../components/shared/Pagination'
import { Skeleton } from '../components/shared/Skeleton'

const STATUS_OPTIONS = [
  { value: '', label: 'Все статусы' },
  { value: 'NEW', label: 'Новый' },
  { value: 'IN_PROGRESS', label: 'В работе' },
  { value: 'COMPLETED', label: 'Выполнен' },
  { value: 'CANCELLED', label: 'Отменён' },
]

export function Orders() {
  const [searchParams, setSearchParams] = useSearchParams()
  const status = searchParams.get('status') ?? ''
  const page = Number(searchParams.get('page') ?? '0')

  const { data, isLoading } = useOrders({ status: status || undefined, page, size: 10 })

  useEffect(() => {
    document.title = 'Мои заказы — Stationery'
  }, [])

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams)
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page')
    setSearchParams(params)
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl font-semibold text-[#1c1917] mb-8">Мои заказы</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={status}
          onChange={(e) => updateParam('status', e.target.value || null)}
          className="border border-divider rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f] bg-white"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-36 rounded-xl" />)}
        </div>
      ) : !data || data.orders.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-center">
          <PackageSearch className="w-20 h-20 text-stone-200 mb-4" />
          <h3 className="font-serif text-xl font-semibold text-[#1c1917] mb-2">Заказов нет</h3>
          <p className="text-[#78716c] text-sm">У вас пока нет оформленных заказов</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {data.orders.map((order) => <OrderCard key={order.id} order={order} />)}
          </div>
          <Pagination
            page={page}
            totalPages={data.totalPages}
            onPage={(p) => updateParam('page', p === 0 ? null : String(p))}
          />
        </>
      )}
    </div>
  )
}

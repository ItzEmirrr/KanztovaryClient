import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { getImageUrl, formatPrice } from '../lib/utils'
import { Skeleton } from '../components/shared/Skeleton'

export function Cart() {
  const { cart, isLoading, updateItem, removeItem, clearCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Корзина — Stationery'
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center text-center">
        <ShoppingBag className="w-24 h-24 text-stone-200 mb-6" />
        <h2 className="font-serif text-2xl font-semibold text-[#1c1917] mb-2">Корзина пуста</h2>
        <p className="text-[#78716c] mb-8">Добавьте товары из каталога</p>
        <Link
          to="/catalog"
          className="bg-[#1e3a5f] text-white px-8 py-3 rounded-full font-medium hover:bg-[#2d5282] transition-colors"
        >
          Перейти в каталог
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl font-semibold text-[#1c1917] mb-8">Корзина</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Items */}
        <div className="md:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="bg-white border border-divider rounded-xl p-4 flex gap-4">
              <img
                src={getImageUrl(item.productMainImage)}
                alt={item.productName}
                className="w-20 h-20 object-cover rounded-lg shrink-0"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <Link
                  to={`/catalog/${item.productId}`}
                  className="font-medium text-[#1c1917] hover:text-[#1e3a5f] transition-colors text-sm line-clamp-2"
                >
                  {item.productName}
                </Link>
                <p className="text-xs text-[#78716c] mt-0.5">{item.variantSku ?? item.productSku}</p>
                {item.variantAttributes && Object.entries(item.variantAttributes).length > 0 && (
                  <p className="text-xs text-[#78716c]">
                    {Object.entries(item.variantAttributes).map(([k, v]) => `${k}: ${v}`).join(', ')}
                  </p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-divider rounded-full overflow-hidden">
                    <button
                      onClick={() => item.quantity > 1 && updateItem.mutate({ itemId: item.id, quantity: item.quantity - 1 })}
                      className="w-8 h-8 flex items-center justify-center hover:bg-stone-100"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateItem.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                      className="w-8 h-8 flex items-center justify-center hover:bg-stone-100"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-[#1c1917] text-sm">{formatPrice(item.subtotal)}</span>
                    <button
                      onClick={() => removeItem.mutate(item.id)}
                      className="text-stone-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() => clearCart.mutate()}
            className="flex items-center gap-1.5 text-sm text-[#78716c] hover:text-red-500 transition-colors mt-2"
          >
            <Trash2 className="w-4 h-4" />
            Очистить корзину
          </button>
        </div>

        {/* Summary */}
        <div className="sticky top-24 h-fit bg-white border border-divider rounded-xl p-6">
          <h2 className="font-serif text-xl font-semibold text-[#1c1917] mb-5">Итого</h2>
          <div className="space-y-3 text-sm mb-5">
            <div className="flex justify-between">
              <span className="text-[#78716c]">Позиции ({cart.totalItems})</span>
              <span>{formatPrice(cart.totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#78716c]">Доставка</span>
              <span className="text-[#78716c]">Рассчитывается при оформлении</span>
            </div>
          </div>
          <div className="border-t border-divider pt-4 mb-5">
            <div className="flex justify-between font-bold text-lg">
              <span>Итого к оплате</span>
              <span className="text-[#1e3a5f]">{formatPrice(cart.totalPrice)}</span>
            </div>
            <p className="text-xs text-[#78716c] mt-2">
              {cart.totalPrice >= 10000
                ? '✓ Бесплатная доставка для вашего заказа'
                : `При заказе от 10 000 сом — доставка бесплатно`}
            </p>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-[#1e3a5f] hover:bg-[#2d5282] text-white py-3.5 rounded-full font-medium transition-all"
          >
            Оформить заказ
          </button>
        </div>
      </div>
    </div>
  )
}

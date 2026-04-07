import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Store, Truck, Tag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMutation } from '@tanstack/react-query'
import { cartApi } from '../api/cart'
import { useCart } from '../hooks/useCart'
import { getImageUrl, formatPrice } from '../lib/utils'
import toast from 'react-hot-toast'

interface FormData {
  phoneNumber: string
  deliveryType: 'PICKUP' | 'DELIVERY'
  deliveryAddress?: string
}

export function Checkout() {
  const { cart } = useCart()
  const navigate = useNavigate()
  const [promoCode, setPromoCode] = useState('')

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: { deliveryType: 'PICKUP' },
  })

  const deliveryType = watch('deliveryType')
  const isFreeDelivery = (cart?.totalPrice ?? 0) >= 10000
  const deliveryFeeNum: number = 0 // рассчитывается при подтверждении
  const deliveryFeeLabel =
    deliveryType === 'PICKUP' ? '—'
    : isFreeDelivery ? 'Бесплатно'
    : 'По согласованию'

  const checkout = useMutation({
    mutationFn: cartApi.checkout,
    onSuccess: (order: { id: number }) => {
      navigate(`/checkout/success?orderId=${order.id}`)
    },
    onError: () => toast.error('Не удалось оформить заказ'),
  })

  useEffect(() => {
    document.title = 'Оформление заказа — Stationery'
  }, [])

  function onSubmit(data: FormData) {
    checkout.mutate({
      deliveryType: data.deliveryType,
      deliveryAddress: data.deliveryType === 'DELIVERY' ? data.deliveryAddress : undefined,
      phoneNumber: data.phoneNumber,
    })
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl font-semibold text-[#1c1917] mb-8">Оформление заказа</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="md:col-span-2 space-y-8">
          {/* Step 1 */}
          <section className="bg-white border border-divider rounded-xl p-6">
            <h2 className="font-serif text-lg font-semibold text-[#1c1917] mb-4">Контактные данные</h2>
            <div>
              <label className="block text-sm font-medium text-[#1c1917] mb-1">Номер телефона *</label>
              <input
                {...register('phoneNumber', {
                  required: 'Введите номер телефона',
                  pattern: { value: /^\+?[0-9\s\-()]{10,}$/, message: 'Неверный формат номера' },
                })}
                placeholder="+996 700 000 000"
                className="w-full px-4 py-2.5 border border-divider rounded-lg text-sm focus:outline-none focus:border-[#1e3a5f]"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>
              )}
              <p className="text-xs text-[#78716c] mt-1">Администратор свяжется с вами для подтверждения</p>
            </div>
          </section>

          {/* Step 2 */}
          <section className="bg-white border border-divider rounded-xl p-6">
            <h2 className="font-serif text-lg font-semibold text-[#1c1917] mb-4">Способ получения</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <label className={`relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-colors ${deliveryType === 'PICKUP' ? 'border-[#1e3a5f] bg-blue-50/30' : 'border-divider hover:border-stone-300'}`}>
                <input type="radio" {...register('deliveryType')} value="PICKUP" className="sr-only" />
                <Store className={`w-5 h-5 mb-2 ${deliveryType === 'PICKUP' ? 'text-[#1e3a5f]' : 'text-[#78716c]'}`} />
                <span className="font-semibold text-sm text-[#1c1917]">Самовывоз</span>
                <span className="text-xs text-[#78716c] mt-0.5">Заберите заказ в нашем магазине</span>
                <span className="text-xs text-[#78716c] mt-1">г. Бишкек, ул. Киевская 96Б</span>
                <span className="text-xs text-[#78716c]">Пн–Пт 8:00–17:00</span>
              </label>
              <label className={`relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-colors ${deliveryType === 'DELIVERY' ? 'border-[#1e3a5f] bg-blue-50/30' : 'border-divider hover:border-stone-300'}`}>
                <input type="radio" {...register('deliveryType')} value="DELIVERY" className="sr-only" />
                <Truck className={`w-5 h-5 mb-2 ${deliveryType === 'DELIVERY' ? 'text-[#1e3a5f]' : 'text-[#78716c]'}`} />
                <span className="font-semibold text-sm text-[#1c1917]">Доставка</span>
                <span className="text-xs text-[#78716c] mt-0.5">Доставим по вашему адресу</span>
                {isFreeDelivery
                  ? <span className="text-xs text-green-600 font-medium mt-1">✓ Бесплатно для вашего заказа</span>
                  : <span className="text-xs text-[#78716c] mt-1">Стоимость доставки: По согласованию</span>
                }
              </label>
            </div>

            <AnimatePresence>
              {deliveryType === 'DELIVERY' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="pt-2">
                    <label className="block text-sm font-medium text-[#1c1917] mb-1">Адрес доставки *</label>
                    <textarea
                      {...register('deliveryAddress', {
                        validate: (v) => deliveryType !== 'DELIVERY' || (!!v && v.length > 3) || 'Введите адрес доставки',
                      })}
                      rows={3}
                      placeholder="Город, улица, дом, квартира"
                      className="w-full px-4 py-2.5 border border-divider rounded-lg text-sm focus:outline-none focus:border-[#1e3a5f] resize-none"
                    />
                    {errors.deliveryAddress && (
                      <p className="text-red-500 text-xs mt-1">{errors.deliveryAddress.message}</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <button
            type="submit"
            disabled={checkout.isPending}
            className="w-full bg-[#1e3a5f] hover:bg-[#2d5282] disabled:bg-stone-300 text-white py-4 rounded-full font-medium text-base transition-all"
          >
            {checkout.isPending ? 'Оформляем...' : 'Подтвердить заказ'}
          </button>
        </form>

        {/* Order summary */}
        <div className="sticky top-24 h-fit bg-white border border-divider rounded-xl p-6">
          <h2 className="font-serif text-xl font-semibold text-[#1c1917] mb-4">Ваш заказ</h2>
          <div className="space-y-3 mb-4">
            {cart?.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img
                  src={getImageUrl(item.productMainImage)}
                  alt={item.productName}
                  className="w-12 h-12 object-cover rounded-lg shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#1c1917] line-clamp-2">{item.productName}</p>
                  <p className="text-xs text-[#78716c]">× {item.quantity}</p>
                </div>
                <span className="text-xs font-semibold shrink-0">{formatPrice(item.subtotal)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-divider pt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#78716c]">Товары</span>
              <span>{formatPrice(cart?.totalPrice ?? 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#78716c]">Доставка</span>
              <span className={isFreeDelivery && deliveryType === 'DELIVERY' ? 'text-green-600 font-medium' : ''}>
                {deliveryFeeLabel}
              </span>
            </div>
            <div className="border-t border-divider pt-2 flex justify-between font-bold text-base">
              <span>Итого</span>
              <span className="text-[#1e3a5f]">{formatPrice((cart?.totalPrice ?? 0) + deliveryFeeNum)}</span>
            </div>
          </div>

          {/* Promo */}
          <div className="mt-4">
            <p className="text-xs font-medium text-[#78716c] mb-2 flex items-center gap-1"><Tag className="w-3 h-3" /> Промокод</p>
            <div className="flex gap-2">
              <input
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Введите код"
                className="flex-1 px-3 py-2 border border-divider rounded-lg text-xs focus:outline-none"
              />
              <button
                onClick={() => toast('Промокод не применён', { icon: '🎟️' })}
                className="px-3 py-2 bg-stone-100 hover:bg-stone-200 rounded-lg text-xs font-medium transition-colors"
              >
                Применить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

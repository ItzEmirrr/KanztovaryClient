import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/authStore'

export function CheckoutSuccess() {
  const [params] = useSearchParams()
  const orderId = params.get('orderId')
  const { token } = useAuthStore()

  useEffect(() => {
    document.title = 'Заказ оформлен — Канцтовары'
  }, [])

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      {/* Animated checkmark */}
      <div className="relative w-24 h-24 mb-8">
        <motion.svg viewBox="0 0 100 100" className="w-full h-full">
          <motion.circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="#1e3a5f"
            strokeWidth="5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6 }}
          />
          <motion.path
            d="M 30 50 L 45 65 L 70 38"
            fill="none"
            stroke="#1e3a5f"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          />
        </motion.svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h1 className="font-serif text-3xl font-semibold text-[#1c1917] mb-3">
          Заказ #{orderId} оформлен!
        </h1>
        <p className="text-[#78716c] mb-8 max-w-sm">
          Мы свяжемся с вами по указанному номеру телефона для подтверждения заказа
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {token && (
            <Link
              to="/orders"
              className="bg-[#1e3a5f] text-white px-8 py-3 rounded-full font-medium hover:bg-[#2d5282] transition-colors"
            >
              Мои заказы
            </Link>
          )}
          <Link
            to="/catalog"
            className="border border-[#1e3a5f] text-[#1e3a5f] px-8 py-3 rounded-full font-medium hover:bg-[#1e3a5f] hover:text-white transition-colors"
          >
            Продолжить покупки
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

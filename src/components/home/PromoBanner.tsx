import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export function PromoBanner() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="bg-[#1e3a5f] text-white flex items-center justify-center"
      style={{ minHeight: 200 }}
    >
      <div className="text-center px-4 py-12">
        <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-2">
          Бесплатная доставка при заказе от 10 000 сом
        </h2>
        <p className="text-white/70 mb-6 text-lg">Доставляем по всему Кыргызстану</p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 border border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-[#1e3a5f] transition-all"
        >
          Перейти в каталог
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.section>
  )
}

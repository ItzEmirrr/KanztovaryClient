import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const GRID_IMAGES = [
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80',
  'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=400&q=80',
  'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=400&q=80',
  'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&q=80',
]

export function Hero() {
  return (
    <section className="flex flex-col md:flex-row" style={{ minHeight: '85vh' }}>
      {/* Left */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="flex-[55] bg-[#f5f0e8] flex flex-col justify-center px-8 md:px-20 py-20"
      >
        <h1 className="font-serif text-4xl md:text-6xl font-semibold text-[#1c1917] leading-tight mb-6">
          Канцелярия,<br />которая<br />
          <span className="text-[#1e3a5f]">вдохновляет</span>
        </h1>
        <p className="text-[#78716c] text-lg mb-8 max-w-md leading-relaxed">
          Тщательно отобранные инструменты для тех, кто ценит качество письма
        </p>
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 bg-[#1e3a5f] hover:bg-[#2d5282] text-white px-8 py-3.5 rounded-full font-medium transition-all shadow-md hover:shadow-lg"
          >
            Смотреть каталог
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-sm text-[#78716c] flex items-center gap-1 mt-1 sm:mt-0 sm:self-center">
            Бесплатная доставка от 10 000 сом
          </p>
        </div>
      </motion.div>

      {/* Right */}
      <motion.div
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="flex-[45] bg-[#e7e5e0] grid grid-cols-2 gap-1 p-1"
      >
        {GRID_IMAGES.map((src, i) => (
          <div key={i} className="overflow-hidden bg-stone-200">
            <img
              src={src}
              alt="Канцелярия"
              loading="lazy"
              className="w-full h-full object-cover"
              style={{ minHeight: '200px' }}
            />
          </div>
        ))}
      </motion.div>
    </section>
  )
}

import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { Hero } from '../components/home/Hero'
import { CategoryRow } from '../components/home/CategoryRow'
import { BrandsRow } from '../components/home/BrandsRow'
import { PromoBanner } from '../components/home/PromoBanner'
import { ProductCard } from '../components/shared/ProductCard'
import { ProductCardSkeleton } from '../components/shared/Skeleton'
import { useProducts } from '../hooks/useProducts'
import { ArrowRight } from 'lucide-react'

function NewArrivals() {
  const { data, isLoading } = useProducts({ sortBy: 'NEWEST', size: 8, status: 'ACTIVE' })
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section className="container mx-auto px-4 py-16" ref={ref}>
      <div className="flex items-end justify-between mb-8">
        <h2 className="font-serif text-3xl font-semibold text-[#1c1917]">Новые поступления</h2>
        <Link to="/catalog" className="text-sm text-[#1e3a5f] hover:underline flex items-center gap-1">
          Все товары <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-5"
      >
        {isLoading
          ? Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
          : data?.products.map((p) => <ProductCard key={p.id} product={p} />)}
      </motion.div>
    </section>
  )
}

export function Home() {
  useEffect(() => {
    document.title = 'Канцтовары — Канцелярия, которая вдохновляет'
  }, [])

  return (
    <div>
      <Hero />
      <CategoryRow />
      <NewArrivals />
      <BrandsRow />
      <PromoBanner />
    </div>
  )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ImageOff, ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Product } from '../../types'
import { getImageUrl, formatPrice, calcDiscountPercent } from '../../lib/utils'
import { useCart } from '../../hooks/useCart'
import { useAuthStore } from '../../store/authStore'

interface Props {
  product: Product
}

export function ProductCard({ product }: Props) {
  const [hovered, setHovered] = useState(false)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()
  const { token } = useAuthStore()
  const navigate = useNavigate()

  const mainImage = product.images.find((i) => i.isMain) ?? product.images[0]
  const hasVariants = product.variants.length > 0
  const inStock = product.stockQuantity > 0
  const discountPct =
    product.discountPrice ? calcDiscountPercent(product.price, product.discountPrice) : null

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    if (!token) { navigate('/login'); return }
    if (hasVariants) { navigate(`/catalog/${product.id}`); return }
    addItem.mutate(
      { productId: product.id, quantity: 1 },
      {
        onSuccess: () => {
          setAdded(true)
          setTimeout(() => setAdded(false), 2000)
        },
      },
    )
  }

  return (
    <Link to={`/catalog/${product.id}`} className="group block">
      {/* Image */}
      <div
        className="relative overflow-hidden rounded-lg bg-[#f5f0e8]"
        style={{ aspectRatio: '4/5' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {mainImage ? (
          <img
            src={getImageUrl(mainImage.imageUrl)}
            alt={mainImage.altText || product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300">
            <ImageOff className="w-12 h-12" />
          </div>
        )}

        {discountPct && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            -{discountPct}%
          </span>
        )}

        <AnimatePresence>
          {hovered && inStock && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-0 inset-x-0 p-3"
            >
              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2 bg-[#1e3a5f] hover:bg-[#2d5282] text-white text-sm font-medium py-2.5 rounded-full transition-colors shadow-lg"
              >
                <ShoppingBag className="w-4 h-4" />
                {added ? '✓ Добавлено' : hasVariants ? 'Выбрать' : 'В корзину'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info */}
      <div className="mt-3 space-y-1">
        {product.categories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.categories.slice(0, 2).map((c) => (
              <span key={c.id} className="text-xs text-[#78716c]">
                {c.name}
              </span>
            ))}
          </div>
        )}

        <p className="text-sm font-medium text-[#1c1917] line-clamp-2">{product.name}</p>

        {product.brand && (
          <p className="text-xs text-[#78716c]">{product.brand.name}</p>
        )}

        <div className="flex items-center gap-2">
          {product.discountPrice ? (
            <>
              <span className="text-sm line-through text-stone-400">{formatPrice(product.price)}</span>
              <span className="text-sm font-bold text-[#1e3a5f]">{formatPrice(product.discountPrice)}</span>
            </>
          ) : (
            <span className="text-sm font-semibold text-[#1c1917]">{formatPrice(product.price)}</span>
          )}
        </div>

        {!inStock && (
          <p className="text-xs text-red-500 font-medium">Нет в наличии</p>
        )}
      </div>
    </Link>
  )
}

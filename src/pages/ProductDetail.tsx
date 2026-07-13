import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'
import { useProduct, useProducts } from '../hooks/useProducts'
import { useCart } from '../hooks/useCart'
import { Gallery } from '../components/product/Gallery'
import { VariantSelector } from '../components/product/VariantSelector'
import { ProductCard } from '../components/shared/ProductCard'
import { Skeleton } from '../components/shared/Skeleton'
import { formatPrice, calcDiscountPercent } from '../lib/utils'
import { ShoppingBag, Minus, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

export function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: product, isLoading } = useProduct(Number(id))
  const { addItem } = useCart()

  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null)
  const [qty, setQty] = useState(1)
  const [addedOk, setAddedOk] = useState(false)
  const [activeTab, setActiveTab] = useState<'desc' | 'attrs'>('desc')

  const firstCategory = product?.categories[0]
  const { data: similar } = useProducts({
    categoryId: firstCategory?.id,
    size: 4,
    status: 'ACTIVE',
  })

  const [emblaRef] = useEmblaCarousel({ loop: false, align: 'start', dragFree: true })

  const selectedVariant = product?.variants.find((v) => v.id === selectedVariantId)
  const effectivePrice = selectedVariant?.price ?? product?.discountPrice ?? product?.price ?? 0
  const originalPrice = product?.price ?? 0
  const discountPct = product?.discountPrice
    ? calcDiscountPercent(originalPrice, product.discountPrice)
    : null

  useEffect(() => {
    if (product) {
      document.title = `${product.name} — Stationery`
      if (product.variants.length > 0) setSelectedVariantId(product.variants[0].id)
    }
  }, [product])

  function handleAddToCart() {
    if (!product) return
    const mainImage = product.images.find((i) => i.isMain)?.imageUrl ?? product.images[0]?.imageUrl ?? null
    addItem.mutate(
      {
        productId: product.id,
        variantId: selectedVariantId ?? null,
        quantity: qty,
        productName: product.name,
        productSku: product.sku,
        productMainImage: mainImage,
        variantSku: selectedVariant?.sku ?? null,
        variantAttributes: selectedVariant?.attributes ?? null,
        unitPrice: effectivePrice,
      },
      {
        onSuccess: () => {
          setAddedOk(true)
          setTimeout(() => setAddedOk(false), 2500)
        },
      },
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-12">
          <Skeleton className="w-full rounded-xl" style={{ aspectRatio: '1/1' }} />
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className={`h-6 w-${i % 2 === 0 ? 'full' : '3/4'}`} />)}
          </div>
        </div>
      </div>
    )
  }

  if (!product) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <p className="text-[#78716c]">Товар не найден</p>
      <Link to="/catalog" className="text-[#1e3a5f] hover:underline mt-2 inline-block">← В каталог</Link>
    </div>
  )

  const inStock = product.stockQuantity > 0

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="text-xs text-[#78716c] mb-6 flex flex-wrap gap-1 items-center">
        <Link to="/" className="hover:text-[#1e3a5f]">Главная</Link>
        <span>/</span>
        <Link to="/catalog" className="hover:text-[#1e3a5f]">Каталог</Link>
        {firstCategory && (
          <>
            <span>/</span>
            <Link to={`/catalog?categoryId=${firstCategory.id}`} className="hover:text-[#1e3a5f]">{firstCategory.name}</Link>
          </>
        )}
        <span>/</span>
        <span className="text-[#1c1917]">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        {/* Gallery */}
        <Gallery images={product.images} />

        {/* Info */}
        <div className="space-y-5">
          {product.brand && (
            <Link
              to={`/catalog?brandId=${product.brand.id}`}
              className="text-sm text-[#1e3a5f] hover:underline font-medium"
            >
              {product.brand.name}
            </Link>
          )}

          <h1 className="font-serif text-3xl font-semibold text-[#1c1917]">{product.name}</h1>

          {/* Stars */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map((i) => (
              <Star key={i} className="w-4 h-4 fill-[#b45309] text-[#b45309]" />
            ))}
            <Star className="w-4 h-4 fill-[#b45309]/50 text-[#b45309]" />
            <span className="text-xs text-[#78716c] ml-1">4.5 / 5</span>
          </div>

          <p className="text-xs text-[#78716c] font-mono">Арт. {product.sku}</p>

          {/* Price */}
          <div className="flex items-center gap-3">
            {product.discountPrice ? (
              <>
                <span className="text-stone-400 line-through text-base">{formatPrice(originalPrice)}</span>
                <span className="font-bold text-[#1e3a5f] text-3xl">{formatPrice(effectivePrice)}</span>
                {discountPct && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    Скидка {discountPct}%
                  </span>
                )}
              </>
            ) : (
              <span className="font-bold text-3xl text-[#1c1917]">{formatPrice(effectivePrice)}</span>
            )}
          </div>

          {/* Variants */}
          {product.variants.length > 0 && (
            <VariantSelector
              variants={product.variants}
              selectedId={selectedVariantId}
              onSelect={setSelectedVariantId}
            />
          )}

          {/* Quantity */}
          {inStock && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#78716c]">Количество:</span>
              <div className="flex items-center border border-divider rounded-full overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center hover:bg-stone-100 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-medium">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stockQuantity, q + 1))}
                  className="w-9 h-9 flex items-center justify-center hover:bg-stone-100 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={!inStock || addItem.isPending}
            className="w-full flex items-center justify-center gap-2 bg-[#1e3a5f] disabled:bg-stone-300 disabled:cursor-not-allowed hover:bg-[#2d5282] text-white py-4 rounded-full font-medium text-base transition-all shadow-md hover:shadow-lg"
          >
            <ShoppingBag className="w-5 h-5" />
            {!inStock ? 'Нет в наличии' : addedOk ? '✓ Добавлено в корзину' : 'Добавить в корзину'}
          </button>

          {/* Tabs */}
          <div className="border-b border-divider mt-6">
            <div className="flex gap-6">
              {(['desc', 'attrs'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-[#1e3a5f] text-[#1e3a5f]' : 'border-transparent text-[#78716c]'}`}
                >
                  {tab === 'desc' ? 'Описание' : 'Характеристики'}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'desc' ? (
            <p className="text-sm text-[#78716c] leading-relaxed whitespace-pre-line">{product.description || 'Описание отсутствует'}</p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {product.variants[0]
                  ? Object.entries(product.variants[0].attributes).map(([k, v]) => (
                      <tr key={k} className="border-b border-divider">
                        <td className="py-2 text-[#78716c] w-1/2">{k}</td>
                        <td className="py-2 font-medium">{v}</td>
                      </tr>
                    ))
                  : <tr><td className="py-2 text-[#78716c]" colSpan={2}>Нет данных</td></tr>
                }
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Similar */}
      {similar && similar.products.filter((p) => p.id !== product.id).length > 0 && (
        <div>
          <h2 className="font-serif text-2xl font-semibold text-[#1c1917] mb-6">Похожие товары</h2>
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-5">
              {similar.products
                .filter((p) => p.id !== product.id)
                .map((p) => (
                  <div key={p.id} className="shrink-0 w-56">
                    <ProductCard product={p} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

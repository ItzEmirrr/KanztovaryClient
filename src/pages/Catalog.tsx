import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProducts } from '../hooks/useProducts'
import { useCategories, useBrands } from '../hooks/useProducts'
import { ProductCard } from '../components/shared/ProductCard'
import { ProductCardSkeleton } from '../components/shared/Skeleton'
import { Pagination } from '../components/shared/Pagination'
import { ShoppingBag } from 'lucide-react'

const SORT_OPTIONS = [
  { value: 'NEWEST', label: 'Сначала новые' },
  { value: 'OLDEST', label: 'Сначала старые' },
  { value: 'PRICE_ASC', label: 'Сначала дешевле' },
  { value: 'PRICE_DESC', label: 'Сначала дороже' },
  { value: 'NAME_ASC', label: 'А → Я' },
  { value: 'NAME_DESC', label: 'Я → А' },
]

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}

export function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const search = searchParams.get('search') ?? ''
  const categoryId = searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined
  const brandId = searchParams.get('brandId') ? Number(searchParams.get('brandId')) : undefined
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined
  const inStock = searchParams.get('inStock') === 'true'
  const sortBy = searchParams.get('sortBy') ?? 'NEWEST'
  const page = Number(searchParams.get('page') ?? '0')

  const [localSearch, setLocalSearch] = useState(search)
  const [localMin, setLocalMin] = useState(minPrice?.toString() ?? '')
  const [localMax, setLocalMax] = useState(maxPrice?.toString() ?? '')

  const debouncedSearch = useDebounce(localSearch, 400)

  const { data: categories } = useCategories()
  const { data: brands } = useBrands()

  const { data, isLoading } = useProducts({
    search: debouncedSearch || undefined,
    categoryId,
    brandId,
    minPrice,
    maxPrice,
    inStock: inStock || undefined,
    sortBy,
    page,
    size: 12,
    status: 'ACTIVE',
  })

  useEffect(() => {
    document.title = 'Каталог — Stationery'
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    if (debouncedSearch) params.set('search', debouncedSearch)
    else params.delete('search')
    params.delete('page')
    setSearchParams(params, { replace: true })
  }, [debouncedSearch])

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams)
      if (value) params.set(key, value)
      else params.delete(key)
      params.delete('page')
      setSearchParams(params)
    },
    [searchParams, setSearchParams],
  )

  const hasFilters = !!(search || categoryId || brandId || minPrice || maxPrice || inStock)

  function clearFilters() {
    setLocalSearch('')
    setLocalMin('')
    setLocalMax('')
    setSearchParams({})
  }

  const rootCategories = categories?.filter((c) => c.parentCategoryId === null) ?? []
  const childCategories = categories?.filter((c) => c.parentCategoryId !== null) ?? []

  const FiltersContent = (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <h3 className="text-sm font-semibold text-[#1c1917] mb-2">Поиск</h3>
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Название товара..."
          className="w-full px-3 py-2 border border-divider rounded-lg text-sm focus:outline-none focus:border-[#1e3a5f]"
        />
      </div>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[#1c1917] mb-2">Категории</h3>
          <div className="space-y-1 max-h-60 overflow-y-auto">
            {rootCategories.map((cat) => {
              const children = childCategories.filter((c) => c.parentCategoryId === cat.id)
              return (
                <div key={cat.id}>
                  <button
                    onClick={() => updateParam('categoryId', categoryId === cat.id ? null : String(cat.id))}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${categoryId === cat.id ? 'bg-[#1e3a5f] text-white' : 'hover:bg-stone-100 text-[#1c1917]'}`}
                  >
                    {cat.name}
                  </button>
                  {children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => updateParam('categoryId', categoryId === child.id ? null : String(child.id))}
                      className={`w-full text-left pl-6 pr-3 py-1.5 rounded-lg text-sm transition-colors ${categoryId === child.id ? 'bg-[#1e3a5f] text-white' : 'hover:bg-stone-100 text-[#78716c]'}`}
                    >
                      {child.name}
                    </button>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Brands */}
      {brands && brands.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[#1c1917] mb-2">Бренды</h3>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => updateParam('brandId', brandId === brand.id ? null : String(brand.id))}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${brandId === brand.id ? 'bg-[#1e3a5f] text-white' : 'hover:bg-stone-100 text-[#1c1917]'}`}
              >
                {brand.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price */}
      <div>
        <h3 className="text-sm font-semibold text-[#1c1917] mb-2">Цена (сом)</h3>
        <div className="flex gap-2">
          <input
            type="number"
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
            onBlur={() => updateParam('minPrice', localMin || null)}
            placeholder="От"
            className="w-1/2 px-3 py-2 border border-divider rounded-lg text-sm focus:outline-none focus:border-[#1e3a5f]"
          />
          <input
            type="number"
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
            onBlur={() => updateParam('maxPrice', localMax || null)}
            placeholder="До"
            className="w-1/2 px-3 py-2 border border-divider rounded-lg text-sm focus:outline-none focus:border-[#1e3a5f]"
          />
        </div>
      </div>

      {/* In stock */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-[#1c1917]">Только в наличии</span>
        <button
          onClick={() => updateParam('inStock', inStock ? null : 'true')}
          className={`relative w-11 h-6 rounded-full transition-colors ${inStock ? 'bg-[#1e3a5f]' : 'bg-stone-200'}`}
        >
          <span
            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${inStock ? 'left-[22px]' : 'left-0.5'}`}
          />
        </button>
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full text-sm text-[#78716c] hover:text-red-500 flex items-center gap-1.5 transition-colors"
        >
          <X className="w-3.5 h-3.5" /> Сбросить фильтры
        </button>
      )}
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl font-semibold text-[#1c1917] mb-8">Каталог</h1>

      <div className="flex gap-8">
        {/* Desktop filters */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="sticky top-24 bg-white border border-divider rounded-xl p-5">
            {FiltersContent}
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1 min-w-0">
          {/* Top bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <button
                className="md:hidden flex items-center gap-1.5 text-sm border border-divider rounded-lg px-3 py-2"
                onClick={() => setDrawerOpen(true)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Фильтры
              </button>
              <span className="text-sm text-[#78716c]">
                {isLoading ? '...' : `Найдено: ${data?.totalElements ?? 0} товаров`}
              </span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => updateParam('sortBy', e.target.value)}
              className="text-sm border border-divider rounded-lg px-3 py-2 focus:outline-none focus:border-[#1e3a5f] bg-white"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {Array(12).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : !data || data.products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <ShoppingBag className="w-24 h-24 text-stone-200 mb-4" />
              <h3 className="font-serif text-xl font-semibold text-[#1c1917] mb-2">Товары не найдены</h3>
              <p className="text-[#78716c] text-sm mb-6">Попробуйте изменить параметры фильтрации</p>
              <button
                onClick={clearFilters}
                className="bg-[#1e3a5f] text-white px-6 py-2.5 rounded-full text-sm hover:bg-[#2d5282] transition-colors"
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {data?.products.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
              <Pagination
                page={page}
                totalPages={data?.totalPages ?? 1}
                onPage={(p) => updateParam('page', p === 0 ? null : String(p))}
              />
            </>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed bottom-0 inset-x-0 bg-white z-50 rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-serif text-lg font-semibold">Фильтры</h3>
                <button onClick={() => setDrawerOpen(false)}><X className="w-5 h-5" /></button>
              </div>
              {FiltersContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

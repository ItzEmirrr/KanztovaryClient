import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, Pen, Book, Palette, Scissors, Folder, Box, Star, Grid } from 'lucide-react'
import { useCategories } from '../../hooks/useProducts'
import { Skeleton } from '../shared/Skeleton'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  'ручки': Pen,
  'блокноты': Book,
  'маркеры': Palette,
  'scissors': Scissors,
  'папки': Folder,
  'скетчбуки': Book,
}

function getCategoryIcon(name: string): React.ComponentType<{ className?: string }> {
  const lower = name.toLowerCase()
  for (const [key, Icon] of Object.entries(ICON_MAP)) {
    if (lower.includes(key)) return Icon
  }
  return Grid
}

export function CategoryRow() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start', dragFree: true })
  const { data: categories, isLoading } = useCategories()
  const rootCategories = categories?.filter((c) => c.parentCategoryId === null) ?? []

  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const updateScrollState = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    updateScrollState()
    emblaApi.on('select', updateScrollState)
    emblaApi.on('reInit', updateScrollState)
    return () => {
      emblaApi.off('select', updateScrollState)
      emblaApi.off('reInit', updateScrollState)
    }
  }, [emblaApi, updateScrollState])

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-3xl font-semibold text-[#1c1917]">
          Выбери свой раздел
        </h2>

        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            aria-label="Прокрутить назад"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canScrollPrev}
            className="p-2 rounded-full border border-stone-200 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label="Прокрутить вперёд"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canScrollNext}
            className="p-2 rounded-full border border-stone-200 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative">
        {canScrollPrev && (
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-background to-transparent" />
        )}
        {canScrollNext && (
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-background to-transparent" />
        )}

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {isLoading
              ? Array(6).fill(0).map((_, i) => (
                  <div key={i} className="shrink-0">
                    <Skeleton className="w-40 h-40 rounded-2xl" />
                  </div>
                ))
              : rootCategories.map((cat) => {
                  const Icon = getCategoryIcon(cat.name)
                  return (
                    <Link
                      key={cat.id}
                      to={`/catalog?categoryId=${cat.id}`}
                      className="group shrink-0 w-40 h-40 rounded-2xl bg-[#f5f0e8] flex flex-col items-center justify-center gap-3 hover:bg-[#1e3a5f] transition-colors duration-200"
                    >
                      <Icon className="w-8 h-8 text-[#1e3a5f] group-hover:text-white transition-colors" />
                      <span className="text-sm font-medium text-[#1c1917] group-hover:text-white transition-colors text-center px-2">
                        {cat.name}
                      </span>
                    </Link>
                  )
                })}
          </div>
        </div>
      </div>
    </section>
  )
}

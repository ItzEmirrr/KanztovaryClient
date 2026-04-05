import { useRef } from 'react'
import { Link } from 'react-router-dom'
import useEmblaCarousel from 'embla-carousel-react'
import { Pen, Book, Palette, Scissors, Folder, Box, Star, Grid } from 'lucide-react'
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
  const [emblaRef] = useEmblaCarousel({ loop: false, align: 'start', dragFree: true })
  const { data: categories, isLoading } = useCategories()
  const rootCategories = categories?.filter((c) => c.parentCategoryId === null) ?? []

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="font-serif text-3xl font-semibold text-[#1c1917] mb-8">
        Выбери свой раздел
      </h2>

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
    </section>
  )
}

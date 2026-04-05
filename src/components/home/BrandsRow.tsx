import { Link } from 'react-router-dom'
import { useBrands } from '../../hooks/useProducts'
import { getImageUrl } from '../../lib/utils'
import { Skeleton } from '../shared/Skeleton'

export function BrandsRow() {
  const { data: brands, isLoading } = useBrands()

  if (!isLoading && (!brands || brands.length === 0)) return null

  return (
    <section className="container mx-auto px-4 py-14">
      <h2 className="font-serif text-3xl font-semibold text-[#1c1917] mb-8 text-center">
        Наши бренды
      </h2>
      <div className="flex flex-wrap justify-center gap-8 items-center">
        {isLoading
          ? Array(6).fill(0).map((_, i) => <Skeleton key={i} className="w-24 h-10" />)
          : brands!.map((brand) => (
              <Link
                key={brand.id}
                to={`/catalog?brandId=${brand.id}`}
                className="group"
                title={brand.name}
              >
                {brand.logoUrl ? (
                  <img
                    src={getImageUrl(brand.logoUrl)}
                    alt={brand.name}
                    loading="lazy"
                    className="h-10 w-auto object-contain grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all duration-200"
                  />
                ) : (
                  <span className="text-sm font-semibold text-[#78716c] group-hover:text-[#1e3a5f] transition-colors">
                    {brand.name}
                  </span>
                )}
              </Link>
            ))}
      </div>
    </section>
  )
}

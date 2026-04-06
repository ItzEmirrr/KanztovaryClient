import type { ProductVariant } from '../../types'
import { cn } from '../../lib/utils'

interface Props {
  variants: ProductVariant[]
  selectedId: number | null
  onSelect: (id: number) => void
}

export function VariantSelector({ variants, selectedId, onSelect }: Props) {
  if (!variants.length) return null

  const allKeys = Array.from(
    new Set(variants.flatMap((v) => Object.keys(v.attributes))),
  )

  return (
    <div className="space-y-4">
      {allKeys.map((key) => {
        const values = Array.from(new Set(variants.map((v) => v.attributes[key]).filter(Boolean)))
        return (
          <div key={key}>
            <p className="text-sm font-medium text-[#1c1917] mb-2">{key}</p>
            <div className="flex flex-wrap gap-2">
              {values.map((val) => {
                const matchingVariant = variants.find((v) => v.attributes[key] === val)
                const inStock = matchingVariant ? matchingVariant.stockQuantity > 0 : false
                const isSelected = matchingVariant?.id === selectedId
                return (
                  <button
                    key={val}
                    disabled={!inStock}
                    onClick={() => matchingVariant && onSelect(matchingVariant.id)}
                    className={cn(
                      'px-4 py-1.5 rounded-full border text-sm font-medium transition-colors',
                      isSelected
                        ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]'
                        : inStock
                        ? 'border-divider text-[#1c1917] hover:border-[#1e3a5f]'
                        : 'border-divider text-stone-300 line-through cursor-not-allowed',
                    )}
                  >
                    {val}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

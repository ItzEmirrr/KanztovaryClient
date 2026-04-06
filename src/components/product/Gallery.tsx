import { useState } from 'react'
import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import type { ProductImage } from '../../types'
import { getImageUrl } from '../../lib/utils'

interface Props { images: ProductImage[] }

export function Gallery({ images }: Props) {
  const sorted = [...images].sort((a, b) => {
    if (a.isMain) return -1
    if (b.isMain) return 1
    return a.sortOrder - b.sortOrder
  })

  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  const current = sorted[active]

  return (
    <div>
      {/* Main image */}
      <div
        className="relative overflow-hidden rounded-xl bg-[#f5f0e8] cursor-zoom-in"
        style={{ aspectRatio: '1/1' }}
        onClick={() => setLightbox(true)}
      >
        {current ? (
          <img
            src={getImageUrl(current.imageUrl)}
            alt={current.altText || 'Товар'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300 text-sm">
            Нет фото
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {sorted.length > 1 && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {sorted.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${i === active ? 'border-[#1e3a5f]' : 'border-transparent'}`}
            >
              <img
                src={getImageUrl(img.imageUrl)}
                alt={img.altText}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setLightbox(false)}
          >
            <button className="absolute top-4 right-4 text-white" onClick={() => setLightbox(false)}>
              <X className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={getImageUrl(current?.imageUrl)}
              alt={current?.altText}
              className="max-h-[90vh] max-w-full rounded-xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

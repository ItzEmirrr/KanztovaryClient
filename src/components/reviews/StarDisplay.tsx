/**
 * StarDisplay — renders N stars with optional partial last star.
 * Uses a clipPath per star so fractional fill (e.g. 4.3 → 30% of star 5) works at any size.
 */
interface Props {
  rating: number   // e.g. 4.3
  size?: number    // px, default 20
  max?: number     // default 5
}

export function StarDisplay({ rating, size = 20, max = 5 }: Props) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Рейтинг ${rating} из ${max}`}>
      {Array.from({ length: max }, (_, i) => {
        const fill = Math.min(1, Math.max(0, rating - i))
        const id = `star-clip-${i}-${size}`
        return (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <clipPath id={id}>
                <rect x="0" y="0" width={20 * fill} height="20" />
              </clipPath>
            </defs>
            {/* Empty star */}
            <path
              d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.27l-4.94 2.43.94-5.49-4-3.9 5.53-.8z"
              fill="#e7e5e0"
            />
            {/* Filled portion */}
            <path
              d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.27l-4.94 2.43.94-5.49-4-3.9 5.53-.8z"
              fill="#1e3a5f"
              clipPath={`url(#${id})`}
            />
          </svg>
        )
      })}
    </div>
  )
}

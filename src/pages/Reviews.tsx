import { useEffect, useState } from 'react'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Pencil, MessageSquarePlus, Loader2, InboxIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { reviewsApi } from '../api/reviews'
import { useAuthStore } from '../store/authStore'
import { ReviewStats } from '../components/reviews/ReviewStats'
import { ReviewCard } from '../components/reviews/ReviewCard'
import { ReviewDrawer } from '../components/reviews/ReviewDrawer'
import type { Review } from '../types'

const PAGE_SIZE = 9 // 3-col grid — multiples of 3 look clean

export function Reviews() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { token } = useAuthStore()

  useEffect(() => {
    document.title = 'Отзывы — Канцтовары'
  }, [])

  // ── Stats ────────────────────────────────────────────────────────────────────
  const { data: stats } = useQuery({
    queryKey: ['reviewStats'],
    queryFn: reviewsApi.getStats,
    staleTime: 60_000,
  })

  // ── My review (auth only, 404 is normal) ────────────────────────────────────
  const { data: myReview } = useQuery<Review | null>({
    queryKey: ['myReview', token],
    queryFn: () =>
      reviewsApi.getMyReview().catch((err) => {
        const status = err?.response?.status
        const code = err?.response?.data?.code
        if (status === 404 || code === 615) return null
        throw err
      }),
    enabled: !!token,
    staleTime: 0,
  })

  // ── Infinite reviews ─────────────────────────────────────────────────────────
  const {
    data: pages,
    fetchNextPage,
    isFetchingNextPage,
    isLoading: reviewsLoading,
  } = useInfiniteQuery({
    queryKey: ['reviews'],
    queryFn: ({ pageParam = 0 }) => reviewsApi.getReviews(pageParam as number, PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => lastPage.last ? undefined : allPages.length,
    staleTime: 30_000,
  })

  // Flatten all loaded reviews
  const allReviews: Review[] = pages?.pages.flatMap((p) => p.content) ?? []
  const canLoadMore = pages ? !pages.pages[pages.pages.length - 1]?.last : false

  function openDrawer() {
    if (!token) {
      toast('Войдите в аккаунт, чтобы оставить отзыв', { icon: '🔐' })
      return
    }
    setDrawerOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <div className="container mx-auto px-4 py-12">

        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="font-serif text-[36px] font-semibold text-[#1c1917]">Отзывы</h1>
          <p className="text-[#78716c] mt-1 text-sm">Что говорят наши покупатели</p>
        </motion.div>

        {/* Stats block */}
        {stats && <ReviewStats stats={stats} />}

        {/* Write review prompt (inline, above list — for users without own review) */}
        {token && myReview === null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center justify-between bg-[#f5f0e8] rounded-2xl px-6 py-4"
          >
            <div>
              <p className="font-semibold text-[#1c1917] text-sm">Вы ещё не оставляли отзыв</p>
              <p className="text-xs text-[#78716c] mt-0.5">Поделитесь впечатлением о покупке</p>
            </div>
            <button
              onClick={() => setDrawerOpen(true)}
              className="shrink-0 flex items-center gap-2 bg-[#1e3a5f] text-white text-sm font-medium px-4 py-2.5 rounded-full hover:bg-[#2d5282] transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Написать
            </button>
          </motion.div>
        )}

        {/* Reviews grid */}
        {reviewsLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#1e3a5f]" />
          </div>
        ) : allReviews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4 py-20 text-center"
          >
            {/* Simple SVG illustration */}
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="60" cy="60" r="56" fill="#f5f0e8" />
              <rect x="32" y="42" width="56" height="40" rx="8" fill="#e7e5e0" />
              <rect x="40" y="54" width="40" height="4" rx="2" fill="#c5bfb8" />
              <rect x="40" y="63" width="28" height="4" rx="2" fill="#c5bfb8" />
              <circle cx="60" cy="36" r="10" fill="#1e3a5f" />
              <path d="M55 36l3.5 3.5L65 30" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <p className="font-semibold text-[#1c1917]">Отзывов пока нет</p>
              <p className="text-sm text-[#78716c] mt-1">Будьте первым, кто оставит отзыв</p>
            </div>
            {token && (
              <button
                onClick={() => setDrawerOpen(true)}
                className="mt-2 flex items-center gap-2 bg-[#1e3a5f] text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-[#2d5282] transition-colors"
              >
                <Pencil className="w-4 h-4" />
                Написать первым
              </button>
            )}
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {allReviews.map((review, i) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    index={i}
                    isOwn={myReview?.id === review.id}
                    onEdit={() => setDrawerOpen(true)}
                    onDelete={() => {
                      // The drawer handles deletion — just open in edit mode
                      setDrawerOpen(true)
                    }}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Load more */}
            {canLoadMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="flex items-center gap-2 px-8 py-3 rounded-full border border-[#e7e5e0] bg-white text-sm font-medium text-[#1c1917] hover:border-[#1e3a5f] hover:text-[#1e3a5f] transition-all disabled:opacity-50"
                >
                  {isFetchingNextPage ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <InboxIcon className="w-4 h-4" />
                  )}
                  {isFetchingNextPage ? 'Загружаем…' : 'Загрузить ещё'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* FAB — floating action button (auth + no review) */}
      <AnimatePresence>
        {token && myReview === null && !drawerOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.4 }}
            onClick={() => setDrawerOpen(true)}
            className="fixed bottom-6 right-6 z-30 flex items-center gap-2 bg-[#1e3a5f] text-white pl-4 pr-5 py-3.5 rounded-full shadow-xl hover:bg-[#2d5282] transition-colors text-sm font-medium"
            aria-label="Написать отзыв"
          >
            <MessageSquarePlus className="w-5 h-5" />
            Написать отзыв
          </motion.button>
        )}
      </AnimatePresence>

      {/* Edit FAB — when own review exists */}
      <AnimatePresence>
        {token && myReview && !drawerOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.4 }}
            onClick={() => setDrawerOpen(true)}
            className="fixed bottom-6 right-6 z-30 flex items-center gap-2 bg-white border border-[#e7e5e0] text-[#1e3a5f] pl-4 pr-5 py-3.5 rounded-full shadow-xl hover:bg-[#f5f0e8] transition-colors text-sm font-medium"
            aria-label="Редактировать отзыв"
          >
            <Pencil className="w-4 h-4" />
            Мой отзыв
          </motion.button>
        )}
      </AnimatePresence>

      {/* Review drawer */}
      <ReviewDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        existing={myReview ?? null}
      />
    </div>
  )
}

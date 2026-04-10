import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { reviewsApi } from '../../api/reviews'
import type { Review } from '../../types'

const MAX_COMMENT = 1000

interface Props {
  open: boolean
  onClose: () => void
  existing: Review | null   // null → create mode, Review → edit mode
}

// ─── Interactive star picker ──────────────────────────────────────────────────
function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex gap-2" onMouseLeave={() => setHovered(0)}>
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= (hovered || value)
        return (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHovered(n)}
            onClick={() => onChange(n)}
            className="transition-transform duration-150 hover:scale-125 focus:outline-none"
            aria-label={`${n} звезда`}
          >
            <svg width="36" height="36" viewBox="0 0 20 20">
              <path
                d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.27l-4.94 2.43.94-5.49-4-3.9 5.53-.8z"
                fill={active ? '#1e3a5f' : '#e7e5e0'}
                className="transition-colors duration-150"
              />
            </svg>
          </button>
        )
      })}
    </div>
  )
}

// ─── Drawer ───────────────────────────────────────────────────────────────────
export function ReviewDrawer({ open, onClose, existing }: Props) {
  const [rating, setRating] = useState(existing?.rating ?? 0)
  const [comment, setComment] = useState(existing?.comment ?? '')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const qc = useQueryClient()

  // Sync form when existing changes (e.g. user opens drawer in edit mode)
  useEffect(() => {
    setRating(existing?.rating ?? 0)
    setComment(existing?.comment ?? '')
    setConfirmDelete(false)
  }, [existing, open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  function invalidate() {
    qc.invalidateQueries({ queryKey: ['reviews'] })
    qc.invalidateQueries({ queryKey: ['reviewStats'] })
    qc.invalidateQueries({ queryKey: ['myReview'] })
  }

  const create = useMutation({
    mutationFn: reviewsApi.createReview,
    onSuccess: () => { toast.success('Отзыв опубликован!'); invalidate(); onClose() },
    onError: () => toast.error('Не удалось сохранить отзыв'),
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { rating: number; comment?: string } }) =>
      reviewsApi.updateReview(id, data),
    onSuccess: () => { toast.success('Отзыв обновлён'); invalidate(); onClose() },
    onError: () => toast.error('Не удалось обновить отзыв'),
  })

  const remove = useMutation({
    mutationFn: reviewsApi.deleteReview,
    onSuccess: () => { toast.success('Отзыв удалён'); invalidate(); onClose() },
    onError: () => toast.error('Не удалось удалить отзыв'),
  })

  const isPending = create.isPending || update.isPending || remove.isPending

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!rating) return
    const payload = { rating, comment: comment.trim() || undefined }
    if (existing) {
      update.mutate({ id: existing.id, data: payload })
    } else {
      create.mutate(payload)
    }
  }

  const remaining = MAX_COMMENT - comment.length

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />

          {/* Drawer panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.28 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#e7e5e0]">
              <h2 className="font-serif text-xl font-semibold text-[#1c1917]">
                {existing ? 'Редактировать отзыв' : 'Ваш отзыв'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-stone-100 transition-colors"
                aria-label="Закрыть"
              >
                <X className="w-5 h-5 text-[#78716c]" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto px-6 py-6 gap-6">

              {/* Star picker */}
              <div>
                <label className="block text-sm font-medium text-[#1c1917] mb-3">
                  Ваша оценка <span className="text-red-500">*</span>
                </label>
                <StarPicker value={rating} onChange={setRating} />
                {rating > 0 && (
                  <p className="text-xs text-[#78716c] mt-2">
                    {['', 'Очень плохо', 'Плохо', 'Нормально', 'Хорошо', 'Отлично!'][rating]}
                  </p>
                )}
              </div>

              {/* Comment */}
              <div className="flex-1 flex flex-col">
                <label className="block text-sm font-medium text-[#1c1917] mb-2">
                  Комментарий <span className="text-[#78716c] font-normal">(необязательно)</span>
                </label>
                <div className="relative flex-1">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value.slice(0, MAX_COMMENT))}
                    placeholder="Расскажите о вашем опыте покупки…"
                    rows={6}
                    className="w-full h-full min-h-[140px] px-4 py-3 border border-[#e7e5e0] rounded-xl text-sm text-[#1c1917] placeholder:text-stone-400 focus:outline-none focus:border-[#1e3a5f] resize-none transition-colors"
                  />
                  <span
                    className={`absolute bottom-3 right-3 text-xs font-medium transition-colors ${
                      remaining <= 100 ? 'text-red-400' : 'text-stone-400'
                    }`}
                  >
                    {comment.length} / {MAX_COMMENT}
                  </span>
                </div>
              </div>

              {/* Footer actions */}
              <div className="space-y-3 mt-auto">
                <button
                  type="submit"
                  disabled={!rating || isPending}
                  className="w-full bg-[#1e3a5f] hover:bg-[#2d5282] disabled:bg-stone-300 text-white py-3.5 rounded-full font-medium text-sm transition-all"
                >
                  {isPending ? 'Сохраняем…' : existing ? 'Сохранить изменения' : 'Опубликовать'}
                </button>

                {/* Delete — only in edit mode */}
                {existing && (
                  <>
                    {!confirmDelete ? (
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(true)}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-full border border-[#e7e5e0] text-[#78716c] hover:border-red-200 hover:text-red-500 hover:bg-red-50 text-sm font-medium transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                        Удалить отзыв
                      </button>
                    ) : (
                      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-3">
                        <p className="text-sm text-red-700 font-medium text-center">
                          Удалить отзыв навсегда?
                        </p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setConfirmDelete(false)}
                            className="flex-1 py-2.5 rounded-full border border-[#e7e5e0] text-sm text-[#78716c] hover:bg-stone-100 transition-colors"
                          >
                            Отмена
                          </button>
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => remove.mutate(existing.id)}
                            className="flex-1 py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors disabled:opacity-60"
                          >
                            {remove.isPending ? 'Удаляем…' : 'Да, удалить'}
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </form>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

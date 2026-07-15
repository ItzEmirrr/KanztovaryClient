import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Send, Loader2, PackageSearch, Info } from 'lucide-react'
import toast from 'react-hot-toast'
import { recommendationsApi } from '../api/recommendations'
import type { RecommendationItem } from '../types'

const MAX_QUERY = 500
const DEFAULT_MAX_RESULTS = 5

// ─── Spinner with animated dots ───────────────────────────────────────────────
function AiLoader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col items-center gap-5 py-16"
    >
      <div className="relative w-16 h-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-4 border-[#1e3a5f]/20 border-t-[#1e3a5f]"
        />
        <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-[#1e3a5f]" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-[#1c1917]">AI подбирает товары…</p>
        <p className="text-sm text-[#78716c] mt-1">Это может занять несколько секунд</p>
      </div>
    </motion.div>
  )
}

// ─── Single recommendation card ────────────────────────────────────────────────
function RecommendationCard({ item, index }: { item: RecommendationItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
    >
      <Link
        to={`/catalog/${item.productId}`}
        className="flex flex-col gap-3 p-5 bg-white border border-[#e7e5e0] rounded-2xl hover:border-[#1e3a5f]/40 hover:shadow-md transition-all group"
      >
        <div className="flex items-start justify-between gap-3">
          <p className="font-semibold text-[#1c1917] text-sm leading-snug group-hover:text-[#1e3a5f] transition-colors">
            {item.name}
          </p>
          <span className="shrink-0 text-xs font-medium bg-[#1e3a5f] text-white px-2.5 py-0.5 rounded-full">
            #{index + 1}
          </span>
        </div>
        <div className="flex items-start gap-2 bg-[#f5f0e8] rounded-xl px-3 py-2.5">
          <Info className="w-3.5 h-3.5 text-[#1e3a5f] mt-0.5 shrink-0" />
          <p className="text-xs text-[#78716c] leading-relaxed">{item.reason}</p>
        </div>
        <span className="text-xs text-[#1e3a5f] font-medium self-end group-hover:underline">
          Посмотреть товар →
        </span>
      </Link>
    </motion.div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export function SmartPicker() {
  const [query, setQuery] = useState('')
  const [maxResults, setMaxResults] = useState(DEFAULT_MAX_RESULTS)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { data, mutate, isPending, isSuccess } = useMutation({
    mutationFn: recommendationsApi.getRecommendations,
    onError: () => toast.error('Не удалось получить рекомендации'),
  })

  useEffect(() => {
    document.title = 'Умный подбор — Канцтовары'
    textareaRef.current?.focus()
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim() || isPending) return
    mutate({ query: query.trim(), maxResults })
  }

  const remaining = MAX_QUERY - query.length

  return (
    <div className="min-h-screen bg-[#fafaf9] py-12 px-4">
      <div className="max-w-[640px] mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1e3a5f] mb-4">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-serif text-[32px] font-semibold text-[#1c1917]">Умный подбор</h1>
          <p className="text-[#78716c] mt-2 text-sm max-w-md mx-auto">
            Опишите, что ищете, и AI подберёт подходящие товары из нашего каталога
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white border border-[#e7e5e0] rounded-2xl p-6 space-y-5"
        >
          {/* Query textarea */}
          <div>
            <label className="block text-sm font-medium text-[#1c1917] mb-2">
              Ваш запрос
            </label>
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={query}
                onChange={(e) => setQuery(e.target.value.slice(0, MAX_QUERY))}
                placeholder="Опишите, что ищете... Например: «подарок школьнику на 1 сентября» или «ежедневник для офиса в строгом стиле»"
                rows={4}
                disabled={isPending}
                className="w-full px-4 py-3 border border-[#e7e5e0] rounded-xl text-sm text-[#1c1917] placeholder:text-stone-400 focus:outline-none focus:border-[#1e3a5f] resize-none transition-colors disabled:bg-stone-50 disabled:text-stone-400"
              />
              <span
                className={`absolute bottom-3 right-3 text-xs font-medium transition-colors ${
                  remaining <= 50 ? 'text-red-400' : 'text-stone-400'
                }`}
              >
                {remaining}
              </span>
            </div>
          </div>

          {/* maxResults select */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-[#1c1917] shrink-0">
              Количество результатов
            </label>
            <div className="flex gap-2 flex-wrap">
              {[1, 3, 5, 7, 10].map((n) => (
                <button
                  key={n}
                  type="button"
                  disabled={isPending}
                  onClick={() => setMaxResults(n)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    maxResults === n
                      ? 'bg-[#1e3a5f] text-white'
                      : 'bg-stone-100 text-[#78716c] hover:bg-stone-200'
                  } disabled:opacity-50`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending || !query.trim()}
            className="w-full flex items-center justify-center gap-2 bg-[#1e3a5f] hover:bg-[#2d5282] disabled:bg-stone-300 text-white py-3.5 rounded-full font-medium text-sm transition-all"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isPending ? 'Подбираем…' : 'Найти'}
          </button>
        </motion.form>

        {/* Results */}
        <AnimatePresence mode="wait">
          {isPending && (
            <AiLoader key="loader" />
          )}

          {isSuccess && data && !isPending && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-8 space-y-5"
            >
              {/* Summary */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-[#1e3a5f] text-white rounded-2xl px-6 py-5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-white/70" />
                  <span className="text-xs font-medium text-white/70 uppercase tracking-wide">
                    AI-резюме
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{data.summary}</p>
              </motion.div>

              {/* Cards or empty */}
              {data.recommendations.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-3 py-12 text-center"
                >
                  <PackageSearch className="w-12 h-12 text-stone-300" />
                  <p className="font-semibold text-[#1c1917]">Ничего не нашли по вашему запросу</p>
                  <p className="text-sm text-[#78716c]">Попробуйте переформулировать запрос</p>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {data.recommendations.map((item, i) => (
                    <RecommendationCard key={item.productId} item={item} index={i} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

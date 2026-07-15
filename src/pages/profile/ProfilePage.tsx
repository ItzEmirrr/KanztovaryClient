import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Package, ChevronRight, AlertCircle, LogOut } from 'lucide-react'
import { userApi } from '../../api/user'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import { Skeleton } from '../../components/shared/Skeleton'
import { ProfileForm } from './ProfileForm'
import { PasswordForm } from './PasswordForm'

// ─── Skeleton loading state ───────────────────────────────────────────────────
function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-3 mb-8">
        <Skeleton className="w-20 h-20 rounded-full" />
        <Skeleton className="w-32 h-4" />
        <Skeleton className="w-20 h-3" />
      </div>
      <div className="bg-white border border-[#e7e5e0] rounded-2xl p-6 space-y-4">
        <Skeleton className="w-40 h-4" />
        <Skeleton className="w-full h-10 rounded-lg" />
        <Skeleton className="w-full h-10 rounded-lg" />
        <Skeleton className="w-full h-11 rounded-full" />
      </div>
      <div className="bg-white border border-[#e7e5e0] rounded-2xl p-6 space-y-4">
        <Skeleton className="w-32 h-4" />
        <Skeleton className="w-full h-10 rounded-lg" />
        <Skeleton className="w-full h-10 rounded-lg" />
        <Skeleton className="w-full h-10 rounded-lg" />
        <Skeleton className="w-full h-11 rounded-full" />
      </div>
    </div>
  )
}

// ─── Error state ──────────────────────────────────────────────────────────────
function ProfileError({ refetch }: { refetch: () => void }) {
  return (
    <div className="bg-white border border-[#e7e5e0] rounded-2xl p-8 flex flex-col items-center text-center gap-4">
      <AlertCircle className="w-12 h-12 text-red-400" />
      <div>
        <p className="font-semibold text-[#1c1917]">Не удалось загрузить профиль</p>
        <p className="text-sm text-[#78716c] mt-1">Попробуйте позже</p>
      </div>
      <button
        onClick={refetch}
        className="bg-[#1e3a5f] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#2d5282] transition-colors"
      >
        Повторить
      </button>
    </div>
  )
}

// ─── Page container variants ──────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

// ─── Main component ───────────────────────────────────────────────────────────
export function ProfilePage() {
  const { data: profile, isLoading, isError, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: userApi.getProfile,
    staleTime: 0,
  })

  const { logout } = useAuthStore()
  const setTotalItems = useCartStore((s) => s.setTotalItems)
  const qc = useQueryClient()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Мой профиль — Канцтовары'
  }, [])

  function handleLogout() {
    logout()
    setTotalItems(0)
    qc.clear()
    navigate('/', { replace: true })
  }

  const initial = profile?.username?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="min-h-screen bg-[#fafaf9] py-12 px-4">
      <div className="max-w-[560px] mx-auto">

        {/* Page title */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="font-serif text-[32px] font-semibold text-[#1c1917] mb-8"
        >
          Мой профиль
        </motion.h1>

        {isLoading ? (
          <ProfileSkeleton />
        ) : isError ? (
          <ProfileError refetch={refetch} />
        ) : profile ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-5"
          >
            {/* Avatar */}
            <motion.div variants={itemVariant} className="flex flex-col items-center gap-2 mb-2">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold select-none"
                style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5282 100%)' }}
              >
                {initial}
              </div>
              <p className="font-semibold text-[#1c1917]">{profile.username}</p>
              <span className="text-xs text-[#78716c] bg-stone-100 px-2.5 py-0.5 rounded-full">
                {profile.role === 'ADMIN' ? 'Администратор' : 'Покупатель'}
              </span>
            </motion.div>

            {/* Profile data form */}
            <ProfileForm profile={profile} />

            {/* Password form */}
            <PasswordForm />

            {/* Orders link */}
            <motion.div variants={itemVariant}>
              <Link
                to="/orders"
                className="flex items-center justify-between px-5 py-4 rounded-2xl border border-[#e7e5e0] bg-[#fafaf9] hover:bg-[#f5f0e8] transition-colors group"
              >
                <div className="flex items-center gap-3 text-[#1c1917]">
                  <Package className="w-5 h-5 text-[#1e3a5f]" />
                  <span className="text-sm font-medium">Посмотреть историю заказов</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#78716c] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>

            {/* Logout */}
            <motion.div variants={itemVariant}>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-5 py-4 rounded-2xl border border-[#e7e5e0] bg-[#fafaf9] hover:bg-red-50 hover:border-red-200 transition-colors group text-left"
              >
                <LogOut className="w-5 h-5 text-[#78716c] group-hover:text-red-500 transition-colors" />
                <span className="text-sm font-medium text-[#78716c] group-hover:text-red-500 transition-colors">
                  Выйти из аккаунта
                </span>
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </div>
    </div>
  )
}

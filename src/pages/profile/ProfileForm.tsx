import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { userApi } from '../../api/user'
import type { UserProfile } from '../../types'

interface Props {
  profile: UserProfile
}

interface FormValues {
  username: string
  email: string
}

// Axios error with backend code field
function getBackendCode(err: unknown): number | null {
  const e = err as { response?: { data?: { code?: number } } }
  return e?.response?.data?.code ?? null
}

const cardVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export function ProfileForm({ profile }: Props) {
  const qc = useQueryClient()

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    defaultValues: { username: profile.username, email: profile.email },
  })

  // Sync defaults when profile changes (e.g. after save)
  useEffect(() => {
    reset({ username: profile.username, email: profile.email })
  }, [profile, reset])

  const username = watch('username')
  const email = watch('email')
  const hasChanged =
    username !== profile.username || email !== profile.email

  const mutation = useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: (updated) => {
      qc.setQueryData<UserProfile>(['profile'], updated)
      reset({ username: updated.username, email: updated.email })
      toast.success('Профиль обновлён ✓')
    },
    onError: (err) => {
      const code = getBackendCode(err)
      if (code === 604) {
        setError('email', { message: 'Этот email уже используется' })
      } else if (code === 605) {
        setError('username', { message: 'Это имя уже занято' })
      } else {
        toast.error('Ошибка при сохранении')
      }
    },
  })

  return (
    <motion.div variants={cardVariant} className="bg-white border border-[#e7e5e0] rounded-2xl shadow-sm p-6">
      <h2 className="text-base font-semibold text-[#1c1917] mb-3">Личные данные</h2>
      <div className="border-b border-[#e7e5e0] mb-5" />

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-[#1c1917] mb-1">
            Имя пользователя
          </label>
          <input
            {...register('username', {
              required: 'Обязательное поле',
              minLength: { value: 3, message: 'Минимум 3 символа' },
              maxLength: { value: 50, message: 'Максимум 50 символов' },
            })}
            type="text"
            className="w-full px-4 py-2.5 border border-[#e7e5e0] rounded-lg text-sm text-[#1c1917] focus:outline-none focus:border-[#1e3a5f] transition-colors"
          />
          {errors.username && (
            <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-[#1c1917] mb-1">Email</label>
          <input
            {...register('email', {
              required: 'Обязательное поле',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Неверный формат email',
              },
            })}
            type="email"
            className="w-full px-4 py-2.5 border border-[#e7e5e0] rounded-lg text-sm text-[#1c1917] focus:outline-none focus:border-[#1e3a5f] transition-colors"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!hasChanged || mutation.isPending}
          className="flex items-center justify-center gap-2 w-full bg-[#1e3a5f] hover:bg-[#2d5282] disabled:bg-stone-300 disabled:cursor-not-allowed text-white py-3 rounded-full font-medium text-sm transition-all"
        >
          {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          Сохранить изменения
        </button>
      </form>
    </motion.div>
  )
}

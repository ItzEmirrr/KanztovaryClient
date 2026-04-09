import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { userApi } from '../../api/user'

interface FormValues {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

function getBackendCode(err: unknown): number | null {
  const e = err as { response?: { data?: { code?: number } } }
  return e?.response?.data?.code ?? null
}

function getStrength(pw: string): { level: 0 | 1 | 2 | 3; label: string; color: string } {
  if (!pw || pw.length < 6) return { level: 0, label: 'Слабый', color: 'bg-red-400' }
  const hasUpper = /[A-Z]/.test(pw)
  const hasLower = /[a-z]/.test(pw)
  const hasDigit = /\d/.test(pw)
  const hasSpecial = /[^A-Za-z0-9]/.test(pw)
  const typeCount = [hasUpper, hasLower, hasDigit, hasSpecial].filter(Boolean).length
  if (pw.length >= 10 && typeCount >= 3) return { level: 3, label: 'Надёжный', color: 'bg-green-500' }
  if (pw.length >= 6 && typeCount >= 2) return { level: 2, label: 'Средний', color: 'bg-yellow-400' }
  return { level: 1, label: 'Слабый', color: 'bg-red-400' }
}

const cardVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.1 } },
}

function PwField({
  label,
  show,
  onToggle,
  error,
  children,
}: {
  label: string
  show: boolean
  onToggle: () => void
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1c1917] mb-1">{label}</label>
      <div className="relative">
        {children}
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78716c] hover:text-[#1c1917] transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

export function PasswordForm() {
  const [show, setShow] = useState({ current: false, next: false, confirm: false })
  const toggle = (key: keyof typeof show) =>
    setShow((s) => ({ ...s, [key]: !s[key] }))

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormValues>()

  const newPw = watch('newPassword') ?? ''
  const strength = getStrength(newPw)

  const mutation = useMutation({
    mutationFn: userApi.changePassword,
    onSuccess: () => {
      toast.success('Пароль успешно изменён ✓')
      reset()
    },
    onError: (err) => {
      const code = getBackendCode(err)
      if (code === 613) {
        setError('currentPassword', { message: 'Неверный текущий пароль' })
      } else if (code === 614) {
        setError('confirmPassword', { message: 'Пароли не совпадают' })
      } else {
        toast.error('Не удалось изменить пароль')
      }
    },
  })

  const inputCls =
    'w-full pl-4 pr-10 py-2.5 border border-[#e7e5e0] rounded-lg text-sm text-[#1c1917] focus:outline-none focus:border-[#1e3a5f] transition-colors'

  return (
    <motion.div variants={cardVariant} className="bg-white border border-[#e7e5e0] rounded-2xl shadow-sm p-6">
      <h2 className="text-base font-semibold text-[#1c1917] mb-3">Безопасность</h2>
      <div className="border-b border-[#e7e5e0] mb-5" />

      <form
        onSubmit={handleSubmit((d) => mutation.mutate(d))}
        className="space-y-4"
      >
        {/* Current password */}
        <PwField
          label="Текущий пароль"
          show={show.current}
          onToggle={() => toggle('current')}
          error={errors.currentPassword?.message}
        >
          <input
            {...register('currentPassword', { required: 'Обязательное поле' })}
            type={show.current ? 'text' : 'password'}
            placeholder="••••••"
            className={inputCls}
          />
        </PwField>

        {/* New password + strength */}
        <div>
          <PwField
            label="Новый пароль"
            show={show.next}
            onToggle={() => toggle('next')}
            error={errors.newPassword?.message}
          >
            <input
              {...register('newPassword', {
                required: 'Обязательное поле',
                minLength: { value: 6, message: 'Минимум 6 символов' },
              })}
              type={show.next ? 'text' : 'password'}
              placeholder="••••••"
              className={inputCls}
            />
          </PwField>

          {/* Strength indicator */}
          {newPw.length > 0 && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3].map((lvl) => (
                  <div
                    key={lvl}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      strength.level >= lvl ? strength.color : 'bg-stone-200'
                    }`}
                  />
                ))}
              </div>
              <p
                className={`text-xs font-medium ${
                  strength.level === 3
                    ? 'text-green-600'
                    : strength.level === 2
                    ? 'text-yellow-600'
                    : 'text-red-500'
                }`}
              >
                {strength.label}
              </p>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <PwField
          label="Подтвердите пароль"
          show={show.confirm}
          onToggle={() => toggle('confirm')}
          error={errors.confirmPassword?.message}
        >
          <input
            {...register('confirmPassword', {
              required: 'Обязательное поле',
              validate: (v) => v === newPw || 'Пароли не совпадают',
            })}
            type={show.confirm ? 'text' : 'password'}
            placeholder="••••••"
            className={inputCls}
          />
        </PwField>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="flex items-center justify-center gap-2 w-full bg-[#1e3a5f] hover:bg-[#2d5282] disabled:bg-stone-300 disabled:cursor-not-allowed text-white py-3 rounded-full font-medium text-sm transition-all"
        >
          {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          Изменить пароль
        </button>
      </form>
    </motion.div>
  )
}

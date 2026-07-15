import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../api/auth'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

interface FormData { email: string; password: string }

export function Login() {
  const [showPw, setShowPw] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const returnUrl = searchParams.get('returnUrl') ?? '/'

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ token, role }) => {
      login(token, role)
      navigate(returnUrl, { replace: true })
    },
    onError: () => toast.error('Неверный email или пароль'),
  })

  useEffect(() => {
    document.title = 'Вход — Канцтовары'
  }, [])

  return (
    <div className="w-full max-w-sm">
      <h1 className="font-serif text-3xl font-semibold text-[#1c1917] mb-2">Вход</h1>
      <p className="text-sm text-[#78716c] mb-8">Войдите, чтобы оформить заказ</p>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#1c1917] mb-1">Email</label>
          <input
            {...register('email', {
              required: 'Введите email',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Неверный формат email' },
            })}
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 border border-divider rounded-lg text-sm focus:outline-none focus:border-[#1e3a5f]"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1c1917] mb-1">Пароль</label>
          <div className="relative">
            <input
              {...register('password', {
                required: 'Введите пароль',
                minLength: { value: 6, message: 'Минимум 6 символов' },
              })}
              type={showPw ? 'text' : 'password'}
              placeholder="••••••"
              className="w-full px-4 py-2.5 pr-10 border border-divider rounded-lg text-sm focus:outline-none focus:border-[#1e3a5f]"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-[#1e3a5f] hover:bg-[#2d5282] disabled:bg-stone-300 text-white py-3 rounded-full font-medium transition-all"
        >
          {mutation.isPending ? 'Входим...' : 'Войти'}
        </button>
      </form>

      <p className="text-sm text-[#78716c] mt-6 text-center">
        Нет аккаунта?{' '}
        <Link to="/register" className="text-[#1e3a5f] hover:underline font-medium">
          Зарегистрироваться
        </Link>
      </p>
    </div>
  )
}

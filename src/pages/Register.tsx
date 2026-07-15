import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../api/auth'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

interface FormData {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export function Register() {
  const [showPw, setShowPw] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>()

  const mutation = useMutation({
    mutationFn: (data: Omit<FormData, 'confirmPassword'>) => authApi.register(data),
    onSuccess: ({ token, role }) => {
      login(token, role)
      navigate('/', { replace: true })
    },
    onError: () => toast.error('Ошибка при регистрации'),
  })

  useEffect(() => {
    document.title = 'Регистрация — Канцтовары'
  }, [])

  return (
    <div className="w-full max-w-sm">
      <h1 className="font-serif text-3xl font-semibold text-[#1c1917] mb-2">Регистрация</h1>
      <p className="text-sm text-[#78716c] mb-8">Создайте аккаунт для оформления заказов</p>

      <form
        onSubmit={handleSubmit(({ username, email, password }) =>
          mutation.mutate({ username, email, password }),
        )}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-[#1c1917] mb-1">Имя пользователя</label>
          <input
            {...register('username', { required: 'Введите имя пользователя' })}
            placeholder="username"
            className="w-full px-4 py-2.5 border border-divider rounded-lg text-sm focus:outline-none focus:border-[#1e3a5f]"
          />
          {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
        </div>

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
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1c1917] mb-1">Повторите пароль</label>
          <input
            {...register('confirmPassword', {
              required: 'Повторите пароль',
              validate: (v) => v === watch('password') || 'Пароли не совпадают',
            })}
            type="password"
            placeholder="••••••"
            className="w-full px-4 py-2.5 border border-divider rounded-lg text-sm focus:outline-none focus:border-[#1e3a5f]"
          />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-[#1e3a5f] hover:bg-[#2d5282] disabled:bg-stone-300 text-white py-3 rounded-full font-medium transition-all"
        >
          {mutation.isPending ? 'Регистрируем...' : 'Создать аккаунт'}
        </button>
      </form>

      <p className="text-sm text-[#78716c] mt-6 text-center">
        Уже есть аккаунт?{' '}
        <Link to="/login" className="text-[#1e3a5f] hover:underline font-medium">
          Войти
        </Link>
      </p>
    </div>
  )
}

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { MapPin, Phone, Mail, Clock, Send, Instagram } from 'lucide-react'
import toast from 'react-hot-toast'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

export function Contacts() {
  useEffect(() => { document.title = 'Контакты — Stationery' }, [])

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>()

  function onSubmit() {
    toast.success('Спасибо! Мы ответим в течение часа')
    reset()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-semibold text-[#1c1917] mb-10">Контакты</h1>

      <div className="grid md:grid-cols-2 gap-12 mb-12">
        {/* Form */}
        <div className="bg-white border border-divider rounded-2xl p-7">
          <h2 className="font-serif text-xl font-semibold text-[#1c1917] mb-5">Обратная связь</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1c1917] mb-1">Имя</label>
              <input
                {...register('name', { required: 'Введите имя' })}
                placeholder="Ваше имя"
                className="w-full px-4 py-2.5 border border-divider rounded-lg text-sm focus:outline-none focus:border-[#1e3a5f]"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1c1917] mb-1">Email</label>
              <input
                {...register('email', { required: 'Введите email' })}
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 border border-divider rounded-lg text-sm focus:outline-none focus:border-[#1e3a5f]"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1c1917] mb-1">Тема</label>
              <input
                {...register('subject', { required: 'Введите тему' })}
                placeholder="Тема сообщения"
                className="w-full px-4 py-2.5 border border-divider rounded-lg text-sm focus:outline-none focus:border-[#1e3a5f]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1c1917] mb-1">Сообщение</label>
              <textarea
                {...register('message', { required: 'Введите сообщение' })}
                rows={4}
                placeholder="Ваш вопрос или комментарий..."
                className="w-full px-4 py-2.5 border border-divider rounded-lg text-sm focus:outline-none focus:border-[#1e3a5f] resize-none"
              />
              {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-[#1e3a5f] hover:bg-[#2d5282] text-white py-3 rounded-full font-medium transition-all"
            >
              Отправить
            </button>
          </form>
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <h2 className="font-serif text-xl font-semibold text-[#1c1917] mb-5">Наши контакты</h2>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-[#1e3a5f] shrink-0 mt-0.5" />
                <span className="text-[#78716c]">г. Бишкек, ул. Киевская 96Б</span>
              </li>
              <li className="flex gap-3">
                <Phone className="w-5 h-5 text-[#1e3a5f] shrink-0 mt-0.5" />
                <a href="tel:+996755724838" className="text-[#78716c] hover:text-[#1e3a5f] transition-colors">
                  +996 755 724 838
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="w-5 h-5 text-[#1e3a5f] shrink-0 mt-0.5" />
                <a href="mailto:dtoktomambetova@gmail.com" className="text-[#78716c] hover:text-[#1e3a5f] transition-colors">
                  dtoktomambetova@gmail.com
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="w-5 h-5 text-[#1e3a5f] shrink-0 mt-0.5" />
                <span className="text-[#78716c]">Пн–Пт 8:00–18:00</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[#1c1917] mb-3">Соцсети</h3>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/dinarakanztovary?igsh=MThobHltbmJnNWw5aw=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#f5f0e8] flex items-center justify-center hover:bg-[#1e3a5f] hover:text-white transition-colors text-[#1e3a5f]"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/996755724838"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#f5f0e8] flex items-center justify-center hover:bg-[#1e3a5f] hover:text-white transition-colors text-[#1e3a5f]"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="w-full h-72 rounded-2xl overflow-hidden bg-[#e7e5e0] flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-10 h-10 text-stone-400 mx-auto mb-2" />
          <p className="text-sm text-[#78716c]">г. Бишкек, ул. Киевская 96Б</p>
        </div>
      </div>
    </div>
  )
}

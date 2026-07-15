import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, MessageCircle } from 'lucide-react'
import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'

const FAQ_ITEMS = [
  {
    q: 'Как сделать заказ?',
    a: 'Выберите товары в каталоге, добавьте их в корзину, затем перейдите к оформлению заказа. Заполните номер телефона и выберите способ получения. Наш менеджер свяжется с вами для подтверждения.',
  },
  {
    q: 'Как оплатить заказ?',
    a: 'Мы принимаем оплату наличными и банковскими картами при получении. Также доступны мобильные кошельки MBANK и MKassa.',
  },
  {
    q: 'Можно ли вернуть товар?',
    a: 'Да, мы принимаем возврат товара надлежащего качества в течение 14 дней с момента получения. Товар должен быть в оригинальной упаковке и без следов использования.',
  },
  {
    q: 'Как отследить статус заказа?',
    a: 'Войдите в личный кабинет и перейдите в раздел «Мои заказы». Там вы увидите текущий статус вашего заказа и историю изменений.',
  },
  {
    q: 'Есть ли скидки для постоянных клиентов?',
    a: 'Да! Постоянные покупатели получают персональные скидки и уведомления об акциях. Следите за нашими соцсетями, чтобы не пропустить специальные предложения.',
  },
  {
    q: 'Какие бренды вы продаёте?',
    a: 'Мы работаем с ведущими мировыми брендами канцелярии: Moleskine, Leuchtturm1917, Pilot, Staedtler, Faber-Castell и многими другими. Полный список доступен в каталоге.',
  },
  {
    q: 'Как связаться с менеджером?',
    a: 'Вы можете позвонить нам по номеру +996 755 724 838, написать на dtoktomambetova@gmail.com или связаться через Telegram. Работаем Пн–Пт 8:00–18:00.',
  },
  {
    q: 'Есть ли доставка за пределы Бишкека?',
    a: 'Да, мы отправляем заказы по всему Кыргызстану. Стоимость и сроки доставки в регионы рассчитываются индивидуально — уточните у менеджера.',
  },
]

export function Faq() {
  const [search, setSearch] = useState('')
  useEffect(() => { document.title = 'FAQ — Канцтовары' }, [])

  const filtered = FAQ_ITEMS.filter(
    (item) =>
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="font-serif text-4xl font-semibold text-[#1c1917] mb-4">Часто задаваемые вопросы</h1>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по вопросам..."
          className="w-full pl-10 pr-4 py-3 border border-divider rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f] bg-white"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-[#78716c] text-center py-8">Ничего не найдено по запросу «{search}»</p>
      ) : (
        <Accordion.Root type="multiple" className="space-y-3">
          {filtered.map((item, i) => (
            <Accordion.Item key={i} value={String(i)} className="bg-white border border-divider rounded-xl overflow-hidden">
              <Accordion.Trigger className="group flex w-full items-center justify-between px-6 py-4 font-medium text-[#1c1917] hover:bg-stone-50 transition-colors text-left">
                {item.q}
                <ChevronDown className="w-5 h-5 shrink-0 ml-4 transition-transform duration-200 group-data-[state=open]:rotate-180 text-[#78716c]" />
              </Accordion.Trigger>
              <Accordion.Content className="px-6 pb-4 text-sm text-[#78716c] leading-relaxed data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
                {item.a}
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      )}

      {/* CTA */}
      <div className="mt-12 bg-[#1e3a5f] text-white rounded-2xl p-8 text-center">
        <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-80" />
        <h2 className="font-serif text-xl font-semibold mb-2">Не нашли ответ?</h2>
        <p className="text-white/70 text-sm mb-4">Напишите нам — мы ответим в течение часа</p>
        <Link
          to="/contacts"
          className="inline-block border border-white text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-white hover:text-[#1e3a5f] transition-colors"
        >
          Написать нам
        </Link>
      </div>
    </div>
  )
}

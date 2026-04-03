import { Link } from 'react-router-dom'
import { Instagram, Send, Phone, Mail, MapPin, Clock } from 'lucide-react'
import { useCategories } from '../../hooks/useProducts'

export function Footer() {
  const { data: categories } = useCategories()
  const rootCategories = categories?.filter((c) => c.parentCategoryId === null).slice(0, 6) ?? []

  return (
    <footer className="bg-[#1c1917] text-white">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Col 1: Brand */}
          <div>
            <div className="font-serif text-2xl font-semibold mb-3">Stationery</div>
            <p className="text-sm text-white/60 leading-relaxed mb-5">
              Канцелярия, которая вдохновляет. Тщательно отобранные инструменты для тех, кто ценит качество письма.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/dinarakanztovary?igsh=MThobHltbmJnNWw5aw=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#1e3a5f] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#1e3a5f] transition-colors"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#1e3a5f] transition-colors"
                aria-label="WhatsApp"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Catalog */}
          <div>
            <h4 className="font-semibold mb-4">Каталог</h4>
            <ul className="space-y-2">
              {rootCategories.length > 0
                ? rootCategories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        to={`/catalog?categoryId=${cat.id}`}
                        className="text-sm text-white/60 hover:text-white transition-colors"
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))
                : ['Ручки и карандаши', 'Блокноты', 'Маркеры', 'Скетчбуки', 'Органайзеры'].map((name) => (
                    <li key={name}>
                      <Link to="/catalog" className="text-sm text-white/60 hover:text-white transition-colors">
                        {name}
                      </Link>
                    </li>
                  ))}
            </ul>
          </div>

          {/* Col 3: Info */}
          <div>
            <h4 className="font-semibold mb-4">Информация</h4>
            <ul className="space-y-2">
              {[
                { label: 'О компании', to: '/about' },
                { label: 'Доставка и оплата', to: '/delivery' },
                { label: 'FAQ', to: '/faq' },
                { label: 'Контакты', to: '/contacts' },
              ].map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-sm text-white/60 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contacts */}
          <div>
            <h4 className="font-semibold mb-4">Контакты</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex gap-2">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-white/40" />
                г. Бишкек, ул. Киевская 96Б
              </li>
              <li className="flex gap-2">
                <Phone className="w-4 h-4 shrink-0 mt-0.5 text-white/40" />
                <a href="tel:+996755724838" className="hover:text-white transition-colors">
                  +996 755 724 838
                </a>
              </li>
              <li className="flex gap-2">
                <Mail className="w-4 h-4 shrink-0 mt-0.5 text-white/40" />
                <a href="mailto:dtoktomambetova@gmail.com" className="hover:text-white transition-colors">
                  dtoktomambetova@gmail.com
                </a>
              </li>
              <li className="flex gap-2">
                <Clock className="w-4 h-4 shrink-0 mt-0.5 text-white/40" />
                Пн–Пт 8:00–17:00
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-sm text-white/40">© 2025 Stationery. Все права защищены.</p>
          <p className="text-xs text-white/30">Бишкек, Кыргызстан</p>
        </div>
      </div>
    </footer>
  )
}

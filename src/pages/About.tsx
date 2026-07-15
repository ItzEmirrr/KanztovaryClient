import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Pen, Heart, Leaf } from 'lucide-react'

function StatCard({ value, label }: { value: string; label: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="font-serif text-4xl font-bold text-[#1e3a5f] mb-1">{value}</div>
      <div className="text-sm text-[#78716c]">{label}</div>
    </motion.div>
  )
}

export function About() {
  useEffect(() => { document.title = 'О компании — Канцтовары' }, [])

  return (
    <div>
      {/* Hero */}
      <div className="relative h-80 bg-[#1e3a5f] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=1200&q=80"
          alt="О нас"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <h1 className="relative font-serif text-5xl font-semibold text-white">О нас</h1>
      </div>

      {/* Story */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-3xl font-semibold text-[#1c1917] mb-6">Наша история</h2>
            <p className="text-[#78716c] leading-relaxed mb-4">
              Мы работаем на рынке с 2010-года. За эти годы мы выросли из маленького магазина в центре Бишкека до одного из крупнейших поставщиков канцелярских товаров в Кыргызстане, обслуживающего тысячи клиентов по всей стране.
            </p>
            <p className="text-[#78716c] leading-relaxed">
              Мы тщательно отбираем каждый продукт — от ручек до блокнотов — чтобы вы могли найти именно то, что раскроет ваш потенциал.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden h-72">
            <img
              src="https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=600&q=80"
              alt="Наш магазин"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#f5f0e8] py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-semibold text-[#1c1917] mb-10 text-center">Наши ценности</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Pen, title: 'Качество', desc: 'Только проверенные бренды с историей и репутацией' },
              { icon: Heart, title: 'Забота', desc: 'Персональный подход к каждому покупателю' },
              { icon: Leaf, title: 'Экология', desc: 'Ответственный выбор материалов и упаковки' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-[#1e3a5f]" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#1c1917] mb-2">{title}</h3>
                <p className="text-sm text-[#78716c]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCard value="17" label="лет на рынке" />
          <StatCard value="50+" label="брендов" />
          <StatCard value="1000+" label="SKU" />
          <StatCard value="10 000+" label="клиентов" />
        </div>
      </section>

      {/* Team */}
      <section className="bg-[#f5f0e8] py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-semibold text-[#1c1917] mb-10 text-center">Наша команда</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            {[
              { name: 'Динара Токтомамбетова', role: 'Основатель и директор' },
              { name: 'Нарынбек уулу Урмат', role: 'Исполняющий обязанности директора' },
              { name: 'Эмир Токтомамбетов', role: 'Ведущий программист' },
            ].map(({ name, role }, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center">
                <div
                  className="w-20 h-20 rounded-full mx-auto mb-4"
                  style={{ background: `linear-gradient(135deg, #1e3a5f ${i * 30}%, #b45309)` }}
                />
                <p className="font-semibold text-[#1c1917]">{name}</p>
                <p className="text-sm text-[#78716c] mt-0.5">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

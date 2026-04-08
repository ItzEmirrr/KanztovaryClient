import { useEffect } from 'react'
import { Store, Truck, CreditCard, Banknote, Clock } from 'lucide-react'
import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { cn } from '../lib/utils'

export function Delivery() {
  useEffect(() => { document.title = 'Доставка и оплата — Stationery' }, [])

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="font-serif text-4xl font-semibold text-[#1c1917] mb-10">Доставка и оплата</h1>

      <Accordion.Root type="multiple" defaultValue={['delivery']} className="space-y-3">
        {/* Delivery methods */}
        <Accordion.Item value="delivery" className="bg-white border border-divider rounded-xl overflow-hidden">
          <Accordion.Trigger className={cn(
            'group flex w-full items-center justify-between px-6 py-4 font-semibold text-[#1c1917] hover:bg-stone-50 transition-colors',
          )}>
            Способы получения
            <ChevronDown className="w-5 h-5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </Accordion.Trigger>
          <Accordion.Content className="px-6 pb-5 text-sm text-[#78716c] space-y-4 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
            <div className="flex gap-3 p-4 bg-[#f5f0e8] rounded-xl">
              <Store className="w-5 h-5 text-[#1e3a5f] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#1c1917] mb-1">Самовывоз</p>
                <p>г. Бишкек, ул. Киевская 96Б</p>
                <p className="mt-1">Пн–Пт 8:00–17:00</p>
              </div>
            </div>
            <div className="flex gap-3 p-4 bg-[#f5f0e8] rounded-xl">
              <Truck className="w-5 h-5 text-[#1e3a5f] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#1c1917] mb-1">Доставка курьером</p>
                <p>По Бишкеку и пригороду</p>
                <table className="mt-2 w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-divider">
                      <th className="text-left py-1.5 pr-4 font-medium text-[#1c1917]">Сумма заказа</th>
                      <th className="text-left py-1.5 font-medium text-[#1c1917]">Стоимость доставки</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-divider">
                      <td className="py-1.5 pr-4">до 10 000 сом</td>
                      <td className="py-1.5">По согласованию</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 pr-4">от 10 000 сом</td>
                      <td className="py-1.5 text-green-600 font-medium">Бесплатно</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Accordion.Content>
        </Accordion.Item>

        {/* Payment */}
        <Accordion.Item value="payment" className="bg-white border border-divider rounded-xl overflow-hidden">
          <Accordion.Trigger className="group flex w-full items-center justify-between px-6 py-4 font-semibold text-[#1c1917] hover:bg-stone-50 transition-colors">
            Способы оплаты
            <ChevronDown className="w-5 h-5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </Accordion.Trigger>
          <Accordion.Content className="px-6 pb-5 text-sm text-[#78716c] space-y-3 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Banknote, label: 'Наличные' },
                { icon: CreditCard, label: 'Банковская карта' },
                { icon: CreditCard, label: 'MBANK' },
                { icon: CreditCard, label: 'MKassa' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 p-3 bg-[#f5f0e8] rounded-xl">
                  <Icon className="w-4 h-4 text-[#1e3a5f]" />
                  <span className="text-[#1c1917] font-medium">{label}</span>
                </div>
              ))}
            </div>
            <p>Оплата при получении для обоих способов доставки.</p>
          </Accordion.Content>
        </Accordion.Item>

        {/* Timing */}
        <Accordion.Item value="timing" className="bg-white border border-divider rounded-xl overflow-hidden">
          <Accordion.Trigger className="group flex w-full items-center justify-between px-6 py-4 font-semibold text-[#1c1917] hover:bg-stone-50 transition-colors">
            Сроки
            <ChevronDown className="w-5 h-5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </Accordion.Trigger>
          <Accordion.Content className="px-6 pb-5 text-sm text-[#78716c] space-y-3 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
            <div className="flex gap-3 p-4 bg-[#f5f0e8] rounded-xl">
              <Clock className="w-5 h-5 text-[#1e3a5f] shrink-0" />
              <div>
                <p className="font-medium text-[#1c1917]">Самовывоз</p>
                <p>В день заказа (по согласованию)</p>
              </div>
            </div>
            <div className="flex gap-3 p-4 bg-[#f5f0e8] rounded-xl">
              <Truck className="w-5 h-5 text-[#1e3a5f] shrink-0" />
              <div>
                <p className="font-medium text-[#1c1917]">Доставка</p>
                <p>1–2 рабочих дня по Бишкеку</p>
              </div>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  )
}

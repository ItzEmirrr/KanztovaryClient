import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden md:flex w-2/5 bg-[#1e3a5f] flex-col items-center justify-center p-12 text-white">
        <div className="font-serif text-3xl font-semibold mb-8">Stationery</div>
        <blockquote className="font-serif italic text-lg text-white/80 text-center leading-relaxed max-w-xs">
          «Правильный инструмент превращает мысль в произведение. Перо, бумага, намерение — вот что создаёт шедевры.»
        </blockquote>
        <div className="mt-8 flex gap-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/30" />
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#fafaf9]">
        <Outlet />
      </div>
    </div>
  )
}

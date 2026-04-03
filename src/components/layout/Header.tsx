import { useState, useCallback, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, User, ShoppingBag, Menu, X, LogOut, UserCircle, Package, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'

const NAV = [
  { label: 'Главная', to: '/' },
  { label: 'Каталог', to: '/catalog' },
  { label: 'Отзывы', to: '/reviews' },
  { label: 'О нас', to: '/about' },
  { label: 'Доставка', to: '/delivery' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Контакты', to: '/contacts' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const navigate = useNavigate()
  const { token, logout } = useAuthStore()
  const setTotalItems = useCartStore((s) => s.setTotalItems)
  const totalItems = useCartStore((s) => s.totalItems)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const qc = useQueryClient()

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = useCallback(
    (val: string) => {
      setSearchValue(val)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        if (val.trim()) navigate(`/catalog?search=${encodeURIComponent(val.trim())}`)
      }, 400)
    },
    [navigate],
  )

  function handleLogout() {
    logout()
    setTotalItems(0)
    qc.clear()
    setUserMenuOpen(false)
    navigate('/', { replace: true })
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-divider">
      {/* Top bar */}
      <div className="hidden md:block bg-[#1e3a5f] text-white text-xs text-center py-1.5">
        Бесплатная доставка при заказе от 10 000 сом
      </div>

      {/* Main row */}
      <div className="container mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="font-serif text-2xl font-semibold text-[#1e3a5f] shrink-0">
          Stationery
        </Link>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-sm mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Поиск товаров..."
            className="w-full pl-9 pr-4 py-2 rounded-full border border-divider bg-[#fafaf9] text-sm focus:outline-none focus:border-[#1e3a5f] transition-colors"
          />
        </div>

        {/* Right icons */}
        <div className="ml-auto flex items-center gap-3">
          {/* Smart picker */}
          {token && (
            <Link
              to="/smart-picker"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1e3a5f] text-white text-xs font-medium hover:bg-[#2d5282] transition-colors"
              aria-label="Умный подбор"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Умный подбор
            </Link>
          )}

          {/* User icon / dropdown */}
          {token ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((o) => !o)}
                className="p-2 hover:text-[#1e3a5f] transition-colors rounded-full"
                aria-label="Аккаунт"
              >
                <User className="w-5 h-5" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white border border-divider rounded-xl shadow-lg overflow-hidden z-50"
                  >
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-sm text-[#1c1917] hover:bg-[#f5f0e8] transition-colors"
                    >
                      <UserCircle className="w-4 h-4 text-[#1e3a5f]" />
                      Мой профиль
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-sm text-[#1c1917] hover:bg-[#f5f0e8] transition-colors"
                    >
                      <Package className="w-4 h-4 text-[#1e3a5f]" />
                      Мои заказы
                    </Link>
                    <div className="border-t border-divider" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Выйти
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              className="p-2 hover:text-[#1e3a5f] transition-colors"
              aria-label="Войти"
            >
              <User className="w-5 h-5" />
            </Link>
          )}

          <Link to="/cart" className="relative p-2 hover:text-[#1e3a5f] transition-colors" aria-label="Корзина">
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <motion.span
                key={totalItems}
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 bg-[#1e3a5f] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
              >
                {totalItems > 99 ? '99+' : totalItems}
              </motion.span>
            )}
          </Link>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Меню"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Nav row */}
      <nav className="hidden md:block border-t border-divider">
        <div className="container mx-auto px-4">
          <ul className="flex gap-6 h-10 items-center">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="text-sm text-[#78716c] hover:text-[#1e3a5f] transition-colors font-medium"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed left-0 top-0 h-full w-72 bg-white z-50 shadow-xl flex flex-col"
            >
              <div className="p-5 border-b border-divider flex items-center justify-between">
                <span className="font-serif text-xl text-[#1e3a5f]">Stationery</span>
                <button onClick={() => setMobileOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 flex-1">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Поиск..."
                    className="w-full pl-9 pr-4 py-2 rounded-full border border-divider bg-[#fafaf9] text-sm focus:outline-none"
                  />
                </div>
                <nav>
                  <ul className="space-y-1">
                    {NAV.map((item) => (
                      <li key={item.to}>
                        <Link
                          to={item.to}
                          onClick={() => setMobileOpen(false)}
                          className="block px-3 py-2.5 rounded-lg text-[#1c1917] hover:bg-[#f5f0e8] transition-colors font-medium"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                {token && (
                  <div className="mt-4 border-t border-divider pt-4 space-y-1">
                    <Link
                      to="/smart-picker"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-[#1e3a5f] text-white hover:bg-[#2d5282] transition-colors font-medium text-sm mb-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      Умный подбор
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[#1c1917] hover:bg-[#f5f0e8] transition-colors font-medium text-sm"
                    >
                      <UserCircle className="w-4 h-4 text-[#1e3a5f]" />
                      Мой профиль
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[#1c1917] hover:bg-[#f5f0e8] transition-colors font-medium text-sm"
                    >
                      <Package className="w-4 h-4 text-[#1e3a5f]" />
                      Мои заказы
                    </Link>
                    <button
                      onClick={() => { setMobileOpen(false); handleLogout() }}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors font-medium text-sm w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}

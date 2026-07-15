import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import { MainLayout } from './components/layout/MainLayout'
import { AuthLayout } from './components/layout/AuthLayout'
import { ProtectedRoute } from './components/shared/ProtectedRoute'

import { Home } from './pages/Home'
import { Catalog } from './pages/Catalog'
import { ProductDetail } from './pages/ProductDetail'
import { About } from './pages/About'
import { Delivery } from './pages/Delivery'
import { Faq } from './pages/Faq'
import { Contacts } from './pages/Contacts'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Cart } from './pages/Cart'
import { Checkout } from './pages/Checkout'
import { CheckoutSuccess } from './pages/CheckoutSuccess'
import { Orders } from './pages/Orders'
import { OrderDetail } from './pages/OrderDetail'
import { ProfilePage } from './pages/profile/ProfilePage'
import { SmartPicker } from './pages/SmartPicker'
import { Reviews } from './pages/Reviews'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      transition={{ duration: 0.25, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Auth layout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        </Route>

        {/* Main layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/catalog" element={<PageTransition><Catalog /></PageTransition>} />
          <Route path="/catalog/:id" element={<PageTransition><ProductDetail /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/delivery" element={<PageTransition><Delivery /></PageTransition>} />
          <Route path="/faq" element={<PageTransition><Faq /></PageTransition>} />
          <Route path="/contacts" element={<PageTransition><Contacts /></PageTransition>} />

          {/* Public cart & checkout (guests allowed) */}
          <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
          <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
          <Route path="/checkout/success" element={<PageTransition><CheckoutSuccess /></PageTransition>} />
          {/* Protected */}
          <Route path="/orders" element={<ProtectedRoute><PageTransition><Orders /></PageTransition></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><PageTransition><OrderDetail /></PageTransition></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><PageTransition><ProfilePage /></PageTransition></ProtectedRoute>} />
          <Route path="/smart-picker" element={<ProtectedRoute><PageTransition><SmartPicker /></PageTransition></ProtectedRoute>} />
          <Route path="/reviews" element={<PageTransition><Reviews /></PageTransition>} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

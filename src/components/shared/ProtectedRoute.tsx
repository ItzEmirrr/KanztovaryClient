import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

interface Props { children: React.ReactNode }

export function ProtectedRoute({ children }: Props) {
  const { token } = useAuthStore()
  const location = useLocation()

  if (!token) {
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(location.pathname + location.search)}`} replace />
  }

  return <>{children}</>
}

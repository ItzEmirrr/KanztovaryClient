import { create } from 'zustand'

interface AuthState {
  token: string | null
  role: 'ADMIN' | 'USER' | null
  login: (token: string, role: 'ADMIN' | 'USER') => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  role: (localStorage.getItem('role') as 'ADMIN' | 'USER' | null),

  login(token, role) {
    localStorage.setItem('token', token)
    localStorage.setItem('role', role)
    set({ token, role })
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    set({ token: null, role: null })
  },
}))

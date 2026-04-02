import { create } from 'zustand'

interface CartState {
  totalItems: number
  setTotalItems: (n: number) => void
}

export const useCartStore = create<CartState>((set) => ({
  totalItems: 0,
  setTotalItems: (n) => set({ totalItems: n }),
}))

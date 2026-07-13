import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface GuestCartItem {
  productId: number
  productName: string
  productSku: string
  productMainImage: string | null
  variantId: number | null
  variantSku: string | null
  variantAttributes: Record<string, string> | null
  unitPrice: number
  quantity: number
}

interface GuestCartStore {
  items: GuestCartItem[]
  addItem: (item: GuestCartItem) => void
  setQuantity: (productId: number, variantId: number | null, quantity: number) => void
  removeItem: (productId: number, variantId: number | null) => void
  clear: () => void
}

export const useGuestCartStore = create<GuestCartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (newItem) =>
        set((state) => {
          const idx = state.items.findIndex(
            (i) => i.productId === newItem.productId && i.variantId === newItem.variantId
          )
          if (idx >= 0) {
            const updated = [...state.items]
            updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + newItem.quantity }
            return { items: updated }
          }
          return { items: [...state.items, newItem] }
        }),
      setQuantity: (productId, variantId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.variantId === variantId ? { ...i, quantity } : i
          ),
        })),
      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          ),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: 'guest-cart' }
  )
)

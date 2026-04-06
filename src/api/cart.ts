import { api } from './axios'
import type { Cart } from '../types'

export const cartApi = {
  getCart: () =>
    api.get<Cart>('/api/v1/cart').then((r) => r.data),

  addItem: (body: { productId: number; variantId?: number; quantity: number }) =>
    api.post<Cart>('/api/v1/cart/items', body).then((r) => r.data),

  updateItem: (itemId: number, quantity: number) =>
    api.put<Cart>(`/api/v1/cart/items/${itemId}`, { quantity }).then((r) => r.data),

  removeItem: (itemId: number) =>
    api.delete<Cart>(`/api/v1/cart/items/${itemId}`).then((r) => r.data),

  clearCart: () =>
    api.delete<void>('/api/v1/cart'),

  checkout: (body: {
    deliveryType: 'PICKUP' | 'DELIVERY'
    deliveryAddress?: string
    phoneNumber: string
  }) => api.post('/api/v1/cart/checkout', body).then((r) => r.data),
}

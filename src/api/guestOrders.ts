import { api } from './axios'

export interface GuestCheckoutRequest {
  customerName: string
  phoneNumber: string
  deliveryType: 'PICKUP' | 'DELIVERY'
  deliveryAddress?: string
  items: { productId: number; quantity: number }[]
}

export const guestOrdersApi = {
  checkout: (body: GuestCheckoutRequest) =>
    api.post<{ id: number }>('/api/v1/orders/guest', body).then((r) => r.data),
}

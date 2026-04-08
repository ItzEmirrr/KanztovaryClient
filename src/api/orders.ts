import { api } from './axios'
import type { Order, OrderPage } from '../types'

export interface OrdersParams {
  status?: string
  from?: string
  to?: string
  page?: number
  size?: number
}

export const ordersApi = {
  getMyOrders: (params: OrdersParams) =>
    api.get<OrderPage>('/api/v1/orders/my', { params }).then((r) => r.data),

  getMyOrder: (id: number) =>
    api.get<Order>(`/api/v1/orders/my/${id}`).then((r) => r.data),
}

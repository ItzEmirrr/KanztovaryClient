import { useQuery } from '@tanstack/react-query'
import { ordersApi, type OrdersParams } from '../api/orders'

export function useOrders(params: OrdersParams) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => ordersApi.getMyOrders(params),
    staleTime: 0,
  })
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.getMyOrder(id),
    staleTime: 0,
  })
}

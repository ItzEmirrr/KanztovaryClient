import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { cartApi } from '../api/cart'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

export function useCart() {
  const { token } = useAuthStore()
  const setTotalItems = useCartStore((s) => s.setTotalItems)
  const qc = useQueryClient()

  const query = useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.getCart,
    enabled: !!token,
    staleTime: 0,
  })

  useEffect(() => {
    if (query.data) {
      setTotalItems(query.data.totalItems)
    }
  }, [query.data, setTotalItems])

  const addItem = useMutation({
    mutationFn: cartApi.addItem,
    onSuccess: (cart) => {
      qc.setQueryData(['cart'], cart)
      setTotalItems(cart.totalItems)
      toast.success('Добавлено в корзину')
    },
    onError: () => toast.error('Не удалось добавить в корзину'),
  })

  const updateItem = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      cartApi.updateItem(itemId, quantity),
    onSuccess: (cart) => {
      qc.setQueryData(['cart'], cart)
      setTotalItems(cart.totalItems)
    },
    onError: () => toast.error('Ошибка обновления'),
  })

  const removeItem = useMutation({
    mutationFn: cartApi.removeItem,
    onSuccess: (cart) => {
      qc.setQueryData(['cart'], cart)
      setTotalItems(cart.totalItems)
    },
    onError: () => toast.error('Ошибка удаления'),
  })

  const clearCart = useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: () => {
      qc.setQueryData(['cart'], null)
      setTotalItems(0)
    },
    onError: () => toast.error('Ошибка очистки корзины'),
  })

  return { cart: query.data, isLoading: query.isLoading, addItem, updateItem, removeItem, clearCart }
}

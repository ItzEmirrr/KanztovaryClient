import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { cartApi } from '../api/cart'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { useGuestCartStore, type GuestCartItem } from '../store/guestCartStore'
import type { Cart } from '../types'
import toast from 'react-hot-toast'

export interface AddItemArgs {
  productId: number
  variantId?: number | null
  quantity: number
  // Extra info needed for guest cart
  productName?: string
  productSku?: string
  productMainImage?: string | null
  variantSku?: string | null
  variantAttributes?: Record<string, string> | null
  unitPrice?: number
}

export interface UpdateItemArgs {
  productId: number
  variantId: number | null
  quantity: number
}

export interface RemoveItemArgs {
  productId: number
  variantId: number | null
}

function buildGuestCart(items: GuestCartItem[]): Cart | null {
  if (items.length === 0) return null
  return {
    id: 0,
    items: items.map((i) => ({
      id: 0,
      productId: i.productId,
      productName: i.productName,
      productSku: i.productSku,
      productMainImage: i.productMainImage,
      variantId: i.variantId,
      variantSku: i.variantSku,
      variantAttributes: i.variantAttributes,
      unitPrice: i.unitPrice,
      quantity: i.quantity,
      subtotal: i.unitPrice * i.quantity,
    })),
    totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
    totalPrice: items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    updatedAt: new Date().toISOString(),
  }
}

export function useCart() {
  const { token } = useAuthStore()
  const isAuth = !!token
  const setTotalItems = useCartStore((s) => s.setTotalItems)
  const qc = useQueryClient()
  const guestStore = useGuestCartStore()

  // Server cart (only fetched when authenticated)
  const query = useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.getCart,
    enabled: isAuth,
    staleTime: 0,
  })

  // Keep header badge in sync
  useEffect(() => {
    if (isAuth && query.data) {
      setTotalItems(query.data.totalItems)
    }
  }, [isAuth, query.data, setTotalItems])

  useEffect(() => {
    if (!isAuth) {
      const total = guestStore.items.reduce((sum, i) => sum + i.quantity, 0)
      setTotalItems(total)
    }
  }, [isAuth, guestStore.items, setTotalItems])

  // ── Server mutations ──────────────────────────────────────────────────────
  const serverAddItem = useMutation({
    mutationFn: (args: AddItemArgs) =>
      cartApi.addItem({
        productId: args.productId,
        variantId: args.variantId ?? undefined,
        quantity: args.quantity,
      }),
    onSuccess: (cart) => {
      qc.setQueryData(['cart'], cart)
      setTotalItems(cart.totalItems)
      toast.success('Добавлено в корзину')
    },
    onError: () => toast.error('Не удалось добавить в корзину'),
  })

  const serverUpdateItem = useMutation({
    mutationFn: ({ productId, variantId, quantity }: UpdateItemArgs) => {
      const item = query.data?.items.find(
        (i) => i.productId === productId && i.variantId === variantId
      )
      if (!item) throw new Error('Позиция не найдена в корзине')
      return cartApi.updateItem(item.id, quantity)
    },
    onSuccess: (cart) => {
      qc.setQueryData(['cart'], cart)
      setTotalItems(cart.totalItems)
    },
    onError: () => toast.error('Ошибка обновления'),
  })

  const serverRemoveItem = useMutation({
    mutationFn: ({ productId, variantId }: RemoveItemArgs) => {
      const item = query.data?.items.find(
        (i) => i.productId === productId && i.variantId === variantId
      )
      if (!item) throw new Error('Позиция не найдена в корзине')
      return cartApi.removeItem(item.id)
    },
    onSuccess: (cart) => {
      qc.setQueryData(['cart'], cart)
      setTotalItems(cart.totalItems)
    },
    onError: () => toast.error('Ошибка удаления'),
  })

  const serverClearCart = useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: () => {
      qc.setQueryData(['cart'], null)
      setTotalItems(0)
    },
    onError: () => toast.error('Ошибка очистки корзины'),
  })

  // ── Guest helpers ─────────────────────────────────────────────────────────
  const guestAddItem = (args: AddItemArgs, opts?: { onSuccess?: () => void }) => {
    guestStore.addItem({
      productId: args.productId,
      productName: args.productName ?? '',
      productSku: args.productSku ?? '',
      productMainImage: args.productMainImage ?? null,
      variantId: args.variantId ?? null,
      variantSku: args.variantSku ?? null,
      variantAttributes: args.variantAttributes ?? null,
      unitPrice: args.unitPrice ?? 0,
      quantity: args.quantity,
    })
    toast.success('Добавлено в корзину')
    opts?.onSuccess?.()
  }

  // ── Unified interface ─────────────────────────────────────────────────────
  if (isAuth) {
    return {
      cart: query.data ?? null,
      isLoading: query.isLoading,
      isGuest: false as const,
      addItem: {
        mutate: (args: AddItemArgs, opts?: { onSuccess?: () => void }) =>
          serverAddItem.mutate(args, { onSuccess: opts?.onSuccess }),
        isPending: serverAddItem.isPending,
      },
      updateItem: {
        mutate: (args: UpdateItemArgs) => serverUpdateItem.mutate(args),
        isPending: serverUpdateItem.isPending,
      },
      removeItem: {
        mutate: (args: RemoveItemArgs) => serverRemoveItem.mutate(args),
        isPending: serverRemoveItem.isPending,
      },
      clearCart: {
        mutate: () => serverClearCart.mutate(),
        isPending: serverClearCart.isPending,
      },
    }
  }

  return {
    cart: buildGuestCart(guestStore.items),
    isLoading: false,
    isGuest: true as const,
    addItem: {
      mutate: guestAddItem,
      isPending: false,
    },
    updateItem: {
      mutate: ({ productId, variantId, quantity }: UpdateItemArgs) =>
        guestStore.setQuantity(productId, variantId, quantity),
      isPending: false,
    },
    removeItem: {
      mutate: ({ productId, variantId }: RemoveItemArgs) =>
        guestStore.removeItem(productId, variantId),
      isPending: false,
    },
    clearCart: {
      mutate: () => {
        guestStore.clear()
        setTotalItems(0)
      },
      isPending: false,
    },
  }
}

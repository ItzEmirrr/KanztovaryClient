import { useQuery } from '@tanstack/react-query'
import { productsApi, type ProductsParams } from '../api/products'

export function useProducts(params: ProductsParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsApi.getProducts(params),
    staleTime: 60_000,
  })
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getProduct(id),
    staleTime: 60_000,
  })
}

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: productsApi.getBrands,
    staleTime: 300_000,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: productsApi.getCategories,
    staleTime: 300_000,
  })
}

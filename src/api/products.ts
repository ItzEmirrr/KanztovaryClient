import { api } from './axios'
import type { Product, ProductPage, Brand, Category } from '../types'

export interface ProductsParams {
  search?: string
  categoryId?: number
  brandId?: number
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  sortBy?: string
  page?: number
  size?: number
  status?: string
}

export const productsApi = {
  getProducts: (params: ProductsParams) =>
    api.get<ProductPage>('/api/v1/products', { params }).then((r) => r.data),

  getProduct: (id: number) =>
    api.get<Product>(`/api/v1/products/${id}`).then((r) => r.data),

  getBrands: () =>
    api.get<Brand[]>('/api/v1/brands').then((r) => r.data),

  getCategories: () =>
    api.get<Category[]>('/api/v1/categories').then((r) => r.data),
}

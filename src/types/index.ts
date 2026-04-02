export interface Review {
  id: number
  userId: number
  username: string
  rating: number
  comment: string | null
  createdAt: string
  updatedAt: string | null
}

export interface ReviewPage {
  content: Review[]
  totalElements: number
  totalPages: number
  last: boolean
}

export interface ReviewStats {
  averageRating: number
  totalReviews: number
  distribution: Record<string, number>
}

export interface RecommendationItem {
  productId: number
  name: string
  reason: string
}

export interface RecommendationResponse {
  summary: string
  recommendations: RecommendationItem[]
}

export interface UserProfile {
  id: number
  username: string
  email: string
  role: 'USER' | 'ADMIN'
}

export interface ProductImage {
  imageUrl: string
  altText: string
  isMain: boolean
  sortOrder: number
}

export interface ProductVariant {
  id: number
  sku: string
  price: number | null
  stockQuantity: number
  attributes: Record<string, string>
}

export interface Brand {
  id: number
  name: string
  description: string
  logoUrl: string
  websiteUrl: string
}

export interface Category {
  id: number
  name: string
  description: string
  slug: string
  parentCategoryId: number | null
  parentCategoryName: string | null
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  discountPrice: number | null
  sku: string
  stockQuantity: number
  status: string
  brand: Brand | null
  categories: Category[]
  variants: ProductVariant[]
  images: ProductImage[]
  createdAt: string
  updatedAt: string
}

export interface ProductPage {
  products: Product[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}

export interface CartItem {
  id: number
  productId: number
  productName: string
  productSku: string
  productMainImage: string | null
  variantId: number | null
  variantSku: string | null
  variantAttributes: Record<string, string> | null
  unitPrice: number
  quantity: number
  subtotal: number
}

export interface Cart {
  id: number
  items: CartItem[]
  totalItems: number
  totalPrice: number
  updatedAt: string
}

export interface OrderItem {
  productName: string
  quantity: number
  price: number
  product: Product
}

export interface OrderStatusHistory {
  previousStatus: string | null
  newStatus: string
  changedBy: string
  changedAt: string
}

export interface Order {
  id: number
  username: string
  status: string
  totalPrice: number
  deliveryFee: number
  grandTotal: number
  deliveryType: 'PICKUP' | 'DELIVERY'
  deliveryAddress: string | null
  phoneNumber: string
  createdAt: string
  updatedAt: string
  items: OrderItem[]
  statusHistory: OrderStatusHistory[]
}

export interface OrderPage {
  orders: Order[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}

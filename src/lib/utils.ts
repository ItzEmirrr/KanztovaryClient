import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(path: string | null | undefined): string {
  if (!path) return '/placeholder.png'
  if (path.startsWith('http')) return path
  return API_BASE + path
}

export function formatPrice(price: number): string {
  return price.toLocaleString('ru-KG') + ' сом'
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('ru-KG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr))
}

export function formatDateTime(dateStr: string): string {
  return new Intl.DateTimeFormat('ru-KG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr))
}

export function calcDiscountPercent(price: number, discountPrice: number): number {
  return Math.round(((price - discountPrice) / price) * 100)
}

export const STATUS_MAP: Record<string, { label: string; color: string }> = {
  NEW: { label: 'Новый', color: 'bg-blue-100 text-blue-700' },
  IN_PROGRESS: { label: 'В работе', color: 'bg-yellow-100 text-yellow-700' },
  COMPLETED: { label: 'Выполнен', color: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'Отменён', color: 'bg-red-100 text-red-700' },
}

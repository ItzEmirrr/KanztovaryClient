import { api } from './axios'
import type { Review, ReviewPage, ReviewStats } from '../types'

export const reviewsApi = {
  getReviews: (page = 0, size = 10): Promise<ReviewPage> =>
    api.get<ReviewPage>('/api/v1/reviews', { params: { page, size } }).then((r) => r.data),

  getStats: (): Promise<ReviewStats> =>
    api.get<ReviewStats>('/api/v1/reviews/stats').then((r) => r.data),

  getMyReview: (): Promise<Review> =>
    api.get<Review>('/api/v1/reviews/me').then((r) => r.data),

  createReview: (data: { rating: number; comment?: string }): Promise<Review> =>
    api.post<Review>('/api/v1/reviews', data).then((r) => r.data),

  updateReview: (id: number, data: { rating: number; comment?: string }): Promise<Review> =>
    api.put<Review>(`/api/v1/reviews/${id}`, data).then((r) => r.data),

  deleteReview: (id: number): Promise<void> =>
    api.delete(`/api/v1/reviews/${id}`).then(() => undefined),
}

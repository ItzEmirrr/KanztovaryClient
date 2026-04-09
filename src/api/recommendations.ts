import { api } from './axios'
import type { RecommendationResponse } from '../types'

export const recommendationsApi = {
  getRecommendations: (data: {
    query: string
    maxResults?: number
  }): Promise<RecommendationResponse> =>
    api.post<RecommendationResponse>('/api/v1/recommendations', data).then((r) => r.data),
}

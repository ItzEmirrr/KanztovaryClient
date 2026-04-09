import { api } from './axios'
import type { UserProfile } from '../types'

export const userApi = {
  getProfile: (): Promise<UserProfile> =>
    api.get<UserProfile>('/api/v1/users/me').then((r) => r.data),

  updateProfile: (data: { username: string; email: string }): Promise<UserProfile> =>
    api.put<UserProfile>('/api/v1/users/me', data).then((r) => r.data),

  changePassword: (data: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }): Promise<void> =>
    api.put('/api/v1/users/me/password', data).then(() => undefined),
}

import { api } from './axios'

export interface LoginBody { email: string; password: string }
export interface RegisterBody { username: string; email: string; password: string }
export interface AuthResponse { token: string; role: 'ADMIN' | 'USER' }

export const authApi = {
  login: (body: LoginBody) =>
    api.post<AuthResponse>('/api/v1/auth/login', body).then((r) => r.data),

  register: (body: RegisterBody) =>
    api.post<AuthResponse>('/api/v1/auth/register', body).then((r) => r.data),
}

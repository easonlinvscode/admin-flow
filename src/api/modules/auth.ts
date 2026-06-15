import request from '@/api/request'
import type { Auth } from '@/api/types'

const isMock = import.meta.env.VITE_MOCK_ENABLED === 'true'

// Mock 預設用戶
const mockUserProfile: Auth.UserInfo = {
  id: 1,
  username: 'admin',
  email: 'admin@example.com',
  role: 'admin',
  status: 'active',
  createdAt: '2024-01-01 08:00:00',
}

export const authAPI = {
  /**
   * 用戶登入
   */
  login: (credentials: Auth.LoginRequest) => {
    // Mock 模式：直接返回假資料
    if (isMock) {
      if (!credentials.email || !credentials.password || credentials.password.length < 6) {
        return Promise.reject(new Error('帳號或密碼錯誤'))
      }
      return Promise.resolve({
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        user: { ...mockUserProfile, email: credentials.email },
      } as Auth.LoginResponse)
    }
    // 真實 API
    return request.post<Auth.LoginResponse>('/auth/login', credentials)
  },

  /**
   * 刷新 Token
   */
  refreshToken: (refreshToken: string) => {
    // Mock 模式
    if (isMock) {
      return Promise.resolve({
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
      } as Auth.RefreshTokenResponse)
    }
    // 真實 API
    return request.post<Auth.RefreshTokenResponse>('/auth/refresh-token', {
      refreshToken,
    })
  },

  /**
   * 獲取當前用戶信息
   */
  getProfile: () => {
    // Mock 模式
    if (isMock) {
      return Promise.resolve(mockUserProfile as Auth.UserInfo)
    }
    // 真實 API
    return request.get<Auth.UserInfo>('/auth/profile')
  },

  /**
   * 用戶登出
   */
  logout: () => {
    // Mock 模式 - 直接返回
    if (isMock) {
      return Promise.resolve(void 0)
    }
    // 真實 API
    return request.post<void>('/auth/logout')
  },
}

/**
 * Token 存儲管理
 * - accessToken: 存儲在 sessionStorage（會話級別）
 * - refreshToken: 存儲在 localStorage（持久化）
 */

class TokenManager {
  private readonly ACCESS_TOKEN_KEY = 'accessToken'
  private readonly REFRESH_TOKEN_KEY = 'refreshToken'
  private readonly USER_INFO_KEY = 'userInfo'

  /**
   * 設置 tokens
   */
  setTokens(accessToken: string, refreshToken: string) {
    sessionStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken)
  }

  /**
   * 獲取 accessToken
   */
  getAccessToken(): string | null {
    return sessionStorage.getItem(this.ACCESS_TOKEN_KEY)
  }

  /**
   * 獲取 refreshToken
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY)
  }

  /**
   * 保存用戶信息
   */
  setUserInfo(userInfo: any) {
    localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(userInfo))
  }

  /**
   * 獲取用戶信息
   */
  getUserInfo(): any {
    const info = localStorage.getItem(this.USER_INFO_KEY)
    return info ? JSON.parse(info) : null
  }

  /**
   * 清除所有 tokens 和用戶信息
   */
  clearTokens() {
    sessionStorage.removeItem(this.ACCESS_TOKEN_KEY)
    localStorage.removeItem(this.REFRESH_TOKEN_KEY)
    localStorage.removeItem(this.USER_INFO_KEY)
  }

  /**
   * 檢查是否已登入
   */
  hasToken(): boolean {
    return !!this.getAccessToken()
  }
}

export const tokenManager = new TokenManager()

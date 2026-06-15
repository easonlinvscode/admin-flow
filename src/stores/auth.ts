import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI } from '@/api/modules/auth'
import { tokenManager } from '@/utils/storage'
import type { Auth } from '@/api/types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const userInfo = ref<Auth.UserInfo | null>(null)
  const isLoading = ref(false)
  let fetchingUserInfo = false

  // 用 ref 追蹤登入狀態（sessionStorage 不是響應式，不能用 computed 依賴它）
  // 初始值從 sessionStorage 讀取，支援頁面重整後保持登入
  const _loggedIn = ref(!!tokenManager.getAccessToken())

  // Computed
  const isLoggedIn = computed(() => _loggedIn.value)
  const userRole = computed(() => userInfo.value?.role || 'viewer')
  const userName = computed(() => userInfo.value?.username || '')
  const userEmail = computed(() => userInfo.value?.email || '')

  /**
   * 用戶登入
   */
  const login = async (credentials: Auth.LoginRequest) => {
    isLoading.value = true
    try {
      const data = await authAPI.login(credentials)

      tokenManager.setTokens(data.accessToken, data.refreshToken)
      userInfo.value = data.user
      tokenManager.setUserInfo(data.user)

      // ✅ 登入後立即更新響應式狀態，路由守衛才能即時感知
      _loggedIn.value = true

      return data
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 獲取用戶信息
   */
  const fetchUserInfo = async () => {
    if (fetchingUserInfo) return

    fetchingUserInfo = true
    try {
      const data = await authAPI.getProfile()
      userInfo.value = data
      tokenManager.setUserInfo(data)
      return data
    } finally {
      fetchingUserInfo = false
    }
  }

  /**
   * 用戶登出
   */
  const logout = () => {
    try {
      authAPI.logout()
    } catch {
      // 忽略登出 API 的錯誤
    }

    userInfo.value = null
    tokenManager.clearTokens()

    // ✅ 登出後立即更新響應式狀態
    _loggedIn.value = false
  }

  /**
   * 初始化認證狀態（應用啟動時呼叫）
   */
  const initAuth = async () => {
    if (!tokenManager.hasToken()) {
      _loggedIn.value = false
      return false
    }

    try {
      await fetchUserInfo()
      _loggedIn.value = true
      return true
    } catch {
      tokenManager.clearTokens()
      _loggedIn.value = false
      return false
    }
  }

  /**
   * 檢查用戶是否有指定角色
   */
  const hasRole = (role: string | string[]): boolean => {
    if (Array.isArray(role)) {
      return role.includes(userRole.value)
    }
    return userRole.value === role
  }

  /**
   * 檢查用戶是否擁有指定權限
   */
  const hasPermission = (_permission: string): boolean => {
    if (userRole.value === 'admin') return true
    return true
  }

  return {
    userInfo,
    isLoading,
    isLoggedIn,
    userRole,
    userName,
    userEmail,
    login,
    logout,
    fetchUserInfo,
    initAuth,
    hasRole,
    hasPermission,
  }
})

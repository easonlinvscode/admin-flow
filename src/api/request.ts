import axios, { type AxiosInstance, type AxiosError } from 'axios'
import { ElMessage } from 'element-plus'
import { tokenManager } from '@/utils/storage'

// 創建 axios 實例
const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
})

// 標記防止無限循環刷新 Token
let isRefreshing = false
let pendingRequests: Array<(token: string) => void> = []

const processPendingRequests = (token: string) => {
  pendingRequests.forEach(cb => cb(token))
  pendingRequests = []
}

// ─── 請求攔截器：自動帶入 Bearer Token ───────────────────
request.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── 響應攔截器：統一解包資料 ────────────────────────────
request.interceptors.response.use(
  (response) => {
    const res = response.data

    // 後端回傳格式: { code, message, data }
    // 只解包 data 欄位，讓 API 模組拿到的就是業務資料
    if (res && typeof res === 'object' && 'code' in res) {
      if (res.code !== 0 && res.code !== 200) {
        ElMessage.error(res.message || '請求失敗')
        return Promise.reject(new Error(res.message))
      }
      return res.data  // ← 回傳業務資料（list / item / null）
    }

    // 若後端直接回傳資料（非包裝格式），原樣返回
    return res
  },

  async (error: AxiosError) => {
    const { response, config } = error

    // ── 401 Token 過期：嘗試自動刷新 ──────────────────────
    if (response?.status === 401 && config && !isRefreshing) {
      const storedRefreshToken = tokenManager.getRefreshToken()

      if (!storedRefreshToken) {
        tokenManager.clearTokens()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      isRefreshing = true

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || '/api'}/auth/refresh-token`,
          { refreshToken: storedRefreshToken }
        )

        const { accessToken, refreshToken: newRefresh } = (res.data as any)?.data || res.data
        tokenManager.setTokens(accessToken, newRefresh)
        processPendingRequests(accessToken)

        // 重試原請求
        config.headers!.Authorization = `Bearer ${accessToken}`
        return request(config)
      } catch {
        tokenManager.clearTokens()
        window.location.href = '/login'
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }

    // 若正在刷新中，將後續請求放入等待隊列
    if (response?.status === 401 && isRefreshing && config) {
      return new Promise(resolve => {
        pendingRequests.push((token: string) => {
          config.headers!.Authorization = `Bearer ${token}`
          resolve(request(config))
        })
      })
    }

    // ── 其他 HTTP 錯誤 ──────────────────────────────────
    if (response?.status === 403) ElMessage.error('你沒有權限執行此操作')
    else if (response?.status === 404) ElMessage.error('請求的資源不存在')
    else if (response?.status === 500) ElMessage.error('伺服器內部錯誤')
    else if (!response) ElMessage.error('網路連線失敗，請檢查網路')

    return Promise.reject(error)
  }
)

export default request

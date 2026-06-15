/**
 * Mock Adapter
 * 自定義 Axios Adapter，攔截所有請求並回傳假資料
 * 在開發環境（VITE_MOCK_ENABLED=true）自動啟用，無需後端
 */

import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import {
  mockUsers,
  mockProducts,
  mockOrders,
  mockDashboardStats,
  mockOrderTrends,
  mockUserGrowthTrends,
  mockSalesData,
  mockLoginResponse,
  mockUserProfile,
} from './data'

// 本地暫存（支援 CRUD 操作）
let users = [...mockUsers]
let products = [...mockProducts]
let orders = [...mockOrders]
let userIdCounter = users.length + 1
let productIdCounter = products.length + 1

// 模擬網路延遲
const delay = (ms = 300) => new Promise<void>(resolve => setTimeout(resolve, ms + Math.random() * 200))

// 建構成功回應（符合後端 { code, message, data } 結構）
const ok = (data: any): any => ({
  code: 0,
  message: 'success',
  data,
})

// 分頁工具
function paginate<T>(list: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize
  return {
    list: list.slice(start, start + pageSize),
    total: list.length,
    page,
    pageSize,
  }
}

// 解析 URL 中的 ID（例如 /users/3 → 3）
function extractId(url: string): number | null {
  const match = url.match(/\/(\d+)$/)
  return match ? parseInt(match[1], 10) : null
}

// 解析 request body
function parseBody(data: any): any {
  if (typeof data === 'string') {
    try { return JSON.parse(data) } catch { return {} }
  }
  return data || {}
}

/**
 * 主要路由處理器
 */
export const mockAdapter = async (config: InternalAxiosRequestConfig): Promise<AxiosResponse> => {
  await delay()

  const url = config.url || ''
  const method = (config.method || 'get').toLowerCase()
  const params = config.params || {}
  const body = parseBody(config.data)

  let responseData: any

  // ─── 認證 ───────────────────────────────────────────
  if (url.includes('/auth/login') && method === 'post') {
    const { email, password } = body
    if (!email || !password || password.length < 6) {
      return buildResponse({ code: 1001, message: '帳號或密碼錯誤', data: null }, 401, config)
    }
    responseData = ok(mockLoginResponse(email))
  }

  else if (url.includes('/auth/profile') && method === 'get') {
    responseData = ok(mockUserProfile)
  }

  else if (url.includes('/auth/logout') && method === 'post') {
    responseData = ok(null)
  }

  else if (url.includes('/auth/refresh-token') && method === 'post') {
    responseData = ok({
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
    })
  }

  // ─── 用戶管理 ─────────────────────────────────────
  else if (url.match(/\/users$/) && method === 'get') {
    const { page = 1, pageSize = 10, keyword, role } = params
    let filtered = [...users]
    if (keyword) {
      filtered = filtered.filter(u =>
        u.username.includes(keyword) || u.email.includes(keyword)
      )
    }
    if (role) {
      filtered = filtered.filter(u => u.role === role)
    }
    responseData = ok(paginate(filtered, Number(page), Number(pageSize)))
  }

  else if (url.match(/\/users$/) && method === 'post') {
    const newUser = {
      id: userIdCounter++,
      ...body,
      status: 'active' as const,
      createdAt: new Date().toLocaleString('zh-TW'),
      updatedAt: new Date().toLocaleString('zh-TW'),
    }
    users.push(newUser)
    responseData = ok(newUser)
  }

  else if (url.match(/\/users\/\d+$/) && method === 'put') {
    const id = extractId(url)!
    const idx = users.findIndex(u => u.id === id)
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...body, updatedAt: new Date().toLocaleString('zh-TW') }
      responseData = ok(users[idx])
    } else {
      return buildResponse({ code: 404, message: '用戶不存在', data: null }, 404, config)
    }
  }

  else if (url.match(/\/users\/\d+$/) && method === 'delete') {
    const id = extractId(url)!
    users = users.filter(u => u.id !== id)
    responseData = ok(null)
  }

  // ─── 商品管理 ─────────────────────────────────────
  else if (url.match(/\/products$/) && method === 'get') {
    const { page = 1, pageSize = 10, keyword, status, category } = params
    let filtered = [...products]
    if (keyword) {
      filtered = filtered.filter(p => p.name.includes(keyword))
    }
    if (status) {
      filtered = filtered.filter(p => p.status === status)
    }
    if (category) {
      filtered = filtered.filter(p => p.category === category)
    }
    responseData = ok(paginate(filtered, Number(page), Number(pageSize)))
  }

  else if (url.match(/\/products$/) && method === 'post') {
    const newProduct = {
      id: productIdCounter++,
      ...body,
      status: 'active' as const,
      createdAt: new Date().toLocaleString('zh-TW'),
      updatedAt: new Date().toLocaleString('zh-TW'),
    }
    products.push(newProduct)
    responseData = ok(newProduct)
  }

  else if (url.match(/\/products\/\d+$/) && method === 'put') {
    const id = extractId(url)!
    const idx = products.findIndex(p => p.id === id)
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...body, updatedAt: new Date().toLocaleString('zh-TW') }
      responseData = ok(products[idx])
    } else {
      return buildResponse({ code: 404, message: '商品不存在', data: null }, 404, config)
    }
  }

  else if (url.match(/\/products\/\d+$/) && method === 'delete') {
    const id = extractId(url)!
    products = products.filter(p => p.id !== id)
    responseData = ok(null)
  }

  // ─── 訂單管理 ─────────────────────────────────────
  else if (url.match(/\/orders$/) && method === 'get') {
    const { page = 1, pageSize = 10, keyword, status } = params
    let filtered = [...orders]
    if (keyword) {
      filtered = filtered.filter(o =>
        o.orderNo.includes(keyword) || (o.userName || '').includes(keyword)
      )
    }
    if (status) {
      filtered = filtered.filter(o => o.status === status)
    }
    // 按建立時間倒序
    filtered = filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    responseData = ok(paginate(filtered, Number(page), Number(pageSize)))
  }

  else if (url.match(/\/orders\/\d+$/) && method === 'get') {
    const id = extractId(url)!
    const order = orders.find(o => o.id === id)
    if (order) {
      responseData = ok(order)
    } else {
      return buildResponse({ code: 404, message: '訂單不存在', data: null }, 404, config)
    }
  }

  else if (url.match(/\/orders\/\d+$/) && method === 'put') {
    const id = extractId(url)!
    const idx = orders.findIndex(o => o.id === id)
    if (idx !== -1) {
      orders[idx] = { ...orders[idx], ...body, updatedAt: new Date().toLocaleString('zh-TW') }
      responseData = ok(orders[idx])
    } else {
      return buildResponse({ code: 404, message: '訂單不存在', data: null }, 404, config)
    }
  }

  // ─── Dashboard ─────────────────────────────────────
  else if (url.includes('/dashboard/statistics') && method === 'get') {
    responseData = ok(mockDashboardStats)
  }

  else if (url.includes('/dashboard/order-trends') && method === 'get') {
    responseData = ok({ data: mockOrderTrends })
  }

  else if (url.includes('/dashboard/user-growth') && method === 'get') {
    responseData = ok({ data: mockUserGrowthTrends })
  }

  else if (url.includes('/dashboard/sales') && method === 'get') {
    responseData = ok({ data: mockSalesData })
  }

  // ─── 未匹配到路由 ──────────────────────────────────
  else {
    return buildResponse({ code: 404, message: `未找到路由: ${method.toUpperCase()} ${url}`, data: null }, 404, config)
  }

  return buildResponse(responseData, 200, config)
}

function buildResponse(data: any, status: number, config: InternalAxiosRequestConfig): AxiosResponse {
  return {
    data,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: { 'content-type': 'application/json' },
    config,
  }
}

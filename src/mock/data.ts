/**
 * Mock 靜態資料
 * 為開發環境提供假資料，無需後端即可運行
 */

import type { Auth, User, Product, Order, Dashboard } from '@/api/types'

// ===================== 用戶資料 =====================
export const mockUsers: User.Item[] = [
  { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin', status: 'active', createdAt: '2024-01-01 08:00:00', updatedAt: '2024-03-15 10:30:00' },
  { id: 2, username: 'editor_wang', email: 'wang@example.com', role: 'editor', status: 'active', createdAt: '2024-01-15 09:20:00', updatedAt: '2024-03-10 14:00:00' },
  { id: 3, username: 'viewer_chen', email: 'chen@example.com', role: 'viewer', status: 'active', createdAt: '2024-02-01 11:00:00', updatedAt: '2024-02-28 09:15:00' },
  { id: 4, username: 'editor_lin', email: 'lin@example.com', role: 'editor', status: 'inactive', createdAt: '2024-02-10 14:30:00', updatedAt: '2024-03-01 16:00:00' },
  { id: 5, username: 'viewer_zhang', email: 'zhang@example.com', role: 'viewer', status: 'active', createdAt: '2024-02-20 10:00:00', updatedAt: '2024-03-20 11:45:00' },
  { id: 6, username: 'editor_liu', email: 'liu@example.com', role: 'editor', status: 'active', createdAt: '2024-03-01 09:00:00', updatedAt: '2024-04-01 08:30:00' },
  { id: 7, username: 'viewer_wu', email: 'wu@example.com', role: 'viewer', status: 'active', createdAt: '2024-03-05 13:20:00', updatedAt: '2024-04-05 10:00:00' },
  { id: 8, username: 'admin_lee', email: 'lee@example.com', role: 'admin', status: 'active', createdAt: '2024-03-10 15:00:00', updatedAt: '2024-04-10 09:00:00' },
  { id: 9, username: 'viewer_huang', email: 'huang@example.com', role: 'viewer', status: 'inactive', createdAt: '2024-03-15 08:45:00', updatedAt: '2024-04-12 14:30:00' },
  { id: 10, username: 'editor_zhao', email: 'zhao@example.com', role: 'editor', status: 'active', createdAt: '2024-03-20 11:30:00', updatedAt: '2024-04-14 16:00:00' },
  { id: 11, username: 'viewer_sun', email: 'sun@example.com', role: 'viewer', status: 'active', createdAt: '2024-04-01 10:00:00', updatedAt: '2024-04-15 09:00:00' },
  { id: 12, username: 'viewer_zhou', email: 'zhou@example.com', role: 'viewer', status: 'active', createdAt: '2024-04-05 14:00:00', updatedAt: '2024-04-15 10:00:00' },
]

// ===================== 商品資料 =====================
export const mockProducts: Product.Item[] = [
  { id: 1, name: 'iPhone 15 Pro', category: '3C電子', price: 38900, stock: 120, status: 'active', description: '最新款 Apple 旗艦手機', createdAt: '2024-01-10 10:00:00', updatedAt: '2024-04-01 09:00:00' },
  { id: 2, name: 'MacBook Air M3', category: '3C電子', price: 42800, stock: 85, status: 'active', description: '輕薄高效能筆電', createdAt: '2024-01-12 11:00:00', updatedAt: '2024-04-02 10:00:00' },
  { id: 3, name: 'AirPods Pro 2', category: '3C電子', price: 7490, stock: 200, status: 'active', description: '主動降噪耳機', createdAt: '2024-01-15 09:30:00', updatedAt: '2024-03-20 11:00:00' },
  { id: 4, name: '男款休閒T恤', category: '服飾', price: 590, stock: 300, status: 'active', description: '純棉舒適透氣', createdAt: '2024-01-20 14:00:00', updatedAt: '2024-03-25 15:00:00' },
  { id: 5, name: '女款連衣裙', category: '服飾', price: 1290, stock: 150, status: 'active', description: '夏季清涼款式', createdAt: '2024-02-01 10:00:00', updatedAt: '2024-04-01 14:00:00' },
  { id: 6, name: '有機燕麥片', category: '食品', price: 299, stock: 500, status: 'active', description: '天然無添加健康早餐', createdAt: '2024-02-05 09:00:00', updatedAt: '2024-03-30 10:00:00' },
  { id: 7, name: '進口紅酒禮盒', category: '食品', price: 1680, stock: 60, status: 'active', description: '法國波爾多產區', createdAt: '2024-02-10 11:00:00', updatedAt: '2024-04-05 09:30:00' },
  { id: 8, name: '北歐風書架', category: '家居', price: 2490, stock: 45, status: 'active', description: '實木材質，簡約設計', createdAt: '2024-02-15 14:00:00', updatedAt: '2024-03-28 16:00:00' },
  { id: 9, name: '記憶棉枕頭', category: '家居', price: 890, stock: 180, status: 'inactive', description: '慢回彈材質，護頸舒睡', createdAt: '2024-02-20 10:30:00', updatedAt: '2024-04-10 11:00:00' },
  { id: 10, name: 'Vue 3 實戰指南', category: '書籍', price: 680, stock: 120, status: 'active', description: '深入學習 Vue 3 + TypeScript', createdAt: '2024-03-01 09:00:00', updatedAt: '2024-04-01 10:00:00' },
  { id: 11, name: '瑜珈墊專業版', category: '運動', price: 1290, stock: 90, status: 'active', description: '防滑天然橡膠材質', createdAt: '2024-03-05 13:00:00', updatedAt: '2024-04-08 14:00:00' },
  { id: 12, name: '跑步機折疊款', category: '運動', price: 18900, stock: 20, status: 'inactive', description: '靜音折疊設計，適合家用', createdAt: '2024-03-10 10:00:00', updatedAt: '2024-04-12 09:00:00' },
  { id: 13, name: 'Samsung S24 Ultra', category: '3C電子', price: 42000, stock: 95, status: 'active', description: '三星旗艦，內建 S Pen', createdAt: '2024-03-15 09:00:00', updatedAt: '2024-04-14 10:00:00' },
  { id: 14, name: '兒童繪本套組', category: '書籍', price: 1200, stock: 200, status: 'active', description: '3-6歲兒童適用，全彩插圖', createdAt: '2024-03-20 11:00:00', updatedAt: '2024-04-15 09:00:00' },
  { id: 15, name: '藍牙音響', category: '3C電子', price: 3800, stock: 75, status: 'active', description: '360度環繞音效，防水設計', createdAt: '2024-04-01 10:00:00', updatedAt: '2024-04-15 11:00:00' },
]

// ===================== 訂單資料 =====================
const orderStatuses: Order.Item['status'][] = ['pending', 'processing', 'shipped', 'completed', 'cancelled']
const customerNames = ['張小明', '李雅婷', '王大偉', '陳美玲', '林志宇', '黃雅雯', '劉建國', '吳宜蓁', '趙勝利', '孫小紅']

export const mockOrders: Order.Item[] = Array.from({ length: 32 }, (_, i) => {
  const id = i + 1
  const customer = customerNames[i % customerNames.length]
  const product = mockProducts[i % mockProducts.length]
  const qty = Math.floor(Math.random() * 3) + 1
  const status = orderStatuses[i % orderStatuses.length]
  const dayOffset = 30 - i
  const date = new Date(2024, 2, dayOffset > 0 ? dayOffset : 1)
  const dateStr = date.toISOString().replace('T', ' ').substring(0, 19)

  return {
    id,
    orderNo: `ORD-2024${String(id).padStart(4, '0')}`,
    userId: (i % 12) + 1,
    userName: customer,
    totalAmount: parseFloat((product.price * qty * (0.9 + Math.random() * 0.2)).toFixed(2)),
    status,
    items: [
      {
        productId: product.id,
        productName: product.name,
        quantity: qty,
        price: product.price,
      },
    ],
    createdAt: dateStr,
    updatedAt: dateStr,
  }
})

// ===================== Dashboard 統計 =====================
export const mockDashboardStats: Dashboard.Statistics = {
  totalOrders: 1247,
  totalUsers: 567,
  totalRevenue: 1893450,
  conversionRate: 3.8,
}

// 最近 7 天訂單趨勢
export const mockOrderTrends: Dashboard.TrendPoint[] = [
  { date: '04/09', value: 42 },
  { date: '04/10', value: 58 },
  { date: '04/11', value: 35 },
  { date: '04/12', value: 73 },
  { date: '04/13', value: 61 },
  { date: '04/14', value: 89 },
  { date: '04/15', value: 76 },
]

// 最近 7 天會員成長
export const mockUserGrowthTrends: Dashboard.TrendPoint[] = [
  { date: '04/09', value: 12 },
  { date: '04/10', value: 19 },
  { date: '04/11', value: 8 },
  { date: '04/12', value: 25 },
  { date: '04/13', value: 18 },
  { date: '04/14', value: 31 },
  { date: '04/15', value: 22 },
]

// 分類銷售統計
export const mockSalesData: Dashboard.SalesData[] = [
  { name: '3C電子', value: 758320 },
  { name: '服飾', value: 329450 },
  { name: '食品', value: 218760 },
  { name: '家居', value: 187530 },
  { name: '運動', value: 245810 },
  { name: '書籍', value: 153580 },
]

// ===================== 認證資料 =====================
export const mockLoginResponse = (email: string): Auth.LoginResponse => {
  const isAdmin = email.includes('admin')
  const isEditor = email.includes('editor') || email.includes('wang')

  return {
    accessToken: 'mock-access-token-' + Date.now(),
    refreshToken: 'mock-refresh-token-' + Date.now(),
    user: {
      id: isAdmin ? 1 : isEditor ? 2 : 3,
      username: isAdmin ? 'admin' : isEditor ? 'editor_wang' : 'viewer_chen',
      email,
      role: isAdmin ? 'admin' : isEditor ? 'editor' : 'viewer',
      status: 'active',
      createdAt: '2024-01-01 08:00:00',
    },
  }
}

export const mockUserProfile: Auth.UserInfo = {
  id: 1,
  username: 'admin',
  email: 'admin@example.com',
  role: 'admin',
  status: 'active',
  createdAt: '2024-01-01 08:00:00',
}

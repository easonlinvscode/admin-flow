import request from '@/api/request'
import type { Dashboard } from '@/api/types'

const isMock = import.meta.env.VITE_MOCK_ENABLED === 'true'

// Mock 資料
const mockStatistics: Dashboard.Statistics = {
  totalOrders: 1247,
  totalUsers: 567,
  totalRevenue: 1893450,
  conversionRate: 3.8,
}

const mockOrderTrends: Dashboard.TrendPoint[] = [
  { date: '04/09', value: 42 },
  { date: '04/10', value: 58 },
  { date: '04/11', value: 35 },
  { date: '04/12', value: 73 },
  { date: '04/13', value: 61 },
  { date: '04/14', value: 89 },
  { date: '04/15', value: 76 },
]

const mockUserGrowthTrends: Dashboard.TrendPoint[] = [
  { date: '04/09', value: 12 },
  { date: '04/10', value: 19 },
  { date: '04/11', value: 8 },
  { date: '04/12', value: 25 },
  { date: '04/13', value: 18 },
  { date: '04/14', value: 31 },
  { date: '04/15', value: 22 },
]

const mockSalesData: Dashboard.SalesData[] = [
  { name: '3C電子', value: 758320 },
  { name: '服飾', value: 329450 },
  { name: '食品', value: 218760 },
  { name: '家居', value: 187530 },
  { name: '運動', value: 245810 },
  { name: '書籍', value: 153580 },
]

export const dashboardAPI = {
  /**
   * 取得統計數據
   */
  getStatistics: () => {
    if (isMock) {
      return Promise.resolve(mockStatistics)
    }
    return request.get<Dashboard.Statistics>('/dashboard/statistics')
  },

  /**
   * 取得訂單趨勢（最近 7 天）
   */
  getOrderTrends: () => {
    if (isMock) {
      return Promise.resolve({ data: mockOrderTrends } as Dashboard.TrendResponse)
    }
    return request.get<Dashboard.TrendResponse>('/dashboard/order-trends')
  },

  /**
   * 取得會員成長趨勢（最近 7 天）
   */
  getUserGrowth: () => {
    if (isMock) {
      return Promise.resolve({ data: mockUserGrowthTrends } as Dashboard.TrendResponse)
    }
    return request.get<Dashboard.TrendResponse>('/dashboard/user-growth')
  },

  /**
   * 取得分類銷售統計
   */
  getSalesData: () => {
    if (isMock) {
      return Promise.resolve({ data: mockSalesData } as Dashboard.SalesResponse)
    }
    return request.get<Dashboard.SalesResponse>('/dashboard/sales')
  },
}

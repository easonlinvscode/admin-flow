import request from '@/api/request'
import type { Order } from '@/api/types'

const isMock = import.meta.env.VITE_MOCK_ENABLED === 'true'

// Mock 商品名稱
const productNames = ['iPhone 15 Pro', 'MacBook Air', 'AirPods Pro', '運動T恤', '女款連衣裙', '紅酒禮盒', '書架', '瑜珈墊', 'Samsung S24']
const customerNames = ['張小明', '李雅婷', '王大偉', '陳美玲', '林志宇', '黃雅雯', '劉建國', '吳宜蓁']
const statuses: Order.Item['status'][] = ['pending', 'processing', 'shipped', 'completed', 'cancelled']

// 生成 Mock 訂單
const generateMockOrders = () => {
  const orders: Order.Item[] = []
  for (let i = 1; i <= 32; i++) {
    const status = statuses[i % statuses.length]
    const customer = customerNames[i % customerNames.length]
    const product = productNames[i % productNames.length]
    const qty = Math.floor(Math.random() * 3) + 1
    const price = Math.floor(Math.random() * 3000) + 500
    const dayOffset = 30 - i
    const date = new Date(2024, 2, dayOffset > 0 ? dayOffset : 1)
    const dateStr = date.toISOString().replace('T', ' ').substring(0, 19)

    orders.push({
      id: i,
      orderNo: `ORD-2024${String(i).padStart(4, '0')}`,
      userId: (i % 8) + 1,
      userName: customer,
      totalAmount: parseFloat((price * qty * (0.9 + Math.random() * 0.2)).toFixed(2)),
      status,
      items: [{
        productId: (i % 15) + 1,
        productName: product,
        quantity: qty,
        price,
      }],
      createdAt: dateStr,
      updatedAt: dateStr,
    })
  }
  return orders
}

let orders = generateMockOrders()

const paginate = <T,>(list: T[], page: number, pageSize: number) => ({
  list: list.slice((page - 1) * pageSize, page * pageSize),
  total: list.length,
  page,
  pageSize,
})

export const orderAPI = {
  /**
   * 獲取訂單列表
   */
  list: (params: Order.ListParams) => {
    if (isMock) {
      let filtered = [...orders]
      if (params.keyword) {
        filtered = filtered.filter(o =>
          o.orderNo.includes(params.keyword!) || (o.userName || '').includes(params.keyword!)
        )
      }
      if (params.status) {
        filtered = filtered.filter(o => o.status === params.status)
      }
      // 倒序排列
      filtered = filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      return Promise.resolve(paginate(filtered, params.page, params.pageSize) as Order.ListResponse)
    }
    return request.get<Order.ListResponse>('/orders', { params })
  },

  /**
   * 獲取訂單詳情
   */
  get: (id: number) => {
    if (isMock) {
      const order = orders.find(o => o.id === id)
      return order ? Promise.resolve(order as Order.Item) : Promise.reject(new Error('訂單不存在'))
    }
    return request.get<Order.Item>(`/orders/${id}`)
  },

  /**
   * 創建訂單
   */
  create: (data: Order.CreateRequest) => {
    if (isMock) {
      const maxId = Math.max(...orders.map(o => o.id), 0)
      const newOrder: Order.Item = {
        id: maxId + 1,
        orderNo: `ORD-2024${String(maxId + 1).padStart(4, '0')}`,
        userId: data.userId,
        userName: customerNames[data.userId % customerNames.length],
        totalAmount: Math.random() * 10000,
        status: 'pending',
        items: data.items.map((item, idx) => ({
          ...item,
          productName: productNames[idx % productNames.length],
          price: Math.random() * 5000,
        })),
        createdAt: new Date().toLocaleString('zh-TW'),
        updatedAt: new Date().toLocaleString('zh-TW'),
      }
      orders.push(newOrder)
      return Promise.resolve(newOrder)
    }
    return request.post<Order.Item>('/orders', data)
  },

  /**
   * 更新訂單
   */
  update: (id: number, data: Order.UpdateRequest) => {
    if (isMock) {
      const idx = orders.findIndex(o => o.id === id)
      if (idx !== -1) {
        orders[idx] = { ...orders[idx], ...data, updatedAt: new Date().toLocaleString('zh-TW') }
        return Promise.resolve(orders[idx])
      }
      return Promise.reject(new Error('訂單不存在'))
    }
    return request.put<Order.Item>(`/orders/${id}`, data)
  },

  /**
   * 刪除訂單
   */
  delete: (id: number) => {
    if (isMock) {
      orders = orders.filter(o => o.id !== id)
      return Promise.resolve(void 0)
    }
    return request.delete<void>(`/orders/${id}`)
  },
}

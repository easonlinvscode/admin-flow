import request from '@/api/request'
import type { Product } from '@/api/types'

const isMock = import.meta.env.VITE_MOCK_ENABLED === 'true'

// Mock 資料
const mockProducts: Product.Item[] = [
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

let products = [...mockProducts]
let productIdCounter = products.length + 1

const paginate = <T,>(list: T[], page: number, pageSize: number) => ({
  list: list.slice((page - 1) * pageSize, page * pageSize),
  total: list.length,
  page,
  pageSize,
})

export const productAPI = {
  /**
   * 獲取商品列表
   */
  list: (params: Product.ListParams) => {
    if (isMock) {
      let filtered = [...products]
      if (params.keyword) {
        filtered = filtered.filter(p => p.name.includes(params.keyword!))
      }
      if (params.status) {
        filtered = filtered.filter(p => p.status === params.status)
      }
      if (params.category) {
        filtered = filtered.filter(p => p.category === params.category)
      }
      return Promise.resolve(paginate(filtered, params.page, params.pageSize) as Product.ListResponse)
    }
    return request.get<Product.ListResponse>('/products', { params })
  },

  /**
   * 獲取商品詳情
   */
  get: (id: number) => {
    if (isMock) {
      const product = products.find(p => p.id === id)
      return product ? Promise.resolve(product as Product.Item) : Promise.reject(new Error('商品不存在'))
    }
    return request.get<Product.Item>(`/products/${id}`)
  },

  /**
   * 創建商品
   */
  create: (data: Product.CreateRequest) => {
    if (isMock) {
      const newProduct: Product.Item = {
        id: productIdCounter++,
        ...data,
        status: 'active',
        createdAt: new Date().toLocaleString('zh-TW'),
        updatedAt: new Date().toLocaleString('zh-TW'),
      }
      products.push(newProduct)
      return Promise.resolve(newProduct)
    }
    return request.post<Product.Item>('/products', data)
  },

  /**
   * 更新商品
   */
  update: (id: number, data: Product.UpdateRequest) => {
    if (isMock) {
      const idx = products.findIndex(p => p.id === id)
      if (idx !== -1) {
        products[idx] = { ...products[idx], ...data, updatedAt: new Date().toLocaleString('zh-TW') }
        return Promise.resolve(products[idx])
      }
      return Promise.reject(new Error('商品不存在'))
    }
    return request.put<Product.Item>(`/products/${id}`, data)
  },

  /**
   * 刪除商品
   */
  delete: (id: number) => {
    if (isMock) {
      products = products.filter(p => p.id !== id)
      return Promise.resolve(void 0)
    }
    return request.delete<void>(`/products/${id}`)
  },

  /**
   * 批量刪除商品
   */
  deleteBatch: (ids: number[]) => {
    if (isMock) {
      products = products.filter(p => !ids.includes(p.id))
      return Promise.resolve(void 0)
    }
    return request.post<void>('/products/batch-delete', { ids })
  },
}

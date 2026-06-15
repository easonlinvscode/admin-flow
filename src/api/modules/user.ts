import request from '@/api/request'
import type { User } from '@/api/types'

const isMock = import.meta.env.VITE_MOCK_ENABLED === 'true'

// Mock 資料
const mockUsers: User.Item[] = [
  { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin', status: 'active', createdAt: '2024-01-01 08:00:00', updatedAt: '2024-03-15 10:30:00' },
  { id: 2, username: 'editor_wang', email: 'wang@example.com', role: 'editor', status: 'active', createdAt: '2024-01-15 09:20:00', updatedAt: '2024-03-10 14:00:00' },
  { id: 3, username: 'viewer_chen', email: 'chen@example.com', role: 'viewer', status: 'active', createdAt: '2024-02-01 11:00:00', updatedAt: '2024-02-28 09:15:00' },
  { id: 4, username: 'editor_lin', email: 'lin@example.com', role: 'editor', status: 'inactive', createdAt: '2024-02-10 14:30:00', updatedAt: '2024-03-01 16:00:00' },
  { id: 5, username: 'viewer_zhang', email: 'zhang@example.com', role: 'viewer', status: 'active', createdAt: '2024-02-20 10:00:00', updatedAt: '2024-03-20 11:45:00' },
  { id: 6, username: 'editor_liu', email: 'liu@example.com', role: 'editor', status: 'active', createdAt: '2024-03-01 09:00:00', updatedAt: '2024-04-01 08:30:00' },
  { id: 7, username: 'viewer_wu', email: 'wu@example.com', role: 'viewer', status: 'active', createdAt: '2024-03-05 13:20:00', updatedAt: '2024-04-05 10:00:00' },
  { id: 8, username: 'admin_lee', email: 'lee@example.com', role: 'admin', status: 'active', createdAt: '2024-03-10 15:00:00', updatedAt: '2024-04-10 09:00:00' },
]

let users = [...mockUsers]
let userIdCounter = users.length + 1

const paginate = <T,>(list: T[], page: number, pageSize: number) => ({
  list: list.slice((page - 1) * pageSize, page * pageSize),
  total: list.length,
  page,
  pageSize,
})

export const userAPI = {
  /**
   * 獲取用戶列表
   */
  list: (params: User.ListParams) => {
    if (isMock) {
      let filtered = [...users]
      if (params.keyword) {
        filtered = filtered.filter(u => u.username.includes(params.keyword!) || u.email.includes(params.keyword!))
      }
      if (params.role) {
        filtered = filtered.filter(u => u.role === params.role)
      }
      return Promise.resolve(paginate(filtered, params.page, params.pageSize) as User.ListResponse)
    }
    return request.get<User.ListResponse>('/users', { params })
  },

  /**
   * 獲取用戶詳情
   */
  get: (id: number) => {
    if (isMock) {
      const user = users.find(u => u.id === id)
      return user ? Promise.resolve(user as User.Item) : Promise.reject(new Error('用戶不存在'))
    }
    return request.get<User.Item>(`/users/${id}`)
  },

  /**
   * 創建用戶
   */
  create: (data: User.CreateRequest) => {
    if (isMock) {
      const newUser: User.Item = {
        id: userIdCounter++,
        ...data,
        status: 'active',
        createdAt: new Date().toLocaleString('zh-TW'),
        updatedAt: new Date().toLocaleString('zh-TW'),
      }
      users.push(newUser)
      return Promise.resolve(newUser)
    }
    return request.post<User.Item>('/users', data)
  },

  /**
   * 更新用戶
   */
  update: (id: number, data: User.UpdateRequest) => {
    if (isMock) {
      const idx = users.findIndex(u => u.id === id)
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...data, updatedAt: new Date().toLocaleString('zh-TW') }
        return Promise.resolve(users[idx])
      }
      return Promise.reject(new Error('用戶不存在'))
    }
    return request.put<User.Item>(`/users/${id}`, data)
  },

  /**
   * 刪除用戶
   */
  delete: (id: number) => {
    if (isMock) {
      users = users.filter(u => u.id !== id)
      return Promise.resolve(void 0)
    }
    return request.delete<void>(`/users/${id}`)
  },

  /**
   * 批量刪除用戶
   */
  deleteBatch: (ids: number[]) => {
    if (isMock) {
      users = users.filter(u => !ids.includes(u.id))
      return Promise.resolve(void 0)
    }
    return request.post<void>('/users/batch-delete', { ids })
  },
}

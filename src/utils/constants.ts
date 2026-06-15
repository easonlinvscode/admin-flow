/**
 * 應用常量
 */

// 用戶角色
export const USER_ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
} as const

// 用戶角色標籤
export const ROLE_LABELS: Record<string, string> = {
  admin: '管理員',
  editor: '編輯者',
  viewer: '查看者',
}

// 用戶狀態
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const

// 用戶狀態標籤
export const USER_STATUS_LABELS: Record<string, string> = {
  active: '活躍',
  inactive: '禁用',
}

// 商品狀態
export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const

// 商品狀態標籤
export const PRODUCT_STATUS_LABELS: Record<string, string> = {
  active: '上架',
  inactive: '下架',
}

// 訂單狀態
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const

// 訂單狀態標籤
export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: '待處理',
  processing: '處理中',
  shipped: '已發貨',
  completed: '已完成',
  cancelled: '已取消',
}

// 訂單狀態顏色（Element Plus）
export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: 'warning',
  processing: 'info',
  shipped: 'primary',
  completed: 'success',
  cancelled: 'danger',
}

// 分頁配置
export const PAGINATION = {
  PAGE: 1,
  PAGE_SIZE: 10,
  PAGE_SIZES: [10, 20, 50, 100],
}

// 時間配置
export const TIME_CONFIG = {
  DEBOUNCE_DELAY: 500, // 搜尋防抖延遲（毫秒）
  TOAST_DURATION: 3000, // 消息提示持續時間（毫秒）
  DIALOG_DELAY: 300, // 對話框延遲（毫秒）
}

// 角色權限映射
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: [
    'Dashboard',
    'UserList',
    'UserForm',
    'ProductList',
    'ProductForm',
    'OrderList',
    'OrderDetail',
    'RoleList',
    'RoleForm',
  ],
  editor: [
    'Dashboard',
    'UserList',
    'ProductList',
    'ProductForm',
    'OrderList',
    'OrderDetail',
  ],
  viewer: [
    'Dashboard',
    'UserList',
    'ProductList',
    'OrderList',
  ],
}

// 默認菜單配置
export const MENU_CONFIG = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    label: '儀表板',
    icon: 'Dashboard',
  },
  {
    path: '/users',
    name: 'UserList',
    label: '用戶管理',
    icon: 'User',
  },
  {
    path: '/products',
    name: 'ProductList',
    label: '商品管理',
    icon: 'Goods',
  },
  {
    path: '/orders',
    name: 'OrderList',
    label: '訂單管理',
    icon: 'ShoppingCart',
  },
  {
    path: '/roles',
    name: 'RoleList',
    label: '角色權限',
    icon: 'Setting',
  },
]

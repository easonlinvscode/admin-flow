// 認證相關類型
export namespace Auth {
  export interface LoginRequest {
    email: string;
    password: string;
  }

  export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: UserInfo;
  }

  export interface RefreshTokenRequest {
    refreshToken: string;
  }

  export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
  }

  export interface UserInfo {
    id: number;
    username: string;
    email: string;
    role: 'admin' | 'editor' | 'viewer';
    avatar?: string;
    status: 'active' | 'inactive';
    createdAt: string;
  }
}

// 用戶管理
export namespace User {
  export interface Item {
    id: number;
    username: string;
    email: string;
    role: 'admin' | 'editor' | 'viewer';
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
  }

  export interface CreateRequest {
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'editor' | 'viewer';
  }

  export interface UpdateRequest {
    username?: string;
    email?: string;
    password?: string;
    role?: Item['role'];
    status?: Item['status'];
  }

  export interface ListResponse {
    list: Item[];
    total: number;
    page: number;
    pageSize: number;
  }

  export interface ListParams {
    page: number;
    pageSize: number;
    keyword?: string;
    role?: string;
  }
}

// 商品管理
export namespace Product {
  export interface Item {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    status: 'active' | 'inactive';
    image?: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
  }

  export interface CreateRequest {
    name: string;
    category: string;
    price: number;
    stock: number;
    description?: string;
    image?: string;
  }

  export interface UpdateRequest {
    name?: string;
    category?: string;
    price?: number;
    stock?: number;
    status?: Item['status'];
    description?: string;
    image?: string;
  }

  export interface ListResponse {
    list: Item[];
    total: number;
    page: number;
    pageSize: number;
  }

  export interface ListParams {
    page: number;
    pageSize: number;
    keyword?: string;
    category?: string;
    status?: string;
  }
}

// 訂單管理
export namespace Order {
  export interface Item {
    id: number;
    orderNo: string;
    userId: number;
    userName?: string;
    totalAmount: number;
    status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
    items: OrderItem[];
    createdAt: string;
    updatedAt: string;
  }

  export interface OrderItem {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
  }

  export interface CreateRequest {
    userId: number;
    items: { productId: number; quantity: number }[];
  }

  export interface UpdateRequest {
    status?: Item['status'];
  }

  export interface ListResponse {
    list: Item[];
    total: number;
    page: number;
    pageSize: number;
  }

  export interface ListParams {
    page: number;
    pageSize: number;
    keyword?: string;
    status?: string;
  }
}

// 角色權限
export namespace Role {
  export interface Item {
    id: number;
    name: string;
    description?: string;
    permissions: string[];
    createdAt: string;
    updatedAt: string;
  }

  export interface CreateRequest {
    name: string;
    description?: string;
    permissions: string[];
  }

  export interface UpdateRequest {
    name?: string;
    description?: string;
    permissions?: string[];
  }

  export interface ListResponse {
    list: Item[];
    total: number;
  }
}

// Dashboard 統計
export namespace Dashboard {
  export interface Statistics {
    totalOrders: number;
    totalUsers: number;
    totalRevenue: number;
    conversionRate: number;
  }

  export interface TrendPoint {
    date: string;
    value: number;
  }

  export interface TrendResponse {
    data: TrendPoint[];
  }

  export interface SalesData {
    name: string;
    value: number;
  }

  export interface SalesResponse {
    data: SalesData[];
  }
}

// 通用分頁參數
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// 通用 API 響應
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// API 錯誤響應
export interface ApiErrorResponse {
  code: number;
  message: string;
  errors?: Record<string, string[]>;
}

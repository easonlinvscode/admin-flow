import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ROLE_PERMISSIONS } from '@/utils/constants'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/LoginPage.vue'),
    meta: {
      requiresAuth: false,
      title: '登入',
    },
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/Dashboard.vue'),
        meta: {
          title: '儀表板',
          requiredRole: 'viewer',
        },
      },
      {
        path: 'users',
        name: 'UserList',
        component: () => import('@/views/user/UserList.vue'),
        meta: {
          title: '用戶管理',
          requiredRole: 'viewer',
        },
      },
      {
        path: 'products',
        name: 'ProductList',
        component: () => import('@/views/product/ProductList.vue'),
        meta: {
          title: '商品管理',
          requiredRole: 'viewer',
        },
      },
      {
        path: 'orders',
        name: 'OrderList',
        component: () => import('@/views/order/OrderList.vue'),
        meta: {
          title: '訂單管理',
          requiredRole: 'viewer',
        },
      },
      {
        path: 'roles',
        name: 'RoleList',
        component: () => import('@/views/role/RoleList.vue'),
        meta: {
          title: '角色權限',
          requiredRole: 'admin',
        },
      },
    ],
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('@/views/error/Forbidden.vue'),
    meta: {
      title: '無權限',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/NotFound.vue'),
    meta: {
      title: '頁面未找到',
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

/**
 * 路由守衛
 */
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  // 設置頁面標題
  document.title = `${to.meta.title} - AdminFlow` || 'AdminFlow'

  // 檢查是否需要認證
  if (to.meta.requiresAuth === false) {
    // 不需要認證的路由
    if (to.path === '/login' && authStore.isLoggedIn) {
      // 已登入用戶訪問登入頁，重定向到 dashboard
      return next('/dashboard')
    }
    return next()
  }

  // 需要認證的路由
  if (!authStore.isLoggedIn) {
    // 未登入，重定向到登入頁
    return next('/login')
  }

  // 如果已登入但未載入用戶信息，則獲取
  if (!authStore.userInfo) {
    try {
      await authStore.fetchUserInfo()
    } catch {
      authStore.logout()
      return next('/login')
    }
  }

  // 檢查頁面權限
  const requiredRole = to.meta.requiredRole as string | undefined
  if (requiredRole) {
    // 檢查用戶是否有權訪問此頁面
    const allowedRoles = Object.entries(ROLE_PERMISSIONS)
      .filter(([_, pages]) => pages.includes(to.name as string))
      .map(([role, _]) => role)

    if (!allowedRoles.includes(authStore.userRole)) {
      return next('/403')
    }
  }

  next()
})

export default router

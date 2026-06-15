<template>
  <div class="main-layout">
    <!-- 頂部導航欄 -->
    <header class="header">
      <div class="header-left">
        <!-- Hamburger button（僅 mobile 顯示） -->
        <el-button
          class="hamburger-btn"
          :icon="Expand"
          text
          @click="mobileMenuOpen = !mobileMenuOpen"
        />
        <div class="logo">AdminFlow</div>
        <el-menu
          :default-active="activeMenu"
          mode="horizontal"
          router
          class="nav-menu"
        >
          <el-menu-item
            v-for="menu in visibleMenus"
            :key="menu.path"
            :index="menu.path"
            :route="{ path: menu.path }"
          >
            {{ menu.label }}
          </el-menu-item>
        </el-menu>
      </div>
      <div class="header-right">
        <el-dropdown>
          <span class="user-info">
            {{ authStore.userName }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleProfile">
                個人資料
              </el-dropdown-item>
              <el-dropdown-item @click="handleSettings">
                設置
              </el-dropdown-item>
              <el-dropdown-item divided @click="handleLogout">
                登出
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>

    <!-- 主內容區 -->
    <div class="layout-container">
      <!-- Mobile 遮罩層 -->
      <div
        v-if="mobileMenuOpen"
        class="mobile-overlay"
        @click="mobileMenuOpen = false"
      />

      <!-- 側邊欄 -->
      <aside class="sidebar" :class="{ 'is-open': mobileMenuOpen }">
        <el-menu
          :default-active="activeMenu"
          router
          class="sidebar-menu"
          @select="handleMenuSelect"
        >
          <el-menu-item
            v-for="menu in visibleMenus"
            :key="menu.path"
            :index="menu.path"
            :route="{ path: menu.path }"
          >
            <template #title>
              {{ menu.label }}
            </template>
          </el-menu-item>
        </el-menu>
      </aside>

      <!-- 內容區 -->
      <main class="content">
        <!-- 麵包屑 -->
        <el-breadcrumb v-if="breadcrumbs.length > 0" class="breadcrumb">
          <el-breadcrumb-item to="/">首頁</el-breadcrumb-item>
          <el-breadcrumb-item
            v-for="crumb in breadcrumbs"
            :key="crumb.path"
            :to="crumb.path"
          >
            {{ crumb.label }}
          </el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 頁面內容 -->
        <div class="content-inner">
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown, Expand } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { MENU_CONFIG, ROLE_PERMISSIONS } from '@/utils/constants'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const activeMenu = ref('')
const mobileMenuOpen = ref(false)

// 根據用戶角色過濾菜單
const visibleMenus = computed(() => {
  const allowedPages = ROLE_PERMISSIONS[authStore.userRole] || []
  return MENU_CONFIG.filter((menu) => allowedPages.includes(menu.name))
})

// 麵包屑
const breadcrumbs = computed(() => {
  const path = route.path
  const crumbs = []

  const findMenu = (path: string) => {
    return visibleMenus.value.find((menu) => menu.path === path)
  }

  const menu = findMenu(path)
  if (menu) {
    crumbs.push({
      path: menu.path,
      label: menu.label,
    })
  }

  return crumbs
})

// 選單點擊（mobile 時關閉 drawer）
const handleMenuSelect = (index: string) => {
  activeMenu.value = index
  mobileMenuOpen.value = false
}

// 個人資料
const handleProfile = () => {
  ElMessage.info('個人資料功能待開發')
}

// 設置
const handleSettings = () => {
  ElMessage.info('設置功能待開發')
}

// 登出
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('確定要登出嗎？', '提示', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    authStore.logout()
    router.push('/login')
    ElMessage.success('登出成功')
  } catch {
    // 用戶取消登出
  }
}

// 更新 activeMenu
router.afterEach((to) => {
  activeMenu.value = to.path
  mobileMenuOpen.value = false
})

// 初始化 activeMenu
activeMenu.value = route.path
</script>

<style scoped lang="scss">
.main-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f7fa;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid $border-color;
  padding: 0 $spacing-xl;
  box-shadow: $shadow-sm;
  z-index: 100;
  position: relative;

  .header-left {
    display: flex;
    align-items: center;
    gap: $spacing-lg;
    flex: 1;

    .hamburger-btn {
      display: none;
      font-size: 22px;
      padding: 4px 8px;
      color: $text-primary;
    }

    .logo {
      font-size: 20px;
      font-weight: 600;
      color: $primary-color;
      white-space: nowrap;
    }

    .nav-menu {
      border: none;
      flex: 1;
    }
  }

  .header-right {
    .user-info {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      padding: $spacing-sm $spacing-md;
      cursor: pointer;
      border-radius: $border-radius;
      transition: $transition-fast;

      &:hover {
        background-color: #f5f7fa;
      }
    }
  }
}

:deep(.nav-menu) {
  background-color: transparent;

  .el-menu-item {
    &:hover {
      background-color: #f5f7fa;
    }

    &.is-active {
      border-bottom-color: $primary-color;
    }
  }
}

.layout-container {
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
}

.sidebar {
  width: 200px;
  background-color: #fff;
  border-right: 1px solid $border-color;
  overflow-y: auto;
  flex-shrink: 0;

  .sidebar-menu {
    border: none;
    background-color: transparent;
  }
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: $spacing-lg;

  .breadcrumb {
    margin-bottom: $spacing-lg;
    padding: $spacing-md;
    background-color: #fff;
    border-radius: $border-radius;
  }

  .content-inner {
    flex: 1;
    background-color: #fff;
    border-radius: $border-radius;
    padding: $spacing-lg;
    box-shadow: $shadow-sm;
  }
}

/* 響應式設計 */
@media (max-width: 768px) {
  .header {
    padding: 0 $spacing-md;

    .header-left {
      gap: $spacing-sm;

      .hamburger-btn {
        display: inline-flex;
      }

      .nav-menu {
        display: none;
      }
    }
  }

  .mobile-overlay {
    position: fixed;
    inset: 60px 0 0 0;
    background-color: rgba(0, 0, 0, 0.45);
    z-index: 199;
  }

  .sidebar {
    position: fixed;
    left: -200px;
    top: 60px;
    height: calc(100vh - 60px);
    z-index: 200;
    transition: left 0.28s ease;
    box-shadow: $shadow-lg;

    &.is-open {
      left: 0;
    }
  }
}
</style>

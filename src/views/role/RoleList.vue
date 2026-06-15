<template>
  <div class="role-list">
    <div class="page-header">
      <h1>角色與權限管理</h1>
    </div>

    <el-card>
      <div class="role-grid">
        <div v-for="role in roles" :key="role.name" class="role-card">
          <div class="role-header">
            <h3>{{ role.label }}</h3>
            <el-button link type="primary">編輯</el-button>
          </div>
          <div class="role-description">
            {{ role.description }}
          </div>
          <div class="permissions-list">
            <p class="list-title">可訪問頁面：</p>
            <div class="permissions">
              <el-tag
                v-for="permission in role.permissions"
                :key="permission"
                type="info"
              >
                {{ permission }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ROLE_PERMISSIONS } from '@/utils/constants'

interface RoleInfo {
  name: string
  label: string
  description: string
  permissions: string[]
}

const roles = ref<RoleInfo[]>([
  {
    name: 'admin',
    label: '管理員',
    description: '擁有系統的所有權限，可以管理所有資源和其他用戶',
    permissions: ROLE_PERMISSIONS['admin'],
  },
  {
    name: 'editor',
    label: '編輯者',
    description: '可以編輯大部分資源，但無法管理用戶和角色',
    permissions: ROLE_PERMISSIONS['editor'],
  },
  {
    name: 'viewer',
    label: '查看者',
    description: '僅能查看系統中的數據和報表，無法進行任何編輯',
    permissions: ROLE_PERMISSIONS['viewer'],
  },
])
</script>

<style scoped lang="scss">

.role-list {
  .page-header {
    margin-bottom: $spacing-2xl;

    h1 {
      font-size: 28px;
    }
  }

  .role-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: $spacing-lg;

    .role-card {
      padding: $spacing-lg;
      border: 1px solid $border-color;
      border-radius: $border-radius;
      transition: $transition-base;

      &:hover {
        box-shadow: $shadow-md;
        border-color: $primary-color;
      }

      .role-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: $spacing-lg;

        h3 {
          margin: 0;
          font-size: 18px;
          color: $text-primary;
        }
      }

      .role-description {
        font-size: 12px;
        color: $text-secondary;
        margin-bottom: $spacing-lg;
        line-height: 1.6;
      }

      .permissions-list {
        .list-title {
          font-size: 12px;
          font-weight: 600;
          color: $text-primary;
          margin-bottom: $spacing-md;
        }

        .permissions {
          display: flex;
          flex-wrap: wrap;
          gap: $spacing-sm;

          :deep(.el-tag) {
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>

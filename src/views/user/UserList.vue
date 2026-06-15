<template>
  <div class="user-list">
    <!-- 頁面標題 -->
    <div class="page-header">
      <h1>用戶管理</h1>
    </div>

    <!-- 搜尋和操作區 -->
    <el-card class="search-card">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6">
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜尋用戶名或郵箱"
            clearable
            @input="handleSearch"
          />
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-select
            v-model="searchForm.role"
            placeholder="選擇角色"
            clearable
            @change="handleSearch"
          >
            <el-option label="管理員" value="admin" />
            <el-option label="編輯者" value="editor" />
            <el-option label="查看者" value="viewer" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12">
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <el-button type="primary" :icon="Plus" @click="handleAdd">新增用戶</el-button>
            <el-button :icon="Download" @click="handleExportCSV">匯出 CSV</el-button>
            <el-button :icon="Refresh" @click="handleRefresh" />
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 用戶表格 -->
    <el-card style="margin-top: 16px">
      <el-table
        :data="state.list"
        :loading="state.loading"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用戶名" />
        <el-table-column prop="email" label="郵箱" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="{ row }">
            <el-tag>{{ getRoleLabel(row.role) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="狀態" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '活躍' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="建立時間" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">
              編輯
            </el-button>
            <el-popconfirm
              title="確定要刪除此用戶嗎？"
              confirm-button-text="確定"
              cancel-button-text="取消"
              @confirm="handleDelete(row.id)"
            >
              <template #reference>
                <el-button link type="danger">刪除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分頁 -->
      <el-pagination
        v-model:current-page="state.page"
        v-model:page-size="state.pageSize"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="state.total"
        @change="loadList"
        style="margin-top: 16px; text-align: right"
      />
    </el-card>

    <!-- 編輯對話框 -->
    <UserFormDialog
      v-model="dialogVisible"
      :user="selectedUser"
      @submit="handleFormSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { debounce } from 'lodash-es'
import { ElMessage } from 'element-plus'
import { Plus, Refresh, Download } from '@element-plus/icons-vue'
import { userAPI } from '@/api/modules/user'
import { ROLE_LABELS } from '@/utils/constants'
import { exportToCSV } from '@/utils/export'
import UserFormDialog from './UserFormDialog.vue'
import type { User } from '@/api/types'

// 狀態
const state = reactive({
  list: [] as User.Item[],
  total: 0,
  page: 1,
  pageSize: 10,
  loading: false,
})

// 搜尋表單
const searchForm = reactive({
  keyword: '',
  role: '',
})

// 對話框
const dialogVisible = ref(false)
const selectedUser = ref<User.Item | null>(null)

// 獲取角色標籤
const getRoleLabel = (role: string) => {
  return ROLE_LABELS[role] || role
}

// 加載列表
const loadList = async () => {
  state.loading = true
  try {
    const data = await userAPI.list({
      page: state.page,
      pageSize: state.pageSize,
      keyword: searchForm.keyword || undefined,
      role: searchForm.role || undefined,
    })
    
    state.list = data.list
    state.total = data.total
  } catch (error) {
    ElMessage.error('加載用戶列表失敗')
    console.error('Load user list error:', error)
  } finally {
    state.loading = false
  }
}

// 搜尋（防抖）
const handleSearch = debounce(() => {
  state.page = 1
  loadList()
}, 500)

// 刷新
const handleRefresh = () => {
  loadList()
}

// 新增用戶
const handleAdd = () => {
  selectedUser.value = null
  dialogVisible.value = true
}

// 編輯用戶
const handleEdit = (user: User.Item) => {
  selectedUser.value = { ...user }
  dialogVisible.value = true
}

// 刪除用戶
const handleDelete = async (id: number) => {
  try {
    await userAPI.delete(id)
    ElMessage.success('刪除成功')
    await loadList()
  } catch (error) {
    ElMessage.error('刪除失敗')
    console.error('Delete user error:', error)
  }
}

// 表單提交
const handleFormSubmit = async () => {
  dialogVisible.value = false
  await loadList()
}

// CSV 匯出
const handleExportCSV = () => {
  exportToCSV(state.list, [
    { key: 'id', label: 'ID' },
    { key: 'username', label: '用戶名' },
    { key: 'email', label: '郵箱' },
    { key: 'role', label: '角色', formatter: v => ROLE_LABELS[v] || v },
    { key: 'status', label: '狀態', formatter: v => v === 'active' ? '活躍' : '禁用' },
    { key: 'createdAt', label: '建立時間' },
  ], '用戶列表')
  ElMessage.success('CSV 匯出成功')
}

// 初始化
onMounted(loadList)
</script>

<style scoped lang="scss">

.user-list {
  .page-header {
    margin-bottom: $spacing-2xl;

    h1 {
      font-size: 28px;
    }
  }

  .search-card {
    :deep(.el-card__body) {
      padding: $spacing-lg;
    }

    :deep(.el-select) {
      width: 100%;
    }

    :deep(.el-input) {
      width: 100%;
    }
  }

  :deep(.el-table) {
    margin-top: $spacing-lg;
  }
}
</style>

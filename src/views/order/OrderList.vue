<template>
  <div class="order-list">
    <div class="page-header">
      <h1>訂單管理</h1>
    </div>

    <!-- 搜尋和操作區 -->
    <el-card class="search-card">
      <el-row :gutter="16" align="middle">
        <el-col :xs="24" :sm="12" :md="7">
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜尋訂單號或客戶姓名"
            clearable
            :prefix-icon="Search"
            @input="handleSearch"
          />
        </el-col>
        <el-col :xs="24" :sm="12" :md="5">
          <el-select
            v-model="searchForm.status"
            placeholder="全部狀態"
            clearable
            @change="handleSearch"
            style="width: 100%"
          >
            <el-option label="待處理" value="pending" />
            <el-option label="處理中" value="processing" />
            <el-option label="已發貨" value="shipped" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12">
          <div class="action-buttons">
            <el-button :icon="Download" @click="handleExportCSV">匯出 CSV</el-button>
            <el-button :icon="Refresh" @click="loadList" />
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 訂單表格 -->
    <el-card style="margin-top: 16px">
      <el-table
        v-loading="state.loading"
        :data="state.list"
        stripe
        border
        style="width: 100%"
        highlight-current-row
      >
        <el-table-column prop="id" label="ID" width="70" align="center" />
        <el-table-column prop="orderNo" label="訂單號" width="155" />
        <el-table-column prop="userName" label="客戶名稱" />
        <el-table-column label="金額" width="120" align="right">
          <template #default="{ row }">
            <span class="amount-text">${{ row.totalAmount.toLocaleString('zh-TW') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="狀態" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="商品數" width="80" align="center">
          <template #default="{ row }">
            {{ row.items?.length ?? 0 }} 件
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="建立時間" width="170" />
        <el-table-column label="操作" width="120" fixed="right" align="center">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">
              <el-icon><View /></el-icon> 詳情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分頁 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="state.page"
          v-model:page-size="state.pageSize"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="state.total"
          @change="loadList"
        />
      </div>
    </el-card>

    <!-- 訂單詳情 Dialog -->
    <OrderDetailDialog
      v-model="dialogVisible"
      :order-id="selectedOrderId"
      @updated="loadList"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { debounce } from 'lodash-es'
import { ElMessage } from 'element-plus'
import { Refresh, Download, Search, View } from '@element-plus/icons-vue'
import { orderAPI } from '@/api/modules/order'
import { ORDER_STATUS_LABELS } from '@/utils/constants'
import { exportToCSV } from '@/utils/export'
import OrderDetailDialog from './OrderDetailDialog.vue'
import type { Order } from '@/api/types'

const state = reactive({
  list: [] as Order.Item[],
  total: 0,
  page: 1,
  pageSize: 10,
  loading: false,
})

const searchForm = reactive({
  keyword: '',
  status: '',
})

const dialogVisible = ref(false)
const selectedOrderId = ref<number | null>(null)

const getStatusLabel = (status: string) => ORDER_STATUS_LABELS[status] || status
const getStatusType = (status: string): 'success' | 'info' | 'warning' | 'danger' => {
  const map: Record<string, any> = {
    completed: 'success', processing: 'info',
    shipped: 'primary', pending: 'warning', cancelled: 'danger',
  }
  return map[status] || 'info'
}

const loadList = async () => {
  state.loading = true
  try {
    const data = await orderAPI.list({
      page: state.page,
      pageSize: state.pageSize,
      keyword: searchForm.keyword || undefined,
      status: searchForm.status || undefined,
    })
    state.list = data.list
    state.total = data.total
  } catch {
    ElMessage.error('加載訂單列表失敗')
  } finally {
    state.loading = false
  }
}

const handleSearch = debounce(() => {
  state.page = 1
  loadList()
}, 500)

const handleView = (order: Order.Item) => {
  selectedOrderId.value = order.id
  dialogVisible.value = true
}

const handleExportCSV = () => {
  exportToCSV(state.list, [
    { key: 'id', label: 'ID' },
    { key: 'orderNo', label: '訂單號' },
    { key: 'userName', label: '客戶名稱' },
    { key: 'totalAmount', label: '金額' },
    { key: 'status', label: '狀態', formatter: v => getStatusLabel(v) },
    { key: 'createdAt', label: '建立時間' },
  ], '訂單列表')
  ElMessage.success('CSV 匯出成功')
}

onMounted(loadList)
</script>

<style scoped lang="scss">

.order-list {
  .page-header {
    margin-bottom: $spacing-2xl;
    h1 { font-size: 26px; font-weight: 600; }
  }

  .action-buttons {
    display: flex;
    gap: 8px;
  }

  .amount-text {
    color: #e6a23c;
    font-weight: 500;
  }

  .pagination-wrapper {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }

  :deep(.el-select),
  :deep(.el-input) {
    width: 100%;
  }
}
</style>

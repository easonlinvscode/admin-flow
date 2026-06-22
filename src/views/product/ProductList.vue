<template>
  <div class="product-list">
    <div class="page-header">
      <h1>商品管理</h1>
    </div>

    <!-- 搜尋和操作區 -->
    <el-card class="search-card">
      <el-row :gutter="16" align="middle">
        <el-col :xs="24" :sm="12" :md="6">
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜尋商品名稱"
            clearable
            :prefix-icon="Search"
            @input="handleSearch"
          />
        </el-col>
        <el-col :xs="24" :sm="12" :md="5">
          <el-select
            v-model="searchForm.category"
            placeholder="全部分類"
            clearable
            @change="handleSearch"
            style="width: 100%"
          >
            <el-option v-for="cat in categories" :key="cat" :label="cat" :value="cat" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="4">
          <el-select
            v-model="searchForm.status"
            placeholder="全部狀態"
            clearable
            @change="handleSearch"
            style="width: 100%"
          >
            <el-option label="上架" value="active" />
            <el-option label="下架" value="inactive" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="9">
          <div class="action-buttons">
            <el-button type="primary" :icon="Plus" @click="handleAdd">新增商品</el-button>
            <el-button :icon="Download" @click="handleExportCSV">匯出 CSV</el-button>
            <el-button :icon="Refresh" @click="loadList" />
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 商品表格 -->
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
        <el-table-column prop="name" label="商品名稱" min-width="160" show-overflow-tooltip />
        <el-table-column prop="category" label="分類" width="100" align="center">
          <template #default="{ row }">
            <el-tag size="small" type="info">{{ row.category }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="售價" width="110" align="right">
          <template #default="{ row }">
            <span class="price-text">${{ row.price.toLocaleString('zh-TW') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="庫存" width="80" align="center">
          <template #default="{ row }">
            <span :class="{ 'low-stock': row.stock <= 20 }">{{ row.stock }}</span>
          </template>
        </el-table-column>
        <el-table-column label="狀態" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'" size="small">
              {{ row.status === 'active' ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新時間" width="170" />
        <el-table-column label="操作" width="160" fixed="right" align="center">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">編輯</el-button>
            <el-button
              link
              :type="row.status === 'active' ? 'warning' : 'success'"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 'active' ? '下架' : '上架' }}
            </el-button>
            <el-popconfirm
              title="確定要刪除此商品嗎？"
              confirm-button-text="刪除"
              cancel-button-text="取消"
              confirm-button-type="danger"
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

    <!-- 新增 / 編輯 Dialog -->
    <ProductFormDialog
      v-model="dialogVisible"
      :product="selectedProduct"
      @submit="handleFormSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { debounce } from 'lodash-es'
import { ElMessage } from 'element-plus'
import { Plus, Refresh, Download, Search } from '@element-plus/icons-vue'
import { productAPI } from '@/api/modules/product'
import { exportToCSV } from '@/utils/export'
import ProductFormDialog from './ProductFormDialog.vue'
import type { Product } from '@/api/types'

const categories = ['3C電子', '服飾', '食品', '家居', '書籍', '運動', '其他']

const state = reactive({
  list: [] as Product.Item[],
  total: 0,
  page: 1,
  pageSize: 10,
  loading: false,
})

const searchForm = reactive({
  keyword: '',
  category: '',
  status: '',
})

const dialogVisible = ref(false)
const selectedProduct = ref<Product.Item | null>(null)

const loadList = async () => {
  state.loading = true
  try {
    const data = await productAPI.list({
      page: state.page,
      pageSize: state.pageSize,
      keyword: searchForm.keyword || undefined,
      status: searchForm.status || undefined,
      category: searchForm.category || undefined,
    })
    state.list = data.list
    state.total = data.total
  } catch {
    ElMessage.error('加載商品列表失敗')
  } finally {
    state.loading = false
  }
}

const handleSearch = debounce(() => {
  state.page = 1
  loadList()
}, 500)

const handleAdd = () => {
  selectedProduct.value = null
  dialogVisible.value = true
}

const handleEdit = (product: Product.Item) => {
  selectedProduct.value = { ...product }
  dialogVisible.value = true
}

const handleFormSubmit = () => {
  loadList()
}

const handleToggleStatus = async (product: Product.Item) => {
  const newStatus = product.status === 'active' ? 'inactive' : 'active'
  try {
    await productAPI.update(product.id, { status: newStatus })
    product.status = newStatus
    ElMessage.success(newStatus === 'active' ? '商品已上架' : '商品已下架')
  } catch {
    ElMessage.error('操作失敗')
  }
}

const handleDelete = async (id: number) => {
  try {
    await productAPI.delete(id)
    ElMessage.success('刪除成功')
    if (state.list.length === 1 && state.page > 1) state.page--
    await loadList()
  } catch {
    ElMessage.error('刪除失敗')
  }
}

const handleExportCSV = () => {
  exportToCSV(state.list, [
    { key: 'id', label: 'ID' },
    { key: 'name', label: '商品名稱' },
    { key: 'category', label: '分類' },
    { key: 'price', label: '售價' },
    { key: 'stock', label: '庫存' },
    { key: 'status', label: '狀態', formatter: v => v === 'active' ? '上架' : '下架' },
    { key: 'updatedAt', label: '更新時間' },
  ], '商品列表')
  ElMessage.success('CSV 匯出成功')
}

onMounted(loadList)
</script>

<style scoped lang="scss">

.product-list {
  .page-header {
    margin-bottom: $spacing-2xl;
    h1 { font-size: 26px; font-weight: 600; }
  }

  .action-buttons {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .price-text {
    font-weight: 500;
    color: #e6a23c;
  }

  .low-stock {
    color: #f56c6c;
    font-weight: 600;
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

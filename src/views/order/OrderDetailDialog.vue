<template>
  <el-dialog
    v-model="visible"
    title="訂單詳情"
    width="680px"
    :close-on-click-modal="false"
    draggable
  >
    <div v-loading="loading" class="order-detail">
      <template v-if="orderData">
        <!-- 基本資訊 -->
        <el-descriptions :column="2" border size="small" class="section">
          <el-descriptions-item label="訂單號" :span="2">
            <strong>{{ orderData.orderNo }}</strong>
          </el-descriptions-item>
          <el-descriptions-item label="客戶名稱">{{ orderData.userName }}</el-descriptions-item>
          <el-descriptions-item label="訂單金額">
            <span class="amount-text">${{ orderData.totalAmount.toLocaleString('zh-TW') }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="建立時間">{{ orderData.createdAt }}</el-descriptions-item>
          <el-descriptions-item label="更新時間">{{ orderData.updatedAt }}</el-descriptions-item>
        </el-descriptions>

        <!-- 訂單狀態 -->
        <div class="section">
          <div class="section-title">訂單狀態</div>
          <div class="status-flow">
            <template v-for="(step, index) in statusSteps" :key="step.value">
              <div
                class="status-step"
                :class="{
                  'is-active': step.value === orderData.status,
                  'is-done': getStatusOrder(orderData.status) > index,
                  'is-cancelled': orderData.status === 'cancelled',
                }"
              >
                <div class="step-dot">
                  <el-icon v-if="getStatusOrder(orderData.status) > index && orderData.status !== 'cancelled'">
                    <Check />
                  </el-icon>
                  <el-icon v-else-if="step.value === orderData.status && orderData.status === 'cancelled'">
                    <Close />
                  </el-icon>
                </div>
                <div class="step-label">{{ step.label }}</div>
              </div>
              <div v-if="index < statusSteps.length - 1" class="status-line"
                :class="{ 'is-done': getStatusOrder(orderData.status) > index && orderData.status !== 'cancelled' }"
              />
            </template>
          </div>

          <!-- 變更狀態 -->
          <div class="status-actions">
            <span style="font-size: 13px; color: #606266; margin-right: 8px">變更狀態：</span>
            <el-select
              v-model="newStatus"
              placeholder="選擇新狀態"
              style="width: 140px; margin-right: 8px"
              :disabled="orderData.status === 'completed' || orderData.status === 'cancelled'"
            >
              <el-option
                v-for="opt in availableStatusOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
            <el-button
              type="primary"
              size="small"
              :loading="updating"
              :disabled="!newStatus || newStatus === orderData.status"
              @click="handleUpdateStatus"
            >
              確認變更
            </el-button>
          </div>
        </div>

        <!-- 訂單商品 -->
        <div class="section">
          <div class="section-title">訂購商品</div>
          <el-table :data="orderData.items" border size="small">
            <el-table-column prop="productName" label="商品名稱" />
            <el-table-column prop="price" label="單價" width="100" align="right">
              <template #default="{ row }">${{ row.price.toLocaleString('zh-TW') }}</template>
            </el-table-column>
            <el-table-column prop="quantity" label="數量" width="80" align="center" />
            <el-table-column label="小計" width="110" align="right">
              <template #default="{ row }">
                <strong>${{ (row.price * row.quantity).toLocaleString('zh-TW') }}</strong>
              </template>
            </el-table-column>
          </el-table>
          <div class="total-row">
            合計：<strong class="amount-text">${{ orderData.totalAmount.toLocaleString('zh-TW') }}</strong>
          </div>
        </div>
      </template>
    </div>

    <template #footer>
      <el-button @click="visible = false">關閉</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Check, Close } from '@element-plus/icons-vue'
import { orderAPI } from '@/api/modules/order'
import { ORDER_STATUS_LABELS } from '@/utils/constants'
import type { Order } from '@/api/types'

const props = defineProps<{
  modelValue: boolean
  orderId: number | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'updated': []
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const loading = ref(false)
const updating = ref(false)
const orderData = ref<Order.Item | null>(null)
const newStatus = ref('')

// 狀態流程步驟（不含 cancelled，因為 cancelled 是例外狀態）
const statusSteps = [
  { value: 'pending', label: '待處理' },
  { value: 'processing', label: '處理中' },
  { value: 'shipped', label: '已發貨' },
  { value: 'completed', label: '已完成' },
]

const getStatusOrder = (status: string) => {
  const order = statusSteps.findIndex(s => s.value === status)
  return order === -1 ? -1 : order
}

// 可切換的狀態選項
const availableStatusOptions = computed(() => {
  const allOptions = Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({ value, label }))
  return allOptions.filter(o => o.value !== orderData.value?.status)
})

// 加載訂單詳情
watch(
  () => props.orderId,
  async (id) => {
    if (!id) return
    loading.value = true
    newStatus.value = ''
    try {
      orderData.value = await orderAPI.get(id)
    } catch {
      ElMessage.error('加載訂單詳情失敗')
    } finally {
      loading.value = false
    }
  },
  { immediate: true }
)

const handleUpdateStatus = async () => {
  if (!orderData.value || !newStatus.value) return
  updating.value = true
  try {
    await orderAPI.update(orderData.value.id, { status: newStatus.value as Order.Item['status'] })
    orderData.value.status = newStatus.value as Order.Item['status']
    orderData.value.updatedAt = new Date().toLocaleString('zh-TW')
    ElMessage.success(`訂單狀態已更新為「${ORDER_STATUS_LABELS[newStatus.value]}」`)
    newStatus.value = ''
    emit('updated')
  } catch {
    ElMessage.error('狀態更新失敗')
  } finally {
    updating.value = false
  }
}
</script>

<style scoped lang="scss">
.order-detail {
  min-height: 200px;

  .section {
    margin-bottom: 24px;

    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: #303133;
      padding: 0 0 10px;
      border-bottom: 1px solid #ebeef5;
      margin-bottom: 14px;
    }
  }

  .amount-text {
    color: #e6a23c;
    font-weight: 600;
    font-size: 15px;
  }

  // 狀態流程
  .status-flow {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    padding: 16px 0;

    .status-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;

      .step-dot {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 2px solid #dcdfe6;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #fff;
        transition: all 0.3s;
      }

      .step-label {
        font-size: 12px;
        color: #909399;
        white-space: nowrap;
      }

      &.is-done .step-dot {
        border-color: #67C23A;
        background: #67C23A;
      }

      &.is-active .step-dot {
        border-color: #409EFF;
        background: #409EFF;
        box-shadow: 0 0 0 4px rgba(64, 158, 255, 0.2);
      }

      &.is-active .step-label {
        color: #409EFF;
        font-weight: 600;
      }

      &.is-cancelled .step-dot {
        border-color: #f56c6c;
        background: #f56c6c;
      }
    }

    .status-line {
      flex: 1;
      height: 2px;
      background: #dcdfe6;
      margin: 0 4px;
      margin-bottom: 24px;
      transition: background 0.3s;

      &.is-done {
        background: #67C23A;
      }
    }
  }

  .status-actions {
    display: flex;
    align-items: center;
    padding: 12px;
    background: #f5f7fa;
    border-radius: 6px;
  }

  .total-row {
    text-align: right;
    padding: 10px 12px 0;
    font-size: 14px;
    color: #606266;
  }
}
</style>

<template>
  <div class="dashboard">
    <!-- 頁面標題 -->
    <div class="page-header">
      <h1>儀表板</h1>
      <p>歡迎回來，{{ authStore.userName }}！</p>
    </div>

    <!-- 統計卡片 -->
    <el-row :gutter="20" class="statistics-row">
      <el-col :xs="24" :sm="12" :md="6">
        <StatCard
          title="訂單總數"
          :value="stats.totalOrders"
          :loading="statsLoading"
          icon="ShoppingCart"
          color="#409EFF"
          suffix="筆"
        />
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <StatCard
          title="會員總數"
          :value="stats.totalUsers"
          :loading="statsLoading"
          icon="User"
          color="#67C23A"
          suffix="人"
        />
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <StatCard
          title="總銷售額"
          :value="formattedRevenue"
          :loading="statsLoading"
          icon="Money"
          color="#E6A23C"
        />
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <StatCard
          title="轉換率"
          :value="stats.conversionRate"
          :loading="statsLoading"
          icon="TrendCharts"
          color="#F56C6C"
          suffix="%"
        />
      </el-col>
    </el-row>

    <!-- 圖表區 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <!-- 訂單趨勢 (折線圖) -->
      <el-col :xs="24" :md="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>近 7 日訂單趨勢</span>
              <el-tag size="small" type="info">每日</el-tag>
            </div>
          </template>
          <div ref="orderChartRef" class="chart-container" v-loading="chartsLoading" />
        </el-card>
      </el-col>

      <!-- 分類銷售統計 (圓餅圖) -->
      <el-col :xs="24" :md="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>分類銷售佔比</span>
              <el-tag size="small" type="success">本月</el-tag>
            </div>
          </template>
          <div ref="salesChartRef" class="chart-container" v-loading="chartsLoading" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 會員成長趨勢 (長條圖) -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :xs="24" :md="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>近 7 日新增會員</span>
              <el-tag size="small" type="warning">每日</el-tag>
            </div>
          </template>
          <div ref="userGrowthChartRef" class="chart-container chart-container--wide" v-loading="chartsLoading" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近訂單 -->
    <el-card style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <span>最近訂單</span>
          <el-link type="primary" underline="never" @click="$router.push('/orders')">查看全部</el-link>
        </div>
      </template>

      <el-table :data="recentOrders" stripe border>
        <el-table-column prop="orderNo" label="訂單號" width="150" />
        <el-table-column prop="userName" label="客戶" />
        <el-table-column label="金額" align="right" width="120">
          <template #default="{ row }">
            ${{ row.totalAmount.toLocaleString('zh-TW') }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="狀態" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="建立時間" width="180" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { useAuthStore } from '@/stores/auth'
import { dashboardAPI } from '@/api/modules/dashboard'
import { orderAPI } from '@/api/modules/order'
import { ORDER_STATUS_LABELS } from '@/utils/constants'
import StatCard from './StatCard.vue'
import type { Dashboard, Order } from '@/api/types'

const authStore = useAuthStore()

// ─── 統計卡片資料 ──────────────────────────────────────────
const statsLoading = ref(true)
const stats = ref<Dashboard.Statistics>({
  totalOrders: 0,
  totalUsers: 0,
  totalRevenue: 0,
  conversionRate: 0,
})

const formattedRevenue = computed(() => {
  const val = stats.value.totalRevenue
  if (val >= 10000) return `$${(val / 10000).toFixed(1)}萬`
  return `$${val.toLocaleString('zh-TW')}`
})

// ─── 最近訂單 ──────────────────────────────────────────────
const recentOrders = ref<Order.Item[]>([])

const getStatusLabel = (status: string) => ORDER_STATUS_LABELS[status] || status
const getStatusType = (status: string): 'success' | 'info' | 'warning' | 'danger' => {
  const map: Record<string, any> = {
    completed: 'success', processing: 'info', shipped: 'primary',
    pending: 'warning', cancelled: 'danger',
  }
  return map[status] || 'info'
}

// ─── ECharts 圖表 ─────────────────────────────────────────
const chartsLoading = ref(true)
const orderChartRef = ref<HTMLElement | null>(null)
const salesChartRef = ref<HTMLElement | null>(null)
const userGrowthChartRef = ref<HTMLElement | null>(null)

let orderChart: echarts.ECharts | null = null
let salesChart: echarts.ECharts | null = null
let userGrowthChart: echarts.ECharts | null = null

const initOrderTrendChart = (data: Dashboard.TrendPoint[]) => {
  if (!orderChartRef.value) return
  orderChart = echarts.init(orderChartRef.value)
  orderChart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: data.map(d => d.date),
      boundaryGap: false,
    },
    yAxis: { type: 'value', name: '筆數' },
    series: [{
      name: '訂單數',
      type: 'line',
      smooth: true,
      data: data.map(d => d.value),
      areaStyle: { opacity: 0.15 },
      lineStyle: { color: '#409EFF', width: 2 },
      itemStyle: { color: '#409EFF' },
      symbol: 'circle',
      symbolSize: 6,
    }],
  })
}

const initSalesChart = (data: Dashboard.SalesData[]) => {
  if (!salesChartRef.value) return
  salesChart = echarts.init(salesChartRef.value)
  salesChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: ${c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
    },
    series: [{
      name: '銷售額',
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['40%', '50%'],
      data: data.map(d => ({ name: d.name, value: d.value })),
      emphasis: {
        itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.2)' },
      },
      label: { show: false },
    }],
    color: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399', '#b37feb'],
  })
}

const initUserGrowthChart = (data: Dashboard.TrendPoint[]) => {
  if (!userGrowthChartRef.value) return
  userGrowthChart = echarts.init(userGrowthChartRef.value)
  userGrowthChart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: data.map(d => d.date),
    },
    yAxis: { type: 'value', name: '人數' },
    series: [{
      name: '新增會員',
      type: 'bar',
      data: data.map(d => d.value),
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#67C23A' },
          { offset: 1, color: '#b3e19d' },
        ]),
        borderRadius: [4, 4, 0, 0],
      },
      barMaxWidth: 50,
    }],
  })
}

// 響應式 resize
const handleResize = () => {
  orderChart?.resize()
  salesChart?.resize()
  userGrowthChart?.resize()
}

// ─── 初始化資料 ────────────────────────────────────────────
const loadStats = async () => {
  try {
    stats.value = await dashboardAPI.getStatistics()
  } finally {
    statsLoading.value = false
  }
}

const loadCharts = async () => {
  chartsLoading.value = true
  try {
    const [orderRes, salesRes, userRes] = await Promise.all([
      dashboardAPI.getOrderTrends(),
      dashboardAPI.getSalesData(),
      dashboardAPI.getUserGrowth(),
    ])

    await nextTick()
    initOrderTrendChart(orderRes.data)
    initSalesChart(salesRes.data)
    initUserGrowthChart(userRes.data)
  } finally {
    chartsLoading.value = false
  }
}

const loadRecentOrders = async () => {
  try {
    const res = await orderAPI.list({ page: 1, pageSize: 5 })
    recentOrders.value = res.list
  } catch {
    // 靜默失敗
  }
}

onMounted(async () => {
  await Promise.all([loadStats(), loadCharts(), loadRecentOrders()])
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  orderChart?.dispose()
  salesChart?.dispose()
  userGrowthChart?.dispose()
})
</script>

<style scoped lang="scss">

.dashboard {
  .page-header {
    margin-bottom: $spacing-2xl;

    h1 {
      font-size: 26px;
      font-weight: 600;
      margin-bottom: $spacing-sm;
    }

    p {
      color: $text-secondary;
      font-size: 14px;
    }
  }

  .statistics-row {
    margin-bottom: $spacing-lg;
  }

  .chart-container {
    width: 100%;
    height: 300px;

    &--wide {
      height: 260px;
    }
  }

  :deep(.card-header) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
  }
}
</style>

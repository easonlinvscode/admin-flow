<template>
  <!-- el-card 外層保留 SCSS（需用專案變數 $shadow-lg / $transition-base）-->
  <el-card class="stat-card" :style="{ borderLeftColor: color }" v-loading="loading">
    <!--
      ✅ 內部 layout 完全改用 Tailwind utility classes：
        flex items-center gap-4  →  display:flex; align-items:center; gap:1rem
        h-[60px] w-[60px]        →  任意尺寸（Tailwind v4 支援 [arbitrary values]）
        shrink-0                  →  flex-shrink:0
        rounded-lg                →  border-radius: 0.5rem
        text-xs tracking-wider   →  font-size:12px; letter-spacing:0.05em
        text-gray-500             →  color: #6b7280
        text-2xl font-semibold   →  font-size:1.5rem; font-weight:600
        leading-tight             →  line-height:1.25
    -->
    <div class="flex items-center gap-4">
      <!-- 圖示區塊 -->
      <div
        class="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-lg border"
        :style="{ backgroundColor: color + '1a', borderColor: color + '44' }"
      >
        <el-icon :size="26" :style="{ color }">
          <component :is="icon" />
        </el-icon>
      </div>

      <!-- 數值區塊 -->
      <div class="min-w-0 flex-1">
        <p class="mb-1.5 text-xs tracking-wider text-gray-500">{{ title }}</p>
        <p class="m-0 text-2xl font-semibold leading-tight text-gray-800">
          <span v-if="!loading">{{ value }}{{ suffix }}</span>
          <el-skeleton-item v-else variant="text" style="width: 80px; height: 28px;" />
        </p>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  value: string | number
  icon: string
  color?: string
  suffix?: string
  loading?: boolean
}>()
</script>

<style scoped lang="scss">
/*
 * 只保留「Tailwind 無法直接表達」的部分：
 *  - 動態 border-left 色（runtime JS 決定，不能 JIT）
 *  - 專案 SCSS 變數 $shadow-lg、$transition-base、$border-radius
 *  - Element Plus 深層選擇器 :deep(.el-card__body)
 */
.stat-card {
  border-left: 4px solid;
  border-radius: $border-radius;
  transition: $transition-base;
  cursor: default;
  min-height: 96px;

  &:hover {
    box-shadow: $shadow-lg;
    transform: translateY(-2px);
  }

  :deep(.el-card__body) {
    padding: $spacing-lg;
  }
}

@media (max-width: 768px) {
  .stat-card :deep(.el-card__body) { padding: $spacing-md; }
}
</style>

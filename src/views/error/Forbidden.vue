<template>
  <div class="error-page forbidden">
    <div class="error-container">
      <div class="error-code">403</div>
      <div class="error-title">無權限訪問</div>
      <div class="error-description">
        抱歉，您沒有權限訪問此頁面。請聯繫管理員申請訪問權限
      </div>
      <el-button type="primary" @click="goHome">
        返回首頁
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/dashboard')
}
</script>

<style scoped lang="scss">

.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);

  .error-container {
    text-align: center;
    color: white;

    .error-code {
      font-size: 120px;
      font-weight: 700;
      margin-bottom: $spacing-lg;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    }

    .error-title {
      font-size: 32px;
      font-weight: 600;
      margin-bottom: $spacing-md;
    }

    .error-description {
      font-size: 16px;
      margin-bottom: $spacing-2xl;
      opacity: 0.9;
    }
  }
}
</style>

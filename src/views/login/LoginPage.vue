<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Logo 和標題 -->
      <div class="login-header">
        <h1>AdminFlow</h1>
        <p>企業級後台管理系統</p>
      </div>

      <!-- 登入表單 -->
      <el-form
        ref="formRef"
        :model="loginForm"
        :rules="rules"
        @keyup.enter="handleLogin"
      >
        <!-- 郵箱輸入 -->
        <el-form-item prop="email">
          <el-input
            v-model="loginForm.email"
            placeholder="郵箱地址"
            type="email"
            clearable
            @keyup.enter="handleLogin"
          >
            <template #prefix>
              <el-icon>
                <message />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!-- 密碼輸入 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="密碼"
            type="password"
            show-password
            clearable
            @keyup.enter="handleLogin"
          >
            <template #prefix>
              <el-icon>
                <lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!-- 登入按鈕 -->
        <el-button
          type="primary"
          size="large"
          :loading="authStore.isLoading"
          @click="handleLogin"
          style="width: 100%"
        >
          {{ authStore.isLoading ? '登入中...' : '登入' }}
        </el-button>
      </el-form>

      <!-- 演示賬戶提示 -->
      <div class="demo-accounts">
        <p class="title">演示賬戶</p>
        <div class="account-item">
          <span>管理員: </span>
          <code>admin@example.com / admin123456</code>
        </div>
        <div class="account-item">
          <span>編輯者: </span>
          <code>editor@example.com / editor123456</code>
        </div>
        <div class="account-item">
          <span>查看者: </span>
          <code>viewer@example.com / viewer123456</code>
        </div>
      </div>
    </div>

    <!-- 背景裝飾 -->
    <div class="background-decoration"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance } from 'element-plus'
import { Message, Lock } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { createFormRules } from '@/utils/validator'

const router = useRouter()
const authStore = useAuthStore()

const formRef = ref<FormInstance>()

// 登入表單
const loginForm = reactive({
  email: '',
  password: '',
})

// 表單規則
const rules = {
  email: createFormRules().email,
  password: createFormRules().password,
}

// 處理登入
const handleLogin = async () => {
  // 表單驗證
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
  } catch {
    return
  }

  try {
    // 調用登入 API
    await authStore.login({
      email: loginForm.email,
      password: loginForm.password,
    })

    ElMessage.success('登入成功')

    // 重定向到 dashboard
    router.push('/dashboard')
  } catch (error: any) {
    ElMessage.error(error.message || '登入失敗，請檢查郵箱和密碼')
    console.error('Login error:', error)
  }
}
</script>

<style scoped lang="scss">

.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.login-container {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 400px;
  padding: $spacing-2xl;
  background-color: #fff;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-lg;

  .login-header {
    text-align: center;
    margin-bottom: $spacing-2xl;

    h1 {
      font-size: 32px;
      color: #667eea;
      margin-bottom: $spacing-sm;
    }

    p {
      font-size: 14px;
      color: $text-secondary;
    }
  }

  :deep(.el-form) {
    margin-bottom: $spacing-lg;

    .el-form-item {
      margin-bottom: $spacing-lg;
    }

    .el-input {
      height: 40px;

      .el-input__inner {
        border-radius: $border-radius;
      }
    }
  }

  .demo-accounts {
    margin-top: $spacing-2xl;
    padding: $spacing-lg;
    background-color: #f5f7fa;
    border-radius: $border-radius;
    border-left: 4px solid #667eea;

    .title {
      font-size: 12px;
      font-weight: 600;
      color: $text-primary;
      margin-bottom: $spacing-md;
      text-transform: uppercase;
    }

    .account-item {
      font-size: 12px;
      color: $text-secondary;
      margin-bottom: $spacing-sm;
      line-height: 1.6;

      &:last-child {
        margin-bottom: 0;
      }

      code {
        display: block;
        background-color: #fff;
        padding: $spacing-sm;
        border-radius: $border-radius;
        color: #667eea;
        font-family: 'Courier New', monospace;
        user-select: all;
        margin-top: 4px;
      }

      span {
        color: $text-primary;
        font-weight: 600;
      }
    }
  }
}

.background-decoration {
  position: absolute;
  top: -50%;
  right: -10%;
  width: 500px;
  height: 500px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  z-index: 1;
}

/* 響應式設計 */
@media (max-width: 600px) {
  .login-container {
    max-width: 90%;
    padding: $spacing-lg;

    .login-header {
      h1 {
        font-size: 24px;
      }
    }

    .demo-accounts {
      margin-top: $spacing-lg;
      padding: $spacing-md;

      .account-item {
        code {
          padding: 6px 8px;
        }
      }
    }
  }
}
</style>

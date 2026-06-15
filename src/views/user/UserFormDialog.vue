<template>
  <el-dialog
    v-model="isVisible"
    :title="user ? '編輯用戶' : '新增用戶'"
    width="500px"
    @close="resetForm"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
    >
      <!-- 用戶名 -->
      <el-form-item label="用戶名" prop="username">
        <el-input
          v-model="formData.username"
          placeholder="請輸入用戶名"
          :disabled="!!user"
        />
      </el-form-item>

      <!-- 郵箱 -->
      <el-form-item label="郵箱" prop="email">
        <el-input
          v-model="formData.email"
          placeholder="請輸入郵箱地址"
          type="email"
          :disabled="!!user"
        />
      </el-form-item>

      <!-- 密碼 -->
      <el-form-item label="密碼" prop="password">
        <el-input
          v-model="formData.password"
          placeholder="請輸入密碼"
          type="password"
          show-password
        />
      </el-form-item>

      <!-- 角色 -->
      <el-form-item label="角色" prop="role">
        <el-select v-model="formData.role" placeholder="請選擇角色">
          <el-option label="管理員" value="admin" />
          <el-option label="編輯者" value="editor" />
          <el-option label="查看者" value="viewer" />
        </el-select>
      </el-form-item>

      <!-- 狀態 -->
      <el-form-item label="狀態" prop="status">
        <el-select v-model="formData.status" placeholder="請選擇狀態">
          <el-option label="活躍" value="active" />
          <el-option label="禁用" value="inactive" />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="isVisible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">
        {{ loading ? '提交中...' : '提交' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { userAPI } from '@/api/modules/user'
import { createFormRules } from '@/utils/validator'
import type { User } from '@/api/types'

const props = defineProps<{
  modelValue: boolean
  user?: User.Item | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: []
}>()

const formRef = ref<FormInstance>()
const loading = ref(false)

// 表單數據
const formData = reactive<{
  username: string
  email: string
  password: string
  role: User.Item['role']
  status: User.Item['status']
}>({
  username: '',
  email: '',
  password: '',
  role: 'viewer',
  status: 'active',
})

// 表單規則
const baseRules = createFormRules()
const rules = reactive({
  username: baseRules.username,
  email: baseRules.email,
  password: [
    {
      required: !props.user,
      message: '密碼不能為空',
      trigger: 'blur',
    },
    ...(baseRules.password || []),
  ],
  role: [{ required: true, message: '角色不能為空', trigger: 'change' }],
  status: [{ required: true, message: '狀態不能為空', trigger: 'change' }],
})

// 對話框可見性
const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// 監聽 user prop，初始化表單
watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      formData.username = newUser.username
      formData.email = newUser.email
      formData.role = newUser.role
      formData.status = newUser.status
      formData.password = ''
    }
  },
  { immediate: true }
)

// 重置表單
const resetForm = () => {
  formRef.value?.resetFields()
  formData.username = ''
  formData.email = ''
  formData.password = ''
  formData.role = 'viewer'
  formData.status = 'active'
}

// 提交表單
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
  } catch {
    return
  }

  loading.value = true
  try {
    if (props.user) {
      // 編輯用戶
      const updateData: User.UpdateRequest = {
        username: formData.username,
        email: formData.email,
        role: formData.role,
        status: formData.status,
      }
      
      if (formData.password) {
        updateData.password = formData.password
      }

      await userAPI.update(props.user.id, updateData)
      ElMessage.success('編輯成功')
    } else {
      // 新增用戶
      await userAPI.create({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      })
      ElMessage.success('新增成功')
    }

    isVisible.value = false
    emit('submit')
  } catch (error: any) {
    ElMessage.error(error.message || '操作失敗')
    console.error('Form submit error:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
:deep(.el-form) {
  .el-form-item {
    margin-bottom: 16px;
  }

  .el-select,
  .el-input {
    width: 100%;
  }
}
</style>

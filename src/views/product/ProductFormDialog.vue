<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '編輯商品' : '新增商品'"
    width="560px"
    :close-on-click-modal="false"
    draggable
    @closed="handleClosed"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="90px"
      style="padding-right: 20px"
    >
      <el-form-item label="商品名稱" prop="name">
        <el-input v-model="form.name" placeholder="請輸入商品名稱" maxlength="50" show-word-limit />
      </el-form-item>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="分類" prop="category">
            <el-select v-model="form.category" placeholder="選擇分類" style="width: 100%">
              <el-option v-for="cat in categories" :key="cat" :label="cat" :value="cat" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上架狀態" prop="status">
            <el-select v-model="form.status" style="width: 100%">
              <el-option label="上架" value="active" />
              <el-option label="下架" value="inactive" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="售價" prop="price">
            <el-input-number
              v-model="form.price"
              :min="0"
              :precision="2"
              :step="100"
              controls-position="right"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="庫存" prop="stock">
            <el-input-number
              v-model="form.stock"
              :min="0"
              :step="10"
              controls-position="right"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="商品描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="請輸入商品描述（可選）"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">
        {{ isEdit ? '儲存' : '新增' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { productAPI } from '@/api/modules/product'
import type { Product } from '@/api/types'

const props = defineProps<{
  modelValue: boolean
  product: Product.Item | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': []
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const isEdit = computed(() => !!props.product?.id)

const categories = ['3C電子', '服飾', '食品', '家居', '書籍', '運動', '其他']

const formRef = ref<FormInstance>()
const submitting = ref(false)

interface FormState {
  name: string
  category: string
  price: number
  stock: number
  status: 'active' | 'inactive'
  description: string
}

const form = reactive<FormState>({
  name: '',
  category: '',
  price: 0,
  stock: 0,
  status: 'active',
  description: '',
})

const rules: FormRules = {
  name: [
    { required: true, message: '請輸入商品名稱', trigger: 'blur' },
    { min: 2, max: 50, message: '名稱長度 2-50 字元', trigger: 'blur' },
  ],
  category: [{ required: true, message: '請選擇商品分類', trigger: 'change' }],
  price: [{ required: true, type: 'number', min: 0, message: '請輸入有效售價', trigger: 'blur' }],
  stock: [{ required: true, type: 'number', min: 0, message: '請輸入有效庫存', trigger: 'blur' }],
}

// ✅ resetForm 必須在 watch 之前定義，避免 immediate 觸發時 TDZ 錯誤
const resetForm = () => {
  Object.assign(form, {
    name: '',
    category: '',
    price: 0,
    stock: 0,
    status: 'active',
    description: '',
  })
}

// 當打開 dialog 時，填入編輯資料
watch(
  () => props.product,
  (product) => {
    if (product) {
      Object.assign(form, {
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        status: product.status,
        description: product.description || '',
      })
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

const handleSubmit = async () => {
  if (!await formRef.value?.validate().catch(() => false)) return

  submitting.value = true
  try {
    if (isEdit.value && props.product) {
      await productAPI.update(props.product.id, {
        name: form.name,
        category: form.category,
        price: form.price,
        stock: form.stock,
        status: form.status,
        description: form.description,
      })
      ElMessage.success('商品更新成功')
    } else {
      await productAPI.create({
        name: form.name,
        category: form.category,
        price: form.price,
        stock: form.stock,
        description: form.description,
      })
      ElMessage.success('商品新增成功')
    }
    visible.value = false
    emit('submit')
  } catch {
    // 錯誤訊息由 request.ts 統一處理
  } finally {
    submitting.value = false
  }
}

const handleClosed = () => {
  formRef.value?.clearValidate()
  resetForm()
}
</script>

import { createApp } from 'vue'
import '@/styles/tailwind.css'       // 1. Tailwind utilities（最先，讓後續可覆蓋 Preflight）
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css' // 2. Element Plus
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@/styles/base.scss'          // 3. 專案基礎樣式（最後，優先度最高）

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

// 全局錯誤處理
app.config.errorHandler = (err, instance, info) => {
  console.error(`Error: ${info}`, err)
}

// 全局警告處理
app.config.warnHandler = (msg) => {
  console.warn(msg)
}

app.mount('#app')

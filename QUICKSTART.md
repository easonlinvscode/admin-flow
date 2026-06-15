# AdminFlow 快速啟動指南

## 📦 第一步：安裝依賴

```bash
cd admin-flow
cp .env.example .env
npm install
```

如果 npm 安裝較慢，可以使用淘寶 npm 源：

```bash
npm config set registry https://registry.npmmirror.com
npm install
```

## 🚀 第二步：啟動開發服務器

```bash
npm run dev
```

你會看到如下輸出：

```
VITE v5.0.0  ready in 234 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

在瀏覽器中打開 `http://localhost:5173/`

## 🔐 第三步：登入應用

將自動重定向到登入頁面，使用以下演示賬戶之一：

### 演示賬戶

| 角色 | 郵箱 | 密碼 |
|------|------|------|
| 👨‍💼 管理員 | admin@example.com | admin123456 |
| ✏️ 編輯者 | editor@example.com | editor123456 |
| 👁️ 查看者 | viewer@example.com | viewer123456 |

複製郵箱和密碼到登入表單即可。

## 📊 第四步：探索功能

登入後，你可以：

1. **查看 Dashboard**
   - 統計數據卡片
   - 訂單趨勢和銷售統計
   - 最近訂單列表

2. **用戶管理**
   - 查看用戶列表
   - 新增、編輯、刪除用戶
   - 按名稱、角色搜尋

3. **商品管理**
   - 查看商品列表
   - 按狀態、分類篩選
   - 刪除商品

4. **訂單管理**
   - 查看訂單列表
   - 按狀態篩選
   - 查看訂單詳情

5. **角色權限**
   - 查看角色定義
   - 了解每個角色的權限

6. **測試權限**
   - 登出並用不同角色登入
   - 觀察可訪問的頁面變化

## 🔍 第五步：查看代碼結構

```
src/
├── api/              # ← API 層，按功能分模塊
│   ├── request.ts    # ← Axios 配置和攔截器
│   └── types.ts      # ← TypeScript 類型定義
│
├── stores/           # ← Pinia 狀態管理
│   └── auth.ts       # ← 認證狀態
│
├── router/           # ← 路由配置
│   └── index.ts      # ← 路由定義和守衛
│
├── views/            # ← 頁面組件
│   ├── login/        # ← 登入頁面
│   ├── dashboard/    # ← Dashboard
│   └── ...           # ← 其他頁面
│
├── utils/            # ← 工具函數
│   ├── storage.ts    # ← Token 管理
│   ├── validator.ts  # ← 表單驗證
│   └── constants.ts  # ← 應用常量
│
└── styles/           # ← SCSS 樣式
    ├── variables.scss # ← 色彩和尺寸變量
    └── base.scss     # ← 基礎樣式
```

## 💡 重點代碼位置

### 核心 1: Token 管理
```
src/api/request.ts
→ 自動刷新機制
→ 請求/響應攔截器
```

### 核心 2: 路由守衛
```
src/router/index.ts
→ 登入檢查
→ 權限驗證
```

### 核心 3: 認證 Store
```
src/stores/auth.ts
→ 登入/登出邏輯
→ 權限檢查方法
```

### 核心 4: API 分層
```
src/api/modules/*.ts
→ 清晰的 API 組織
→ 完整的 TypeScript 類型
```

## 🧪 測試常見場景

### 場景 1: 測試自動登出
1. 以任何角色登入
2. 打開瀏覽器開發者工具 (F12)
3. 進入 Application → Session Storage
4. 刪除 `accessToken`
5. 刷新頁面 → 自動跳轉到登入頁

### 場景 2: 測試權限控制
1. 以 `viewer` 角色登入
2. 注意菜單中沒有「角色權限」項
3. 嘗試直接訪問 `/roles` → 跳轉到 403 頁面
4. 用 `admin` 角色重新登入 → 現在可以訪問

### 場景 3: 測試表單驗證
1. 進入用戶管理 → 新增用戶
2. 嘗試提交空表單 → 看到驗證錯誤提示
3. 輸入無效的郵箱 → 看到郵箱驗證失敗
4. 輸入少於 8 個字符的密碼 → 看到密碼驗證失敗

### 場景 4: 觀察 API 調用
1. 打開瀏覽器開發者工具 Network 標籤
2. 進行任何操作（登入、搜尋、分頁）
3. 查看 HTTP 請求和響應
4. 注意 Authorization Header 中的 Bearer Token

## 📝 開發建議

### 添加新頁面
1. 在 `src/views/` 中創建新文件夾
2. 創建 `[Page]List.vue` 頁面
3. 在 `src/router/index.ts` 中註冊路由

### 修改 API 地址
編輯根目錄 `.env` 文件：
```bash
VITE_API_BASE_URL=http://your-api-server:3000/api
```

### 自定義主題色
編輯 `src/styles/variables.scss`：
```scss
$primary-color: #409eff;  // 修改此值
```

### 查看類型定義
打開 `src/api/types.ts`，了解所有 API 的數據結構。

## 🐛 常見問題

### Q: 頁面不顯示，控制台有錯誤
A: 
1. 確保 Node.js 版本 ≥ 16
2. 刪除 `node_modules` 和 `package-lock.json`
3. 重新安裝: `npm install`

### Q: API 請求失敗 (404 或 CORS 錯誤)
A:
1. 檢查 `.env` 中的 `VITE_API_BASE_URL`
2. 確保後端 API 服務器正在運行
3. 如果是 CORS 問題，需要後端配置 CORS 頭

### Q: 登入失敗
A:
1. 確認郵箱和密碼完全正確（複製粘貼不要手打）
2. 檢查後端 API 是否正在運行
3. 查看瀏覽器 Network 標籤中的錯誤響應

### Q: 刷新頁面後登入狀態丟失
A:
1. 檢查瀏覽器是否允許存儲 Cookie/Storage
2. 嘗試在無痕/隱私模式下登入
3. 清除瀏覽器緩存後重試

## 🎯 面試演示流程

### 第 1 步：登入演示 (2 分鐘)
1. 打開應用，進入登入頁
2. 展示演示賬戶信息
3. 用不同角色登入，說明權限差異

### 第 2 步：功能演示 (3 分鐘)
1. 查看 Dashboard 統計數據
2. 進入用戶管理進行 CRUD 操作
3. 演示搜尋和分頁功能
4. 展示表單驗證

### 第 3 步：代碼講解 (5 分鐘)
1. 打開 IDE，展示項目結構
2. 講解 Token 自動刷新機制
3. 展示路由守衛的權限檢查
4. 說明 API 層的分離設計

### 第 4 步：技術問答 (隨時)
準備好回答關於：
- Token 安全性和存儲方式
- RBAC 權限控制實現
- Pinia 狀態管理設計
- TypeScript 類型安全的優勢
- 響應式設計的實現

## 📱 移動端測試

按 F12 打開開發者工具，按 Ctrl+Shift+M 切換到移動設備模式。

應用已經過響應式設計，在手機上也能正常使用。

## 🔗 有用的鏈接

- [Vue 3 官方文檔](https://vuejs.org/)
- [Vite 文檔](https://vitejs.dev/)
- [Pinia 文檔](https://pinia.vuejs.org/)
- [Element Plus 文檔](https://element-plus.org/)
- [TypeScript 手冊](https://www.typescriptlang.org/docs/)

## ✅ 開發檢查清單

- [ ] 能夠成功安裝依賴
- [ ] 開發服務器能正常啟動
- [ ] 能用演示賬戶成功登入
- [ ] Dashboard 能正常顯示
- [ ] 用戶列表能加載數據
- [ ] 搜尋功能能正常工作
- [ ] 表單驗證能正常提示
- [ ] 登出功能能正常工作
- [ ] 刷新頁面後登入狀態保持
- [ ] 不同角色看到的菜單不同

全部檢查通過後，祝你面試成功！ 🎉

---

**需要幫助?** 查看完整的 README.md 了解更多信息。

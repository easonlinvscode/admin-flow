# AdminFlow - 後台管理系統

![License](https://img.shields.io/badge/license-MIT-green)
![Vue](https://img.shields.io/badge/Vue-3.4-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Pinia](https://img.shields.io/badge/Pinia-2.1-blue)

一個基於 Vue 3 + Vite + TypeScript 的企業級後台管理系統示例項目。完整展示現代化前端開發的最佳實踐。

## 📸 功能預覽

- ✅ **完整的認證授權流程** - JWT Token 管理、自動刷新
- ✅ **基於角色的權限控制** - Admin/Editor/Viewer 三種角色
- ✅ **動態菜單生成** - 根據用戶角色自動生成菜單
- ✅ **完整的 CRUD 功能** - 用戶、商品、訂單、角色管理
- ✅ **響應式設計** - 支持移動設備
- ✅ **數據分頁排序** - 完整的表格功能
- ✅ **表單驗證** - 前端實時驗證
- ✅ **Dashboard 統計** - 數據統計卡片
- ✅ **API 分層架構** - 清晰的代碼組織
- ✅ **TypeScript 支持** - 完整的類型定義

## 🚀 快速開始

### 環境要求

- Node.js 16+
- npm 8+ 或 yarn

### 安裝依賴

```bash
# 進入項目目錄
cd admin-flow

# 複製環境配置
cp .env.example .env

# 安裝依賴
npm install
```

### 開發環境啟動

```bash
npm run dev
```

開發服務器將在 `http://localhost:5173` 啟動

### 生產構建

```bash
npm run build
```

### 預覽生產構建

```bash
npm run preview
```

## 📝 登入演示

系統提供三種角色的演示賬戶，方便測試不同權限級別：

| 角色 | 郵箱 | 密碼 | 權限 |
|------|------|------|------|
| 管理員 | admin@example.com | admin123456 | 完全控制 |
| 編輯者 | editor@example.com | editor123456 | 編輯數據 |
| 查看者 | viewer@example.com | viewer123456 | 僅查看 |

## 🏗️ 項目結構

```
admin-flow/
├── src/
│   ├── api/                  # API 層 - 分模塊管理
│   │   ├── modules/          # API 模塊
│   │   │   ├── auth.ts       # 認證 API
│   │   │   ├── user.ts       # 用戶 API
│   │   │   ├── product.ts    # 商品 API
│   │   │   └── order.ts      # 訂單 API
│   │   ├── request.ts        # Axios 實例配置
│   │   └── types.ts          # API 類型定義
│   │
│   ├── stores/               # Pinia 狀態管理
│   │   └── auth.ts           # 認證 Store
│   │
│   ├── router/               # 路由配置
│   │   └── index.ts          # 路由定義與守衛
│   │
│   ├── components/           # 可複用組件
│   │   └── ...               # 組件文件
│   │
│   ├── views/                # 頁面組件
│   │   ├── login/            # 登入頁面
│   │   ├── dashboard/        # 儀表板
│   │   ├── user/             # 用戶管理
│   │   ├── product/          # 商品管理
│   │   ├── order/            # 訂單管理
│   │   ├── role/             # 角色管理
│   │   └── error/            # 錯誤頁面
│   │
│   ├── utils/                # 工具函數
│   │   ├── storage.ts        # Token 存儲
│   │   ├── validator.ts      # 驗證規則
│   │   └── constants.ts      # 常量定義
│   │
│   ├── styles/               # 全局樣式
│   │   ├── variables.scss    # SCSS 變量
│   │   └── base.scss         # 基礎樣式
│   │
│   ├── layouts/              # 佈局組件
│   │   └── MainLayout.vue    # 主佈局
│   │
│   ├── App.vue               # 根組件
│   └── main.ts               # 應用入口
│
├── index.html                # HTML 入口
├── vite.config.ts            # Vite 配置
├── tsconfig.json             # TypeScript 配置
├── package.json              # 項目依賴
├── .env.example              # 環境變量示例
├── .gitignore                # Git 忽略規則
└── README.md                 # 項目說明
```

## 🔑 核心功能詳解

### 1. 認證系統

- **Token 管理**: accessToken（sessionStorage）+ refreshToken（localStorage）
- **自動刷新**: accessToken 過期時自動使用 refreshToken 刷新
- **會話保持**: 用戶刷新頁面時自動恢復登入狀態

```typescript
// src/api/request.ts 中的自動刷新邏輯
// 當收到 401 響應時，自動刷新 token 並重試原請求
```

### 2. 路由權限控制

- **路由守衛**: 檢查用戶是否已登入和是否有權訪問頁面
- **動態菜單**: 根據用戶角色生成可訪問的菜單項
- **權限驗證**: 路由層和 API 層雙重驗證

```typescript
// src/router/index.ts
// 完整的路由守衛實現，包括登入檢查和權限檢查
```

### 3. 狀態管理

使用 Pinia 進行集中式狀態管理：

```typescript
// src/stores/auth.ts
// 管理用戶認證狀態
// 提供 hasRole() 和 hasPermission() 檢查方法
```

### 4. API 分層

```typescript
// src/api/request.ts - 統一的 Axios 配置
// src/api/modules/*.ts - 按功能分塊的 API 方法
// src/api/types.ts - 完整的 TypeScript 類型定義
```

### 5. 表單驗證

```typescript
// src/utils/validator.ts
// 提供常用的驗證規則（郵箱、密碼、手機號等）
// 可直接用於 Element Plus 表單驗證
```

## 🛠️ 技術棧

| 技術 | 版本 | 說明 |
|------|------|------|
| Vue | 3.4 | 漸進式 JavaScript 框架 |
| Vite | 5.0 | 下一代前端構建工具 |
| TypeScript | 5.3 | JavaScript 超集，提供類型安全 |
| Pinia | 2.1 | Vue 3 官方狀態管理 |
| Vue Router | 4.2 | Vue 官方路由庫 |
| Axios | 1.6 | HTTP 客户端 |
| Element Plus | 2.4 | Vue 3 UI 組件庫 |
| ECharts | 5.4 | 數據可視化圖表庫 |
| SCSS | - | CSS 預處理器 |

## 📚 API 文檔

### 認證 API

```typescript
// 登入
POST /api/auth/login
{ email: string, password: string }

// 刷新 Token
POST /api/auth/refresh-token
{ refreshToken: string }

// 獲取用戶信息
GET /api/auth/profile
```

### 用戶管理 API

```typescript
GET /api/users                    // 獲取用戶列表
GET /api/users/:id                // 獲取用戶詳情
POST /api/users                   // 創建用戶
PUT /api/users/:id                // 更新用戶
DELETE /api/users/:id             // 刪除用戶
POST /api/users/batch-delete      // 批量刪除
```

## 🔒 安全考慮

1. **Token 存儲**
   - accessToken 存儲在 sessionStorage（瀏覽器關閉自動清除）
   - refreshToken 存儲在 localStorage（持久化，但應該用 HttpOnly Cookie）
   - 避免在 URL 或 LocalStorage 明文存儲敏感信息

2. **HTTP 安全**
   - 所有 API 請求使用 HTTPS
   - 在 Header 中傳遞 Authorization token
   - 實現 CSRF 保護（後端）

3. **權限檢查**
   - 路由層守衛防止未授權訪問
   - API 層驗證確保後端安全
   - 按鈕級別權限控制提升用戶體驗

## 🧪 開發建議

### 添加新的 API 模塊

1. 在 `src/api/types.ts` 中定義類型
2. 在 `src/api/modules/` 中創建 API 文件
3. 在相應的 Store 中調用 API

### 創建新的頁面

1. 在 `src/views/` 中創建對應的文件夾
2. 創建頁面主組件
3. 在 `src/router/index.ts` 中註冊路由

### 添加新的狀態管理

1. 在 `src/stores/` 中創建新的 Store
2. 使用 `defineStore` 定義狀態和方法
3. 在組件中使用 `useXxxStore()` 引入

## 🚢 部署

### 構建生產版本

```bash
npm run build
```

### 環境配置

修改 `.env` 文件中的 `VITE_API_BASE_URL` 為生產環境的 API 地址

### 服務器部署

1. 將 `dist/` 目錄下的文件上傳到服務器
2. 配置 Web 服務器（Nginx/Apache）以支持 SPA 路由
3. 配置 HTTPS 和安全頭

## 📄 License

MIT

## 👨‍💻 作者

[Your Name] - 前端開發者

## 📧 聯繫方式

- Email: your.email@example.com
- GitHub: [@yourname](https://github.com/yourname)
- 個人網站: https://your-website.com

## 🙏 致謝

感謝所有開源項目的貢獻者，包括 Vue、Vite、Element Plus 等。

---

## 常見問題

### Q: 如何修改 API 地址？

A: 修改項目根目錄下的 `.env` 文件，更改 `VITE_API_BASE_URL` 為你的 API 地址。

### Q: 如何自定義主題色？

A: 修改 `src/styles/variables.scss` 中的色彩變量。

### Q: 如何添加新的角色？

A: 修改 `src/utils/constants.ts` 中的 `ROLE_PERMISSIONS` 和相關常量。

### Q: 如何實現國際化？

A: 可以使用 `vue-i18n` 庫，在 `src/plugins/` 中創建 i18n 配置。

---

**最後更新**: 2024 年 4 月

**項目狀態**: ✨ 持續維護中

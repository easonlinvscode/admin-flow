/**
 * 常用驗證規則
 */

export const validators = {
  /**
   * 郵箱驗證
   */
  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value) || '請輸入有效的郵箱地址'
  },

  /**
   * 密碼驗證（最少 8 個字符）
   */
  password: (value: string) => {
    return value.length >= 8 || '密碼至少需要 8 個字符'
  },

  /**
   * 用戶名驗證（3-20 個字符）
   */
  username: (value: string) => {
    return (value.length >= 3 && value.length <= 20) || '用戶名長度應為 3-20 個字符'
  },

  /**
   * 手機號驗證
   */
  phone: (value: string) => {
    const phoneRegex = /^1[3-9]\d{9}$/
    return phoneRegex.test(value) || '請輸入有效的手機號'
  },

  /**
   * 正整數驗證
   */
  positiveInteger: (value: number | string) => {
    const num = Number(value)
    return num > 0 && Number.isInteger(num) || '請輸入正整數'
  },

  /**
   * URL 驗證
   */
  url: (value: string) => {
    try {
      new URL(value)
      return true
    } catch {
      return '請輸入有效的 URL'
    }
  },
}

/**
 * 創建 Element Plus 表單驗證規則
 */
export function createFormRules() {
  return {
    email: [
      { required: true, message: '郵箱不能為空', trigger: 'blur' },
      {
        validator: (_rule: any, value: string, callback: any) => {
          const result = validators.email(value)
          if (result === true) {
            callback()
          } else {
            callback(new Error(result))
          }
        },
        trigger: 'blur',
      },
    ],
    password: [
      { required: true, message: '密碼不能為空', trigger: 'blur' },
      {
        validator: (_rule: any, value: string, callback: any) => {
          const result = validators.password(value)
          if (result === true) {
            callback()
          } else {
            callback(new Error(result))
          }
        },
        trigger: 'blur',
      },
    ],
    username: [
      { required: true, message: '用戶名不能為空', trigger: 'blur' },
      {
        validator: (_rule: any, value: string, callback: any) => {
          const result = validators.username(value)
          if (result === true) {
            callback()
          } else {
            callback(new Error(result))
          }
        },
        trigger: 'blur',
      },
    ],
    phone: [
      { required: true, message: '手機號不能為空', trigger: 'blur' },
      {
        validator: (_rule: any, value: string, callback: any) => {
          const result = validators.phone(value)
          if (result === true) {
            callback()
          } else {
            callback(new Error(result))
          }
        },
        trigger: 'blur',
      },
    ],
  }
}

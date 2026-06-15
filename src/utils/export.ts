/**
 * CSV 匯出工具
 * 將資料陣列匯出為 UTF-8 BOM 編碼的 CSV 檔案
 * （BOM 確保 Excel 能正確顯示中文）
 */

export interface ColumnConfig<T> {
  /** 資料欄位 key */
  key: keyof T
  /** CSV 標題名稱 */
  label: string
  /** 自訂格式化函數（可選） */
  formatter?: (value: any, row: T) => string
}

/**
 * 匯出資料為 CSV 檔案
 * @param data - 資料陣列
 * @param columns - 欄位配置
 * @param filename - 檔案名稱（不含副檔名）
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  columns: ColumnConfig<T>[],
  filename = 'export'
): void {
  // 建立標題行
  const headers = columns.map(col => escapeCSVField(col.label))

  // 建立資料行
  const rows = data.map(row =>
    columns.map(col => {
      const rawValue = row[col.key as string]
      const value = col.formatter ? col.formatter(rawValue, row) : rawValue
      return escapeCSVField(value ?? '')
    })
  )

  // 組合 CSV 內容
  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\r\n')

  // UTF-8 BOM（讓 Excel 正確識別編碼）
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' })

  // 觸發下載
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}_${formatDate(new Date())}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * 跳脫 CSV 欄位中的特殊字元
 * 若包含逗號、換行或雙引號，則用雙引號包住，並跳脫內部雙引號
 */
function escapeCSVField(value: any): string {
  const str = String(value)
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

/**
 * 格式化日期為 YYYYMMDD
 */
function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}${m}${d}`
}

export interface SkuData {
  sku: string
  productName: string
  salesData: {
    [key: string]: {
      amount: number
      qty: number
      avgSellingPrice: string
    }
  }
  refundRate: number | null
}

export interface TableState {
  tableData: SkuData[]
  totalItems: number
  currentPage: number
  selectedColumns: string[]
  cachedData: SkuData[][]
  apiPage: number
}

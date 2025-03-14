/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../../api'
import { Store } from 'vuex'
import type { SkuData, TableState } from '../../types/table'

const state: TableState = {
  tableData: [],
  totalItems: 0,
  currentPage: 1,
  selectedColumns: [],
  cachedData: [],
  apiPage: 1,
}

const mutations = {
  SET_TABLE_DATA(state: TableState, payload: { data: SkuData[]; total: number }) {
    state.cachedData[state.apiPage - 1] = payload.data
    const localPageIndex = (state.currentPage - 1) % 3
    const start = localPageIndex * 10
    const end = start + 10
    state.tableData = payload.data.slice(start, end)
    state.totalItems = payload.total
  },
  SET_CURRENT_PAGE(state: TableState, page: number) {
    state.currentPage = page

    const apiPageIndex = Math.ceil(page / 3) - 1
    if (state.cachedData[apiPageIndex]) {
      const localPageIndex = (page - 1) % 3
      const start = localPageIndex * 10
      const end = start + 10
      state.tableData = state.cachedData[apiPageIndex].slice(start, end)
    }
  },
  SET_API_PAGE(state: TableState, page: number) {
    state.apiPage = page
  },
  SET_SELECTED_COLUMNS(state: TableState, columns: string[]) {
    state.selectedColumns = columns
  },
  CLEAR_TABLE_DATA(state: TableState) {
    state.tableData = []
    state.totalItems = 0
    state.currentPage = 1
    state.cachedData = []
    state.apiPage = 1
  },
}

type AugmentedActionContext = {
  commit: Store<any>['commit']
  state: TableState
  rootState: any
  dispatch: Store<any>['dispatch']
}

const actions = {
  async fetchTableData(
    { rootState, state, dispatch }: AugmentedActionContext,
    selectedColumns?: string[],
  ) {
    const marketplace: string = rootState.auth?.marketplaceName
    const sellerId: string = rootState.auth?.storeId
    const token: string = rootState.auth.token

    if (!marketplace || !sellerId) return

    const columnsToUse = selectedColumns || state.selectedColumns

    if (columnsToUse.length === 0) return

    try {
      const body = {
        isDaysCompare: columnsToUse.length > 1 ? 1 : 0,
        marketplace,
        pageNumber: state.currentPage,
        pageSize: 30,
        salesDate: columnsToUse[0],
        salesDate2: columnsToUse[1] || '',
        sellerId,
      }

      const response = await api.post('/data/daily-sales-sku-list', body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const itemData = response.data.Data.item
      if (!itemData || !itemData.skuList) return

      const skuList: SkuData[] = itemData.skuList.map((sku: any) => ({
        sku: sku.sku,
        productName: sku.productName,
        salesData: {
          [columnsToUse[0]]: {
            amount: sku.amount,
            qty: sku.qty,
            avgSellingPrice: sku.qty > 0 ? (sku.amount / sku.qty).toFixed(2) : '0.00',
          },
        },
        refundRate: null,
      }))

      if (columnsToUse.length > 1) {
        itemData.skuList.forEach((sku: any) => {
          const existingSku = skuList.find((item: any) => item.sku === sku.sku)
          if (existingSku) {
            existingSku.salesData[columnsToUse[1]] = {
              amount: sku.amount2,
              qty: sku.qty2,
              avgSellingPrice: sku.qty2 > 0 ? (sku.amount2 / sku.qty2).toFixed(2) : '0.00',
            }
          }
        })
      }

      await dispatch('fetchRefundRates', { skuList, marketplace, sellerId, token })
    } catch (error) {
      console.error('❌ Tablo verisi çekilemedi:', error)
    }
  },

  async fetchRefundRates(
    { commit, rootState }: AugmentedActionContext,
    {
      skuList,
      marketplace,
      sellerId,
      token,
    }: { skuList: SkuData[]; marketplace: string; sellerId: string; token: string },
  ) {
    try {
      const body = {
        marketplace,
        sellerId,
        skuList: skuList.map((sku) => sku.sku),
        requestedDay: rootState.chart.selectedDay,
      }

      const response = await api.post('/data/get-sku-refund-rate', body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      response.data.Data.forEach((refundData: any) => {
        const skuItem = skuList.find((item) => item.sku === refundData.sku)
        if (skuItem) {
          skuItem.refundRate = refundData.refundRate
        }
      })

      commit('SET_TABLE_DATA', { data: skuList, total: skuList.length })
    } catch (error) {
      console.error('❌ Refund Rate verisi çekilemedi:', error)
    }
  },

  async setPage({ commit, state, dispatch }: AugmentedActionContext, page: number) {
    const newApiPage = Math.ceil(page / 3)

    if (newApiPage !== state.apiPage && !state.cachedData[newApiPage - 1]) {
      commit('SET_API_PAGE', newApiPage)
      await dispatch('fetchTableData')
    }

    commit('SET_CURRENT_PAGE', page)
  },
}

const tableModule = {
  namespaced: true,
  state,
  mutations,
  actions,
}

export default tableModule

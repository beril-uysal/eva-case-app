/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../../api'
import { Store } from 'vuex'

interface ChartState {
  salesData: object | null
  selectedDay: number
}

const state: ChartState = {
  salesData: {},
  selectedDay: 30,
}

const mutations = {
  SET_CHART_DATA(state: ChartState, data: any[]) {
    state.salesData = data
  },
  SET_SELECTED_DAY(state: ChartState, day: number) {
    state.selectedDay = day
  },
  CLEAR_CHART_DATA(state: ChartState) {
    state.salesData = null
    state.selectedDay = 30
  },
}

const actions = {
  async fetchChartData({
    commit,
    rootState,
    dispatch,
  }: {
    commit: Store<any>['commit']
    rootState: any
    dispatch: Store<any>['dispatch']
  }) {
    if (!rootState.auth.user) {
      await dispatch('auth/fetchUser', null, { root: true })
    }

    const marketplace = rootState.auth?.marketplaceName
    const sellerId = rootState.auth?.storeId
    const day = rootState.chart.selectedDay
    const token = rootState.auth.token

    if (!marketplace || !sellerId) return

    try {
      const response = await api.post(
        '/data/daily-sales-overview',
        {
          customDateData: null,
          day,
          excludeYoYData: true,
          marketplace,
          requestStatus: 0,
          sellerId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      commit('SET_CHART_DATA', response.data.Data)
    } catch (error) {
      console.error('❌ Grafik verisi çekilemedi:', error)
    }
  },
}

const chartModule = {
  namespaced: true,
  state,
  mutations,
  actions,
}

export default chartModule

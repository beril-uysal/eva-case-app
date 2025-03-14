import Vuex from 'vuex'
const { createStore } = Vuex
import authModule from './modules/auth'
import chartModule from './modules/chart'
import tableModule from './modules/table'

const store = createStore({
  modules: {
    auth: authModule,
    chart: chartModule,
    table: tableModule,
  },
})

export default store

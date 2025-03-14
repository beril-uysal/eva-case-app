<template>
  <PageHeader />
  <div class="px-4 py-5">
    <div class="flex items-center justify-end mb-3">
      <DateSelector @change="updateChartData" />
    </div>

    <ChartComponent
      v-if="chartData?.item?.length && !isLoading"
      :chartData="chartData.item"
      :currency="chartData.Currency"
    />

    <div
      v-if="selectedColumns.length > 0 && (!tableData || isTableLoading)"
      class="flex justify-center items-center mt-4"
    >
      <LoaderSpinner class="border-black border-t-transparent w-9 h-9" />
    </div>

    <SalesTable v-else-if="selectedColumns.length > 0 && tableData" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import ChartComponent from '../components/ChartComponent.vue'
import PageHeader from '../components/PageHeader.vue'
import DateSelector from '../components/DateSelector.vue'
import SalesTable from '../components/SalesTable.vue'
import LoaderSpinner from '../components/LoaderSpinner.vue'

export default defineComponent({
  name: 'DashboardPage',
  components: { ChartComponent, PageHeader, DateSelector, SalesTable, LoaderSpinner },
  setup() {
    const store = useStore()
    const user = computed(() => store.state.auth.user)
    const isLoading = ref(false)
    const isTableLoading = ref(false)

    const chartData = computed(() => {
      return store.state.chart.salesData
    })

    const selectedDay = computed({
      get: () => store.state.chart.selectedDay,
      set: (value) => store.commit('chart/SET_SELECTED_DAY', value),
    })

    const tableData = computed(() => store.state.table.tableData)
    const selectedColumns = computed(() => store.state.table.selectedColumns)

    const updateChartData = async () => {
      isLoading.value = true

      try {
        await store.dispatch('chart/fetchChartData')
      } catch (error) {
        console.error('❌ Grafik verisi yüklenirken hata oluştu:', error)
      } finally {
        isLoading.value = false
      }
    }

    watch(selectedDay, () => {
      updateChartData()
    })

    watch(selectedColumns, async (newColumns) => {
      if (newColumns.length > 0) {
        isTableLoading.value = true
        try {
          await store.dispatch('table/fetchTableData', [...newColumns], { root: true })
        } catch (error) {
          console.error('Table verisi yüklenirken hata:', error)
        } finally {
          isTableLoading.value = false
        }
      }
    })

    onMounted(async () => {
      if (!user.value) {
        await store.dispatch('auth/fetchUser')
      }

      await updateChartData()
    })

    return {
      chartData,
      selectedDay,
      updateChartData,
      selectedColumns,
      isLoading,
      isTableLoading,
      tableData,
    }
  },
})
</script>

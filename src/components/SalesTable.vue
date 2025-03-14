<template>
  <div class="p-4">
    <div v-if="isLoading" class="flex justify-center items-center h-20">
      <LoaderSpinner class="text-primary" />
    </div>

    <table v-else class="w-full border-collapse border border-gray-300 overflow-x-auto">
      <thead>
        <tr class="bg-gray-200">
          <th class="border p-2">SKU</th>
          <th class="border p-2">Product Name</th>
          <th v-for="date in selectedColumns" :key="date" class="border p-2">
            {{ date }} <br />
            <span class="text-sm text-gray-500">(Sales / Units, Avg. Selling Price)</span>
          </th>
          <th class="border p-2">
            SKU Refund Rate <br />
            <span class="text-sm text-gray-500">(Last {{ selectedDay }} Days)</span>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in tableData" :key="item.sku" class="text-center">
          <td class="border p-1">{{ item.sku }}</td>
          <td class="border p-1 w-1/3">
            <p class="line-clamp-2">{{ item.productName }}</p>
          </td>

          <td v-for="date in selectedColumns" :key="date" class="border p-1">
            <div class="text-green-600 font-bold">
              {{ formatCurrency(item.salesData[date]?.amount) }} /
              {{ item.salesData[date]?.qty || 0 }}
            </div>
            <div class="text-gray-500">
              {{ formatCurrency(item.salesData[date]?.avgSellingPrice) }}
            </div>
          </td>

          <td class="border p-1">
            {{ item.refundRate ? item.refundRate + '%' : 'N/A' }}
          </td>
        </tr>
      </tbody>
    </table>

    <div class="mt-4 flex justify-center item-center space-x-4">
      <button
        class="p-3 bg-blue-700 rounded-full text-white font-bold"
        :class="{ hidden: currentPage === 1 }"
        @click="changePage(currentPage - 1)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
      <div class="flex items-center justify-center">
        <span class="text-gray-500 font-medium text-base underline leading-none">
          {{ currentPage }}</span
        >
      </div>
      <button
        class="p-3 bg-blue-700 rounded-full text-white font-bold"
        :class="{ hidden: currentPage >= totalPages }"
        @click="changePage(currentPage + 1)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useStore } from 'vuex'
import LoaderSpinner from './LoaderSpinner.vue'

export default defineComponent({
  components: { LoaderSpinner },
  setup() {
    const store = useStore()
    const isLoading = ref(false)

    const tableData = computed(() => store.state.table.tableData)
    const currentPage = computed(() => store.state.table.currentPage)
    const totalItems = computed(() => store.state.table.totalItems)
    const selectedColumns = computed(() => store.state.table.selectedColumns)
    const selectedDay = computed(() => store.state.chart.selectedDay)

    const totalPages = computed(() => Math.ceil(totalItems.value / 10))

    const changePage = async (page: number) => {
      if (page < 1 || page > totalPages.value) return

      isLoading.value = true
      try {
        await store.dispatch('table/setPage', page)
      } catch (error) {
        console.error('Sayfa değiştirme işlemi başarısız oldu:', error)
      } finally {
        isLoading.value = false
      }
    }

    const formatCurrency = (value: number | undefined) => {
      if (!value) return '$0.00'
      return `$${parseFloat(value.toString()).toFixed(2)}`
    }

    return {
      tableData,
      selectedColumns,
      currentPage,
      totalPages,
      changePage,
      isLoading,
      formatCurrency,
      selectedDay,
    }
  },
})
</script>

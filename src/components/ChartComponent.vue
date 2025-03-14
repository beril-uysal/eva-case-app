<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <div>
    <div ref="chartContainer"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed, watch, type PropType } from 'vue'
import Highcharts from 'highcharts'
import type { Options, Point } from 'highcharts'
import type { ChartDataItem } from '../types/chart'
import { useStore } from 'vuex'

export default defineComponent({
  props: {
    chartData: {
      type: Array as PropType<ChartDataItem[]>,
      required: true,
    },
    currency: {
      type: String,
      required: false,
    },
  },

  setup(props) {
    const chartContainer = ref<HTMLElement | null>(null)
    const chart = ref<Highcharts.Chart | null>(null)
    const store = useStore()

    const selectedColumns = computed({
      get: () => store.state.table.selectedColumns,
      set: (value) => {
        store.commit('table/SET_SELECTED_COLUMNS', value)
      },
    })

    const createChartOptions = (): Options => ({
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
        animation: {
          duration: 150,
        },
      },
      title: {
        text: 'Daily Sales',
        align: 'left',
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
        },
      },
      xAxis: {
        categories: props.chartData.map((item) => item.date),
        crosshair: true,
      },
      yAxis: {
        title: { text: `Amount (${props.currency})` },
        min: 0,
      },
      tooltip: {
        useHTML: true,
        formatter: function (this: any) {
          const point = this.point as Point & { category: string }
          const data = props.chartData[this.point.index]
          const totalSales = data.fbaAmount + data.fbmAmount

          return `
            <div style="padding: 8px;">
              <b>${point.category}</b><br/>
              <div style="margin: 5px 0;">
                <span style="color: #666;">Total Sales:</span> ${props.currency} ${totalSales.toFixed(2)}<br/>
                <span style="color: #666;">Shipping:</span> ${props.currency} ${data.fbaShippingAmount.toFixed(2)}<br/>
              </div>
              <div style="margin: 5px 0;">
                <span style="color: #4CAF50;">FBA Sales:</span> ${props.currency} ${data.fbaAmount.toFixed(2)}<br/>
                <span style="color: #FFC107;">FBM Sales:</span> ${props.currency} ${data.fbmAmount.toFixed(2)}<br/>
                <span style="color: #2196F3;">Profit:</span> ${props.currency} ${data.profit.toFixed(2)}
              </div>
            </div>
          `
        },
      },
      legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal',
        itemStyle: {
          color: '#666',
          fontWeight: 'normal',
        },
        symbolHeight: 12,
        symbolWidth: 12,
        symbolRadius: 100,
        itemDistance: 20,
        padding: 12,
        margin: 24,
        itemHoverStyle: {
          cursor: 'default',
        },
        itemMarginBottom: 8,
      },
      plotOptions: {
        column: {
          cursor: 'pointer',
          states: {
            hover: {
              brightness: 0,
              color: undefined,
            },
          },
          point: {
            events: {
              click: function () {
                handleChartClick(this.category as string)
              },
            },
          },
        },
        series: {
          events: {
            legendItemClick: function () {
              return false
            },
          },
        },
      },
      series: [
        {
          type: 'column',
          name: 'Daily Sales',
          data: props.chartData.map((item) => {
            const total = item.fbaAmount + item.fbmAmount + item.profit
            const fbaRatio = (item.fbaAmount / total) * 100
            const fbmRatio = (item.fbmAmount / total) * 100
            const isSelected = selectedColumns.value.includes(item.date)

            return {
              y: total,
              category: item.date,
              color: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                  [0, isSelected ? '#66BB6A' : '#4CAF50'],
                  [fbaRatio / 100, isSelected ? '#66BB6A' : '#4CAF50'],
                  [fbaRatio / 100, isSelected ? '#FFD54F' : '#FFC107'],
                  [(fbaRatio + fbmRatio) / 100, isSelected ? '#FFD54F' : '#FFC107'],
                  [(fbaRatio + fbmRatio) / 100, isSelected ? '#64B5F6' : '#2196F3'],
                  [1, isSelected ? '#64B5F6' : '#2196F3'],
                ],
              },
              borderColor: isSelected ? '#1e88e5' : undefined,
              borderWidth: isSelected ? 2 : 0,
            }
          }),
        },
        {
          type: 'line',
          name: 'FBA Sales',
          color: '#4CAF50',
          marker: { enabled: false },
          enableMouseTracking: false,
          showInLegend: true,
          data: [],
        },
        {
          type: 'line',
          name: 'FBM Sales',
          color: '#FFC107',
          marker: { enabled: false },
          enableMouseTracking: false,
          showInLegend: true,
          data: [],
        },
        {
          type: 'line',
          name: 'Profit',
          color: '#2196F3',
          marker: { enabled: false },
          enableMouseTracking: false,
          showInLegend: true,
          data: [],
        },
      ],
    })

    const handleChartClick = async (date: string) => {
      let newColumns: string[]
      if (selectedColumns.value.length >= 2) {
        newColumns = [date]
      } else {
        const index = selectedColumns.value.indexOf(date)
        if (index > -1) {
          newColumns = [...selectedColumns.value]
          newColumns.splice(index, 1)
        } else {
          newColumns = [...selectedColumns.value, date]
        }
      }

      try {
        store.commit('table/SET_SELECTED_COLUMNS', newColumns)
        if (newColumns.length > 0) {
          await store.dispatch('table/fetchTableData', newColumns)
        }
      } catch (error) {
        console.error('Tablo verisi işlenirken hata:', error)
      }
    }

    watch(selectedColumns, () => {
      if (chart.value) {
        chart.value.update(createChartOptions())
      }
    })

    onMounted(() => {
      if (chartContainer.value) {
        const style = document.createElement('style')
        style.innerHTML = `
          .selected-column {
            filter: brightness(1.2);
            stroke: #1e88e5;
            stroke-width: 2px;
          }
        `
        document.head.appendChild(style)

        chart.value = Highcharts.chart(chartContainer.value, createChartOptions())
      }
    })

    return { chartContainer }
  },
})
</script>

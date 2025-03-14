<template>
  <select v-model="selectedDay" @change="updateDay" class="border p-2 rounded-lg">
    <option v-for="day in days" :key="day" :value="day">{{ day }} days</option>
  </select>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  setup() {
    const store = useStore()
    const selectedDay = ref(30)
    const days = [60, 30, 14, 7]

    const updateDay = () => {
      if (store.state.auth.user) {
        store.commit('chart/SET_SELECTED_DAY', selectedDay.value)
        store.commit('table/SET_SELECTED_COLUMNS', [])
        store.commit('table/CLEAR_TABLE_DATA', null, { root: true })
      }
    }

    return { selectedDay, days, updateDay }
  },
})
</script>

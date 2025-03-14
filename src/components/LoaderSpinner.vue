<template>
  <div :class="className"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { twMerge } from 'tailwind-merge'

export default defineComponent({
  props: {
    class: {
      type: String,
      default: '',
    },
  },
  computed: {
    className(): string {
      return twMerge(
        'border-2 rounded-full animate-spin w-5 h-5 border-white animate-spin border-t-transparent',
        this.class,
      )
    },
  },
})
</script>

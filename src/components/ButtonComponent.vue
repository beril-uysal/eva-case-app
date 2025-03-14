<template>
  <button
    :class="[
      'px-4 py-2 rounded-lg font-medium transition duration-200',
      variantClasses,
      { 'opacity-50 cursor-not-allowed': disabled },
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <LoaderSpinner v-if="loading" />
    <span v-if="!loading"><slot /></span>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LoaderSpinner from './LoaderSpinner.vue'

export default defineComponent({
  components: { LoaderSpinner },
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (value: string) => ['primary', 'secondary', 'danger'].includes(value),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    variantClasses(): string {
      const variants: Record<string, string> = {
        primary: 'bg-blue-500 text-white hover:bg-blue-600',
        secondary: 'bg-gray-500 text-white hover:bg-gray-600',
        danger: 'bg-red-500 text-white hover:bg-red-600',
      }
      return variants[this.variant] || variants.primary
    },
  },
  methods: {
    handleClick(event: Event) {
      if (!this.disabled) {
        this.$emit('click', event)
      }
    },
  },
})
</script>

<style scoped></style>

<template>
  <header class="w-full bg-white shadow-md p-4 flex justify-end">
    <ButtonComponent @click="handleLogout" variant="primary" :loading="isLoading">
      Logout
    </ButtonComponent>
  </header>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import ButtonComponent from './ButtonComponent.vue'

export default defineComponent({
  name: 'PageHeader',
  components: { ButtonComponent },
  setup() {
    const store = useStore()
    const router = useRouter()
    const isLoading = ref(false)

    const handleLogout = async () => {
      isLoading.value = true
      await store.dispatch('auth/logout')
      isLoading.value = false
      router.push('/')
    }

    return { handleLogout, isLoading }
  },
})
</script>

<style scoped></style>

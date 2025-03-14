<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-96">
      <h1 class="text-2xl font-semibold text-center mb-6">Log In</h1>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">E-mail</label>
          <input
            type="email"
            v-model="email"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            v-model="password"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <ButtonComponent
          @click="handleLogin"
          variant="primary"
          class="w-full flex items-center justify-center"
          :loading="isLoading"
        >
          Log In
        </ButtonComponent>
        <p v-if="errorMessage" class="text-red-500 text-center mt-4">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import ButtonComponent from '../components/ButtonComponent.vue'

export default defineComponent({
  name: 'LoginPage',
  components: { ButtonComponent },
  setup() {
    const store = useStore()
    const router = useRouter()
    const email = ref(import.meta.env.VITE_LOGIN_EMAIL || '')
    const password = ref(import.meta.env.VITE_LOGIN_PASSWORD || '')
    const errorMessage = ref('')
    const isLoading = ref(false)

    const handleLogin = async () => {
      isLoading.value = true

      const success = await store.dispatch('auth/login', {
        email: email.value,
        password: password.value,
      })

      if (success) {
        isLoading.value = false
        router.push('/dashboard')
      } else {
        errorMessage.value = 'Please check your credientials'
      }
    }

    return { email, password, handleLogin, errorMessage, isLoading }
  },
})
</script>

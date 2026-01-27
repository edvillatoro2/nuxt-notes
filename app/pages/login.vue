<template>
  <div class="flex h-screen flex-col justify-center gap-4 p-8 bg-[#7f7fa8] text-white">
    <!-- Global error -->
    <div v-if="duplicateError" class="text-red-600 text-2xl font-semibold">
      {{ duplicateError }}
    </div>

    <!-- Success message -->
    <div v-if="successMessage" class="text-green-600 text-2xl font-semibold">
      {{ successMessage }}
    </div>

    <h1 class="text-4xl font-bold capitalize">
      Login <span class="text-2xl">to your account</span>
    </h1>

    <p class="capitalize">
      dont have an account?
      <NuxtLink
        class="font-semibold text-[#99ff00] underline cursor-pointer hover:text-[#00ff44a9]"
        to="/register"
      >
        Register
      </NuxtLink>
      to create one
    </p>

    <form @submit.prevent="submit" class="gap-8 flex flex-col">
      <!-- Email -->
      <div class="flex flex-col gap-2">
        <div v-if="emailError" class="bg-red-400 p-2 flex justify-center rounded">
          <p class="text-red-900 font-semibold">{{ emailError }}</p>
        </div>

        <label class="block font-medium">Email Address</label>
        <input
          id="email"
          v-model="email"
          type="email"
          name="email"
          placeholder="example@email.com"
          class="block text-black bg-white p-3 rounded border border-gray-300"
          :class="emailError ? 'border-red-500 bg-red-200' : ''"
        />
      </div>

      <!-- Password -->
      <div class="flex flex-col gap-2">
        <div v-if="passwordError" class="bg-red-400 p-2 flex justify-center rounded">
          <p class="text-red-900 font-semibold">{{ passwordError }}</p>
        </div>

        <label class="block font-medium">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          name="password"
          placeholder="Password"
          class="block text-black bg-white p-3 rounded border border-gray-300"
          :class="passwordError ? 'border-red-500 bg-red-200' : ''"
        />
      </div>
      <div>
        <!-- login button -->
        <button
          :disabled="loading"
          class="bg-[#297373] hover:bg-[#297373c1] disabled:opacity-60 text-white font-bold py-2 px-4 rounded"
        >
          {{ loading ? 'Logging in…' : 'Login' }}
        </button>
      </div>
    </form>
  </div>
  <!-- <div class="w-3/4">
      <div class="font-semibold text-lg">test</div>
    </div> -->
  <!-- </div> -->
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const email = ref('')
const password = ref('')
const duplicateError = ref('')
const emailError = ref('')
const passwordError = ref('')
const successMessage = ref('')
const loading = ref(false)

const { fetchUser } = useAuth()

const submit = async () => {
  duplicateError.value = ''
  emailError.value = ''
  passwordError.value = ''
  successMessage.value = ''

  if (!email.value) {
    emailError.value = 'Email is required.'
    return
  }

  if (!password.value) {
    passwordError.value = 'Password is required.'
    return
  }

  loading.value = true

  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    })

    // 🔑 Hydrate auth state immediately
    await fetchUser(true)

    successMessage.value = 'Login successful!'
    await navigateTo('/', { replace: true })
  } catch (err: any) {
    const message = err.data?.statusMessage || 'An error occurred'
    if (message.toLowerCase().includes('email')) {
      emailError.value = message
    } else if (message.toLowerCase().includes('password')) {
      passwordError.value = message
    } else {
      duplicateError.value = message
    }
  }
}
</script>

<style scoped></style>

<template>
<<<<<<< HEAD
  <!-- <div class="flex h-screen"> -->
  <div class="flex h-screen flex-col justify-center gap-4 p-8 bg-[#7f7fa8] text-white">
    <!-- duplicateError message -->

=======
  <div class="flex h-screen flex-col justify-center gap-4 p-8 bg-[#7f7fa8] text-white">
    <!-- Global error -->
>>>>>>> dbd522f (working token on SSR and CSR)
    <div v-if="duplicateError" class="text-red-600 text-2xl font-semibold">
      {{ duplicateError }}
    </div>

<<<<<<< HEAD
    <!-- successMessage message -->

=======
    <!-- Success message -->
>>>>>>> dbd522f (working token on SSR and CSR)
    <div v-if="successMessage" class="text-green-600 text-2xl font-semibold">
      {{ successMessage }}
    </div>

<<<<<<< HEAD
    <!-- Login form -->
    <h1 class="text-4xl font-bold capitalize">
      Login <span class="text-2xl">to your account</span>
    </h1>
    <!-- <h4 class="font-semibold text-lg">sign up for free account</h4> -->
=======
    <h1 class="text-4xl font-bold capitalize">
      Login <span class="text-2xl">to your account</span>
    </h1>

>>>>>>> dbd522f (working token on SSR and CSR)
    <p class="capitalize">
      dont have an account?
      <NuxtLink
        class="font-semibold text-[#FF2E00] underline cursor-pointer hover:text-[#ff2f00a9]"
        to="/register"
      >
        Register
      </NuxtLink>
      to create one
    </p>
<<<<<<< HEAD
    <!-- inputs -->
    <form @submit.prevent="submit" class="gap-8 flex flex-col">
=======

    <form @submit.prevent="submit" class="gap-8 flex flex-col">
      <!-- Email -->
>>>>>>> dbd522f (working token on SSR and CSR)
      <div class="flex flex-col gap-2">
        <div v-if="emailError" class="bg-red-400 p-2 flex justify-center rounded">
          <p class="text-red-900 font-semibold">{{ emailError }}</p>
        </div>
<<<<<<< HEAD
        <label for="email" class="block font-medium">Email Address</label>
        <input
          v-model="email"
          type="email"
=======

        <label class="block font-medium">Email Address</label>
        <input
          id="email"
          v-model="email"
          type="email"
          name="email"
>>>>>>> dbd522f (working token on SSR and CSR)
          placeholder="example@email.com"
          class="block p-3 rounded border border-gray-300"
          :class="emailError ? 'border-red-500 bg-red-200' : ''"
        />
      </div>
<<<<<<< HEAD
=======

      <!-- Password -->
>>>>>>> dbd522f (working token on SSR and CSR)
      <div class="flex flex-col gap-2">
        <div v-if="passwordError" class="bg-red-400 p-2 flex justify-center rounded">
          <p class="text-red-900 font-semibold">{{ passwordError }}</p>
        </div>
<<<<<<< HEAD
        <label for="password" class="block font-medium">Password</label>
        <input
          v-model="password"
          type="password"
=======

        <label class="block font-medium">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          name="password"
>>>>>>> dbd522f (working token on SSR and CSR)
          placeholder="Password"
          class="block p-3 rounded border border-gray-300"
          :class="passwordError ? 'border-red-500 bg-red-200' : ''"
        />
      </div>
<<<<<<< HEAD
      <!-- sign up button -->
      <div>
        <button
          class="bg-[#297373] hover:bg-[#297373c1] hover:cursor-pointer text-white font-bold py-2 px-4 rounded"
        >
          Login
=======
      <div>
        <!-- login button -->
        <button
          :disabled="loading"
          class="bg-[#297373] hover:bg-[#297373c1] disabled:opacity-60 text-white font-bold py-2 px-4 rounded"
        >
          {{ loading ? 'Logging in…' : 'Login' }}
>>>>>>> dbd522f (working token on SSR and CSR)
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
<<<<<<< HEAD
const email = ref('')
const password = ref('')
const duplicateError = ref('')
const emailError = ref('')
const passwordError = ref('')
const successMessage = ref('')

const submit = async (e: Event) => {
  e.preventDefault()
=======
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
>>>>>>> dbd522f (working token on SSR and CSR)
  duplicateError.value = ''
  emailError.value = ''
  passwordError.value = ''
  successMessage.value = ''

  if (!email.value) {
    emailError.value = 'Email is required.'
    return
  }
<<<<<<< HEAD
  if (!password.value) {
    passwordError.value = 'Password is required'
    return
  }

=======

  if (!password.value) {
    passwordError.value = 'Password is required.'
    return
  }

  loading.value = true

>>>>>>> dbd522f (working token on SSR and CSR)
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    })
<<<<<<< HEAD
    successMessage.value = 'Login successful!'
<<<<<<< HEAD
    //wait for 2 seconds and redirect to home page
=======
    // Small delay then navigate
>>>>>>> ce1d4504fdc2bcd708e28eee17510c28ba8ad897
    setTimeout(() => {
      navigateTo('/')
    }, 2000)
  } catch (err: any) {
    const messge = err.data?.statusMessage || 'An error occurred'
    if (messge.toLowerCase().includes('email')) {
      emailError.value = messge
    } else if (messge.toLowerCase().includes('password')) {
      passwordError.value = messge
    } else {
      duplicateError.value = messge
=======

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
>>>>>>> dbd522f (working token on SSR and CSR)
    }
  }
}
</script>

<style scoped></style>

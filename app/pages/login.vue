<template>
  <div
    class="flex md:flex-row flex-col h-screen p-8 gap-8"
    style="
      background: #b05446;
      background: linear-gradient(
        141deg,
        rgba(176, 84, 70, 0.5) 0%,
        rgba(154, 255, 3, 0.3) 50%,
        rgba(129, 128, 168, 0.55) 69%
      );
    "
  >
    <div
      class="flex flex-col w-full lg:w-2/3 justify-center rounded relative gap-4 p-8 text-white bg-white/45"
    >
      <!-- Global error -->
      <div v-if="duplicateError" class="text-red-600 text-2xl font-semibold">
        {{ duplicateError }}
      </div>

      <!-- Success message -->
      <div v-if="successMessage" class="text-green-600 text-2xl font-semibold">
        {{ successMessage }}
      </div>
      <div class="flex items-center justify-center relative md:absolute md:top-0 md:left-0 w-full">
        <div class="bg-black flex flex-col items-center p-12 rounded">
          <h1 class="text-6xl font-bold capitalize">Login</h1>
        </div>
      </div>

      <form @submit.prevent="submit" class="gap-8 flex flex-col">
        <!-- Email -->
        <div class="flex flex-col gap-2">
          <div v-if="emailError" class="bg-red-400 p-2 flex justify-center rounded">
            <p class="text-red-900 font-semibold">{{ emailError }}</p>
          </div>

          <label class="block font-medium bg-black p-2">Email Address</label>
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

          <label class="block font-medium bg-black p-2">Password</label>
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
        <!-- login button -->
        <button
          :disabled="loading"
          class="bg-[#297373] hover:bg-[#297373c1] cursor-pointer disabled:opacity-60 text-white font-bold py-2 px-4 rounded"
        >
          {{ loading ? 'Logging in…' : 'Login' }}
        </button>
      </form>
    </div>
    <div class="lg:w-3/4 w-full h-full">
      <div class="w-full h-full flex items-center justify-center relative">
        <div
          class="absolute top-0 right-0 w-40 h-40 rounded-full bg-[#cdcffa] border-4 border-[#6b72a8] flex items-center justify-center shadow-lg rotate-12"
        >
          <div class="text-center">
            <div class="circular-text">
              <svg viewBox="0 0 200 200" class="w-full h-full absolute inset-0">
                <defs>
                  <path
                    id="circlePath"
                    d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                  />
                </defs>
                <text class="text-[17px] font-bold fill-black uppercase tracking-widest">
                  <textPath href="#circlePath" startOffset="0%">
                    dont have an account • yet •
                  </textPath>
                </text>
              </svg>
            </div>

            <!-- center login -->
            <div class="relative z-10">
              <NuxtLink
                to="/register"
                class="text-lg font-bold text-green-400 underline hover:text-green-300 uppercase block mt-1"
              >
                Register
              </NuxtLink>
            </div>
          </div>
        </div>
        <img src="/images/logo.png" alt="Nuxt Notes Logo" />
      </div>
    </div>
  </div>
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

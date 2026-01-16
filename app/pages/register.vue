<template>
  <div class="flex h-screen">
    <div class="flex flex-col justify-center gap-4 w-1/3 p-8 bg-gray-200">
      <!-- duplicateError message -->

      <div v-if="duplicateError" class="text-red-600 text-2xl font-semibold">
        {{ duplicateError }}
      </div>

      <!-- successMessage message -->

      <div v-if="successMessage" class="text-green-600 text-2xl font-semibold">
        {{ successMessage }}
      </div>

      <!-- register form -->
      <h1 class="text-4xl font-bold">register Page</h1>
      <h4 class="font-semibold text-lg">sign up for free account</h4>
      <p>
        already registered?
        <NuxtLink
          class="font-semibold text-[#FF2E00] underline cursor-pointer hover:text-[#ff2f00a9]"
          to="/login"
        >
          login
        </NuxtLink>
        to your account
      </p>
      <!-- inputs -->
      <form @submit.prevent="submit" class="gap-8 flex flex-col">
        <div class="flex flex-col gap-2">
          <div v-if="emailError" class="bg-red-400 p-2 flex justify-center rounded">
            <p class="text-red-900 font-semibold">{{ emailError }}</p>
          </div>
          <label for="email" class="block font-medium">Email Address</label>
          <input
            v-model="email"
            type="email"
            placeholder="example@email.com"
            class="block p-3 rounded border border-gray-300"
            :class="emailError ? 'border-red-500 bg-red-200' : ''"
          />
        </div>
        <div class="flex flex-col gap-2">
          <div v-if="passwordError" class="bg-red-400 p-2 flex justify-center rounded">
            <p class="text-red-900 font-semibold">{{ passwordError }}</p>
          </div>
          <label for="password" class="block font-medium">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="block p-3 rounded border border-gray-300"
            :class="passwordError ? 'border-red-500 bg-red-200' : ''"
          />
        </div>
        <!-- sign up button -->
        <div>
          <button
            class="bg-[#297373] hover:bg-[#297373c1] hover:cursor-pointer text-white font-bold py-2 px-4 rounded"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
    <div class="w-2/3">
      <div class="font-semibold text-lg">test</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const email = ref('')
const password = ref('')
const duplicateError = ref('')
const emailError = ref('')
const passwordError = ref('')
const successMessage = ref('')

const submit = async (e: Event) => {
  e.preventDefault()
  duplicateError.value = ''
  emailError.value = ''
  passwordError.value = ''
  successMessage.value = ''

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  if (!email.value || !emailRegex.test(email.value.trim())) {
    emailError.value = 'Please enter a valid email address.'
    return
  }
  if (!password.value) {
    passwordError.value = 'Password is required'
    return
  }
  if (password.value.length < 8) {
    passwordError.value = 'Password must be at least 8 characters long'
    return
  }

  try {
    const res = await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    })
    successMessage.value = 'Registration successful! Redirecting to login...'
    //wait for 2 seconds and redirect to login page
    setTimeout(async () => {
      await navigateTo('/login')
    }, 2000)
  } catch (err: any) {
    const messge = err.data?.statusMessage || 'An error occurred'
    if (messge.toLowerCase().includes('email')) {
      emailError.value = messge
    } else if (messge.toLowerCase().includes('password')) {
      passwordError.value = messge
    } else {
      duplicateError.value = messge
    }
  }
}
</script>

<style scoped></style>

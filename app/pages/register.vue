<template>
  <!-- <div class="flex h-screen"> -->
  <div class="flex h-screen flex-col justify-center relative gap-4 p-8 bg-[#EEE5E9] text-white">
    <!-- duplicateError message -->

    <div v-if="duplicateError" class="text-red-600 text-2xl font-semibold">
      {{ duplicateError }}
    </div>

    <!-- successMessage message -->

    <div v-if="successMessage" class="text-green-600 text-2xl font-semibold">
      {{ successMessage }}
    </div>

    <p class="bg-red-400 border-2 border-red-700 p-2 absolute top-32 capitalize">
      already registered?
      <NuxtLink
        class="font-semibold text-[#99ff00] underline cursor-pointer hover:text-[#00ff44a9]"
        to="/login"
      >
        login
      </NuxtLink>
      to your account
    </p>

    <!-- register form -->
    <h1 class="text-4xl font-bold capitalize bg-black p-2">register</h1>
    <h4 class="font-semibold text-lg bg-black p-2">sign up for free account</h4>

    <!-- inputs -->
    <form @submit.prevent="submit" class="gap-8 flex flex-col">
      <div class="flex flex-col gap-2">
        <div v-if="emailError" class="bg-red-400 p-2 flex justify-center rounded">
          <p class="text-red-900 font-semibold">{{ emailError }}</p>
        </div>
        <label for="email" class="block font-medium bg-black p-2">Email Address</label>
        <input
          id="email"
          v-model="email"
          type="email"
          name="email"
          placeholder="example@email.com"
          class="block p-3 text-black bg-white rounded border border-gray-300"
          :class="emailError ? 'border-red-500 bg-red-200' : ''"
        />
      </div>
      <div class="flex flex-col gap-2">
        <div v-if="passwordError" class="bg-red-400 p-2 flex justify-center rounded">
          <p class="text-red-900 font-semibold">{{ passwordError }}</p>
        </div>
        <label for="password" class="font-medium bg-black p-2">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          name="password"
          placeholder="Password"
          class="block p-3 text-black bg-white rounded border border-gray-300"
          :class="passwordError ? 'border-red-500 bg-red-200' : ''"
        />
      </div>
      <!-- sign up button -->
      <div>
        <button
          class="bg-[#CF5C36] hover:bg-[#cf5c36b4] hover:cursor-pointer text-white font-bold py-2 px-4 rounded"
        >
          Sign Up
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
const email = ref('')
const password = ref('')
const duplicateError = ref('')
const emailError = ref('')
const passwordError = ref('')
const successMessage = ref('')

const submit = async () => {
  duplicateError.value = ''
  emailError.value = ''
  passwordError.value = ''
  successMessage.value = ''

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!email.value || !emailRegex.test(email.value)) {
    emailError.value = 'Please enter a valid email address.'
    return
  }

  if (password.value.length < 8) {
    passwordError.value = 'Password must be at least 8 characters long'
    return
  }

  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    })

    successMessage.value = 'Registration successful!'
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

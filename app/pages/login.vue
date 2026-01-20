<template>
  <!-- <div class="flex h-screen"> -->
  <div class="flex h-screen flex-col justify-center gap-4 p-8 bg-[#7f7fa8] text-white">
    <!-- duplicateError message -->

    <div v-if="duplicateError" class="text-red-600 text-2xl font-semibold">
      {{ duplicateError }}
    </div>

    <!-- successMessage message -->

    <div v-if="successMessage" class="text-green-600 text-2xl font-semibold">
      {{ successMessage }}
    </div>

    <!-- Login form -->
    <h1 class="text-4xl font-bold capitalize">
      Login <span class="text-2xl">to your account</span>
    </h1>
    <!-- <h4 class="font-semibold text-lg">sign up for free account</h4> -->
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
          Login
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

const submit = async (e: Event) => {
  e.preventDefault()
  duplicateError.value = ''
  emailError.value = ''
  passwordError.value = ''
  successMessage.value = ''

  if (!email.value) {
    emailError.value = 'Email is required.'
    return
  }
  if (!password.value) {
    passwordError.value = 'Password is required'
    return
  }

  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    })
    successMessage.value = 'Login successful!'
    //wait for 2 seconds and redirect to home page
    setTimeout(() => {
      window.location.href = '/'
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

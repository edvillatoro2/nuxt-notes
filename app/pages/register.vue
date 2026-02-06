<template>
  <div
    class="flex md:flex-row flex-col h-screen p-8 gap-8"
    style="
      background: #ffffff;
      background: radial-gradient(
        circle,
        rgba(176, 84, 70, 0.5) 0%,
        rgba(154, 255, 3, 0.24) 50%,
        rgba(129, 128, 168, 0.55) 69%
      );
    "
  >
    <div
      class="flex w-full lg:w-2/3 flex-col rounded justify-center relative gap-4 p-8 bg-[#EEE5E9]/70 text-white"
    >
      <!-- duplicateError message -->

      <div v-if="duplicateError" class="text-red-600 text-2xl font-semibold">
        {{ duplicateError }}
      </div>

      <!-- successMessage message -->

      <div v-if="successMessage" class="text-green-600 text-2xl font-semibold">
        {{ successMessage }}
      </div>

      <!-- register form -->
      <div class="flex items-center justify-center relative md:absolute md:top-0 md:left-0 w-full">
        <div class="bg-black flex flex-col items-center p-12 rounded">
          <h1 class="text-6xl font-bold capitalize">sign up</h1>
          <h4 class="font-semibold text-lg">for a free account</h4>
        </div>
      </div>

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

        <button
          class="bg-[#CF5C36] hover:bg-[#cf5c36b4] hover:cursor-pointer text-white font-bold py-2 px-4 rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
    <div class="lg:w-3/4 w-full h-full">
      <div class="w-full h-full flex items-center justify-center relative">
        <div
          class="absolute top-0 right-0 w-40 h-40 rounded-full bg-orange-400 border-4 border-orange-700 flex items-center justify-center shadow-lg rotate-12"
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
                    already registered? • to your account •
                  </textPath>
                </text>
              </svg>
            </div>

            <!-- center login -->
            <div class="relative z-10">
              <NuxtLink
                to="/login"
                class="text-lg font-bold text-green-400 underline hover:text-green-300 uppercase block mt-1"
              >
                Login
              </NuxtLink>
            </div>
          </div>
        </div>
        <img src="/images/welcome.png" alt="Nuxt Notes Logo" />
      </div>
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

<style scoped>
.stamp {
  position: relative;
  width: 100%;
  height: 120px;
  border-radius: 50%;
  background: #f3e6d8; /* beige / paper tone */
  border: 1.5px solid #111;
  display: grid;
  place-items: center;
}

.stamp span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: rotate(calc(var(--i) * 10deg)) translateY(-48px) rotate(90deg);
  transform-origin: center;
  font-size: 0.55rem;
  letter-spacing: 0.08em;
  color: #111;
  text-transform: uppercase;
  white-space: pre;
  font-weight: 500;
}

.stamp-center {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #111;
  text-decoration: none;
}
</style>

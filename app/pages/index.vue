<template>
  <div class="flex h-screen">
    <div class="flex flex-col gap-4 w-1/3 p-8 bg-[#464D77] text-white">
      <div class="font-bold text-2xl">your notes</div>
      <div>
        <h3 class="capitalize">today</h3>
        <ul>
          <li class="p-2 bg-[#5A6091] rounded mb-2 cursor-pointer hover:bg-[#6b72a8]">note 1</li>
          <li class="p-2 bg-[#5A6091] rounded mb-2 cursor-pointer hover:bg-[#6b72a8]">note 2</li>
          <li class="p-2 bg-[#5A6091] rounded mb-2 cursor-pointer hover:bg-[#6b72a8]">note 3</li>
        </ul>
      </div>
    </div>
    <div class="w-2/3 py-20 px-1.5">
<<<<<<< HEAD
<<<<<<< HEAD
      <div class="flex justify-between items-center">
        <div class="font-bold text-2xl">your notes</div>
        <button
          @click="logout"
=======
      <div class="flex justify-between items-center">
        <div class="font-bold text-2xl">your notes</div>
        <button
          @click="handleLogout"
>>>>>>> dbd522f (working token on SSR and CSR)
          class="text-sm bg-red-500 hover:bg-red-600 cursor-pointer px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
<<<<<<< HEAD
=======
>>>>>>> ce1d4504fdc2bcd708e28eee17510c28ba8ad897
=======
>>>>>>> dbd522f (working token on SSR and CSR)
      <div class="flex justify-between">
        <div class="capitalize font-semibold text-sm">
          <Icon name="fluent-emoji-flat:pencil" style="color: black" size="24" />
          write note
        </div>
        <div>
          <Icon name="uil:trash" style="color: black" size="24" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
// import register from '../pages/register.vue'
// import login from '../pages/login.vue'

<<<<<<< HEAD
// prevent access to home page if not authenticated
definePageMeta({
  middleware: 'auth'
})
<<<<<<< HEAD

// logout function
const logout = async () => {
  try {
    // call logout endpoint to clear server-side cookie
    await $fetch('/api/auth/logout', { method: 'POST' })
  } catch (error) {
    console.error('Logout error:', error)
  }
  // clear client-side cookie
  const authToken = useCookie('auth_token')
  authToken.value = null

  // Force page reload to refresh auth state
  window.location.href = '/login'
}
=======
>>>>>>> ce1d4504fdc2bcd708e28eee17510c28ba8ad897
=======
// Apply auth middleware
definePageMeta({
  middleware: 'auth'
})

const { user } = useAuth()

// logout function
const { logout } = useAuth()

const handleLogout = async () => {
  await logout()
}
>>>>>>> dbd522f (working token on SSR and CSR)
</script>
<style scoped></style>

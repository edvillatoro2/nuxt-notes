<template>
  <div class="flex h-screen">
    <div class="flex flex-col gap-4 w-1/3 p-8 bg-[#464D77] text-white">
      <div class="font-bold text-2xl">your notes</div>
      <div class="flex flex-col gap-2">
        <h3 class="capitalize text-xl">today</h3>
        <ul class="list-inside" style="list-style: circle">
          <li class="p-2 bg-[#5A6091] rounded mb-2 cursor-pointer hover:bg-[#6b72a8]">note 1</li>
          <li class="p-2 bg-[#5A6091] rounded mb-2 cursor-pointer hover:bg-[#6b72a8]">note 2</li>
          <li class="p-2 bg-[#5A6091] rounded mb-2 cursor-pointer hover:bg-[#6b72a8]">note 3</li>
        </ul>
      </div>
    </div>
    <div class="w-2/3 p-8 py-20">
      <div class="flex justify-between items-center mb-6">
        <div class="font-bold text-2xl">your notes</div>
        <button
          @click="handleLogout"
          class="text-sm bg-red-500 hover:bg-red-600 cursor-pointer px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
      <div class="flex justify-between">
        <div class="capitalize font-semibold text-sm">
          <Icon name="fluent-emoji-flat:pencil" style="color: black" size="24" />
          write note
        </div>
        <div class="cursor-pointer">
          <Icon name="uil:trash" style="color: black" size="24" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
// import register from '../pages/register.vue'
// import login from '../pages/login.vue'

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
</script>
<style scoped></style>

<template>
  <div class="flex h-screen">
    <div class="flex flex-col gap-4 w-1/3 p-8 bg-[#464D77] text-white">
      <div class="flex flex-col gap-4">
        <h2 class="capitalize font-semibold tracking-widest text-4xl">today</h2>
        <ul style="list-style: circle; list-style-position: inside">
          <li class="p-2 bg-[#5A6091] rounded mb-2 cursor-pointer hover:bg-[#6b72a8]">note 1</li>
          <li class="p-2 bg-[#5A6091] rounded mb-2 cursor-pointer hover:bg-[#6b72a8]">note 2</li>
          <li class="p-2 bg-[#5A6091] rounded mb-2 cursor-pointer hover:bg-[#6b72a8]">note 3</li>
        </ul>
      </div>
    </div>
    <div class="w-2/3 p-8 py-20">
      <div class="flex justify-between items-center mb-6">
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
        <div class="relative cursor-pointer group w-6 h-6">
          <!-- trash body -->
          <Icon name="mdi:trash-can-outline" size="24" class="absolute inset-0" />

          <!-- fake lid overlay -->
          <span
            class="absolute top-[2px] left-[3px] w-[18px] h-[6px] bg-white border-2 border-black rounded-sm origin-left transition-transform duration-600 group-hover:-rotate-45"
          ></span>
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
<style scoped>
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-2px);
  }
  50% {
    transform: translateX(2px);
  }
  75% {
    transform: translateX(-2px);
  }
}

.hover-shake:hover {
  animation: shake 0.5s ease-in-out;
}
</style>

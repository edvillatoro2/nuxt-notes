<template>
  <div class="flex h-screen">
    <div class="flex flex-col gap-4 w-1/3 p-8 bg-[#464D77] text-white">
      <div v-for="note in notes" class="flex flex-col gap-4">
        <div class="capitalize font-semibold tracking-widest text-4xl">
          <NuxtTime :datetime="note?.updatedAt" relative numeric="auto" relative-style="long" />
        </div>

        <div class="cursor-pointer truncate rounded p-2 bg-[#5A6091] hover:bg-[#6b72a8]">
          <ul style="list-style: circle; list-style-position: inside">
            <li class="">
              {{ note?.content.substring(0, 30) }}
            </li>
          </ul>
          <div class="text-[0.725rem] font-semibold">
            <NuxtTime :datetime="note?.updatedAt" hour="2-digit" minute="2-digit" locale="en-US" />
          </div>
        </div>
      </div>
    </div>

    <div class="w-2/3 p-8 py-20">
      <div class="mb-12 flex justify-end">
        <button
          @click="handleLogout"
          class="text-sm bg-red-500 hover:bg-red-600 cursor-pointer px-3 py-1 rounded text-white"
        >
          Logout
        </button>
      </div>
      <div class="flex justify-between mb-2">
        <div @click="saveNote">
          <Icon
            name="streamline-color:send-email-flat"
            size="24"
            class="text-gray-400 cursor-pointer mx-auto transition-transform duration-900 hover:translate-x-full hover:rotate-x-50 rotate-z-45"
          />
        </div>

        <div @click="deleteNote" class="relative cursor-pointer group w-6 h-6">
          <Icon name="flat-color-icons:full-trash" size="24" class="absolute inset-0" />
          <span
            class="absolute top-0.125 left-0.75 w-4.5 h-1.75 bg-[#484e78] rounded-sm origin-left transition-transform duration-600 group-hover:-rotate-45"
          ></span>
        </div>
      </div>

      <!-- Editor Section -->
      <ClientOnly>
        <div>
          <TipTapEditor />
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
// Apply auth middleware
definePageMeta({
  middleware: 'auth'
})

interface Note {
  id: number
  content: string
  userId: number
  createdAt: string
  updatedAt: string
}

const notes = ref<Note[]>([])
const showEditor = ref(false)

onMounted(async () => {
  const res = await $fetch('/api/notes')
  console.log('Notes:', res)

  if (res?.success && res?.notes) {
    notes.value = res.notes
  }
})

const { logout, user } = useAuth()

const handleLogout = async () => {
  await logout()
}

// const toggleEditor = () => {
//   showEditor.value = !showEditor.value
// }

const deleteNote = () => {
  // This will be handled by the TipTapEditor component itself
  // Or you can expose a method from the component to clear content
  if (confirm('Are you sure you want to delete your note progress?')) {
    showEditor.value = false
    // Wait a bit then show again to reset
    setTimeout(() => {
      showEditor.value = true
    }, 100)
  }
}

const saveNote = () => {
  // This will be handled by the TipTapEditor component itself
  alert('Note saved! (functionality to be implemented)')
}

const normalizeDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
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

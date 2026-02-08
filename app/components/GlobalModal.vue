<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="isOpen"
          @click.self="close"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <div
            class="bg-white rounded-lg gap-6 flex flex-col justify-center items-center shadow-xl max-w-md w-full mx-4 p-6"
          >
            <h2 class="text-xl font-bold" v-if="title">
              {{ title }}
            </h2>
            <p>{{ message }}</p>

            <div class="">
              <button
                v-if="action"
                @click="close"
                class="font-semibold cursor-pointer px-3 py-2 rounded transition-all duration-600 ease-out bg-white/0 border border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[3.1px] hover:bg-white/10 hover:border-white/80 hover:shadow-[0_4px_8px_rgba(0,0,0,0.525)] active:scale-95 text-[#CF5C36] hover:text-[#cf5c36b4] mr-8"
              >
                cancel
              </button>
              <button
                @click="handleConfirm"
                class="font-semibold cursor-pointer px-3 py-2 rounded transition-all duration-600 ease-out bg-white/0 border border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[3.1px] hover:bg-white/10 hover:border-white/80 hover:shadow-[0_4px_8px_rgba(0,0,0,0.525)] active:scale-95 text-[#CF5C36] hover:text-[#cf5c36b4]"
              >
                {{ confirmText }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
const { isOpen, title, message, action, confirmText, close } = useModal()

const handleConfirm = async () => {
  if (action.value) {
    await action.value()
  }
  close()
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>

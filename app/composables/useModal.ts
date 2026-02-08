interface ModalOptions {
  title?: string
  message: string
  confirmText?: string
  action?: () => void | Promise<void>
}

const isOpen = ref(false)
const message = ref('')
const title = ref('')
const confirmText = ref('Close')
const action = ref<(() => void | Promise<void>) | null>(null)

export const useModal = () => {
  const open = (options: ModalOptions) => {
    message.value = options?.message
    title.value = options?.title ?? ''
    confirmText.value = options?.confirmText ?? 'Close'
    action.value = options?.action ?? null
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
    action.value = null
  }

  return {
    isOpen,
    message,
    title,
    action,
    confirmText,
    open,
    close
  }
}

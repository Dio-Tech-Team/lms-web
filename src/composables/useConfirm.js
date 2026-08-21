import { ref } from 'vue'

const isOpen = ref(false)
const title = ref('')
const message = ref('')
let resolvePromise = null

export function useConfirm() {
  function confirm(opts) {
    title.value = typeof opts === 'string' ? 'Confirm' : (opts.title ?? 'Confirm')
    message.value = typeof opts === 'string' ? opts : opts.message
    isOpen.value = true

    return new Promise((resolve) => {
      resolvePromise = resolve
    })
  }

  function handleConfirm() {
    isOpen.value = false
    resolvePromise?.(true)
  }

  function handleCancel() {
    isOpen.value = false
    resolvePromise?.(false)
  }

  return { isOpen, title, message, confirm, handleConfirm, handleCancel }
}

<script setup>
import { useConfirm } from '@/composables/useConfirm'

const { isOpen, title, message, handleConfirm, handleCancel } = useConfirm()
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-navy/20 backdrop-blur-sm p-4"
  >
    <div class="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl border border-sky-100">
      <h2 class="font-serif text-lg font-semibold text-navy-deep mb-1">{{ title }}</h2>
      <p class="text-xs text-slate-500 mb-4">{{ message }}</p>

      <div class="flex justify-end gap-2 mt-6">
        <button
          type="button"
          @click="handleCancel"
          class="px-4 py-2 text-sm text-slate-500 hover:text-navy"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="handleConfirm"
          class="px-4 py-2 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-navy-deep transition-colors"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>
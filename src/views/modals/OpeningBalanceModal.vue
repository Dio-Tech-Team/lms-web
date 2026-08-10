<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-navy/20 backdrop-blur-sm p-4"
  >
    <div class="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl border border-sky-100">
      <h2 class="font-serif text-lg font-semibold text-navy-deep mb-1">Set Opening Balance</h2>
      <p class="text-xs text-slate-500 mb-4">
        Enter the balance from {{ credit?.leave_type }}'s physical leave card. This is a one-time
        entry and cannot be changed later through this form.
      </p>

      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="block text-[10.5px] uppercase font-bold text-slate-400 mb-1">
            Opening Balance ({{ credit?.code }})
          </label>
          <input
            v-model.number="amount"
            type="number"
            step="0.001"
            min="0"
            class="w-full border border-sky-100 rounded-lg p-2.5 text-sm font-mono"
            required
          />
        </div>

        <div class="flex justify-end gap-2 mt-6">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm text-slate-500 hover:text-navy"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-navy-deep transition-colors"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps(['show', 'credit'])
const emit = defineEmits(['close', 'save'])

const amount = ref(0)

watch(
  () => props.show,
  (val) => {
    if (val) amount.value = 0
  }
)

function submit() {
  if (
    confirm(`Set opening balance to ${amount.value} days? This cannot be undone through this form.`)
  ) {
    emit('save', amount.value)
  }
  emit('save', amount.value)
}
</script>
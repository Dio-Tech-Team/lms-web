<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-navy/20 backdrop-blur-sm p-4"
  >
    <div class="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl border border-sky-100">
      <h2 class="font-serif text-lg font-semibold text-navy-deep mb-1">{{ title }}</h2>
      <p class="text-xs text-slate-500 mb-4">{{ hint }}</p>

      <div
        v-if="error"
        class="bg-rose-100 text-rose-700 text-[13px] rounded-lg px-3.5 py-2.5 mb-4 font-medium"
      >
        {{ error }}
      </div>

      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="block text-[10.5px] uppercase font-bold text-slate-400 mb-1">
            {{ label }} ({{ credit?.code }})
          </label>
          <input
            v-model.number="amount"
            type="number"
            :step="mode === 'balance' ? 0.001 : 0.5"
            min="0"
            :max="max ?? undefined"
            class="w-full border border-sky-100 rounded-lg p-2.5 text-sm font-mono"
            required
          />
          <p v-if="max !== null" class="text-[11px] text-slate-400 mt-1">Maximum {{ max }}</p>
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
            :disabled="isSaving"
            class="px-4 py-2 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-navy-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSaving ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useConfirm } from '@/composables/useConfirm'

const props = defineProps(['show', 'credit', 'isSaving', 'error'])
const emit = defineEmits(['close', 'save'])

const amount = ref(0)
const { confirm } = useConfirm()

// balance:   VL/SL — running balance from the paper card
// remaining: SPL/WL — days left this year
// taken:     FL — days already taken on paper this year
const mode = computed(() => {
  const code = props.credit?.code
  if (['SPL', 'WL'].includes(code)) return 'remaining'
  if (code === 'FL') return 'taken'
  return 'balance'
})

const total = computed(() => Number(props.credit?.total_credits) || 0)
const isEditing = computed(() => mode.value === 'balance' && total.value > 0)

const title = computed(() => {
  if (mode.value === 'remaining') return 'Set Remaining Days'
  if (mode.value === 'taken') return 'Set Days Taken'
  return isEditing.value ? 'Edit Balance' : 'Set Opening Balance'
})

const hint = computed(() => {
  const name = props.credit?.leave_type
  if (mode.value === 'remaining')
    return `Days of ${name} left this year, from the physical leave card. Resets every January.`
  if (mode.value === 'taken')
    return `Forced Leave days already taken this year on paper. These were already deducted from the VL opening balance, so VL is not deducted again.`
  return isEditing.value
    ? `Correct ${name}'s current balance. The remaining balance recalculates from days already used.`
    : `Enter the balance from ${name}'s physical leave card.`
})

const label = computed(() => {
  if (mode.value === 'remaining') return 'Remaining Days'
  if (mode.value === 'taken') return 'Days Taken'
  return isEditing.value ? 'Corrected Balance' : 'Opening Balance'
})

const max = computed(() => {
  if (mode.value === 'remaining') return total.value
  if (mode.value === 'taken') return 5
  return null
})

watch(
  () => props.show,
  (val) => {
    if (!val) return
    if (mode.value === 'remaining') amount.value = Number(props.credit?.remaining_balance) || 0
    // FL row's used_credits holds paper days only (filed FL deducts from VL)
    else if (mode.value === 'taken') amount.value = Number(props.credit?.used_credits) || 0
    else amount.value = isEditing.value ? total.value : 0
  }
)

async function submit() {
  let message
  let payload

  if (mode.value === 'remaining') {
    message = `Set ${props.credit?.code} remaining to ${amount.value} day(s) for this year?`
    payload = { used_credits: Math.max(0, total.value - amount.value) }
  } else if (mode.value === 'taken') {
    message = `Record ${amount.value} Forced Leave day(s) taken on paper this year?`
    payload = { used_credits: amount.value }
  } else {
    message = isEditing.value
      ? `Change balance to ${amount.value} days? This will recalculate the remaining balance based on days already used.`
      : `Set opening balance to ${amount.value} days?`
    payload = { total_credits: amount.value }
  }

  if (await confirm(message)) emit('save', payload)
}
</script>
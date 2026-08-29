<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-navy-deep/40 px-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
      <h2 class="text-lg font-bold text-navy-deep mb-1">
        {{ mode === 'approve' ? 'Approve Leave Application' : 'Reject Leave Application' }}
      </h2>
      <p class="text-[13px] text-slate-500 mb-5">
        {{ employeeName }} · {{ leaveTypeCode }} · {{ daysApplied }} day(s)
      </p>

      <div
        v-if="error"
        class="bg-rose-tint text-rose-700 text-[13px] rounded-lg px-3.5 py-2.5 mb-4 font-medium"
      >
        {{ error }}
      </div>

      <div v-if="mode === 'approve'" class="mb-5">
        <div
          v-if="shortfall > 0"
          class="bg-amber-tint text-amber-700 text-[13px] rounded-lg px-3.5 py-3 font-medium leading-relaxed"
        >
          This employee has {{ Number(remainingBalance).toFixed(2) }} day(s) remaining but applied
          for {{ daysApplied }}. {{ shortfall.toFixed(2) }} day(s) will be recorded as Leave Without
          Pay.
        </div>
        <p v-else class="text-[13px] text-slate-500">
          Credits will be deducted and the leave record created. This cannot be undone.
        </p>
      </div>

      <div v-else class="mb-5">
        <label class="block text-[12.5px] font-semibold text-slate-600 mb-1.5">
          Reason for rejection
        </label>
        <textarea
          v-model="rejectionReason"
          rows="3"
          placeholder="The employee sees this, so say what went wrong."
          class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors resize-none"
        ></textarea>
        <p class="text-[12px] text-slate-400 mt-1.5">
          Required — this is the only place the employee learns why.
        </p>
      </div>

      <div class="flex justify-end gap-3">
        <button
          @click="$emit('close')"
          :disabled="submitting"
          class="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors disabled:opacity-40"
        >
          Cancel
        </button>
        <button
          @click="submit"
          :disabled="submitting"
          class="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50"
          :class="
            mode === 'approve' ? 'bg-navy hover:bg-navy-deep' : 'bg-rose-600 hover:bg-rose-700'
          "
        >
          {{ submitting ? 'Working...' : mode === 'approve' ? 'Approve' : 'Reject' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import api from '@/api/axios'

const props = defineProps({
  show: Boolean,
  mode: { type: String, default: 'approve' }, // 'approve' | 'reject'
  applicationId: [Number, String],
  employeeName: String,
  leaveTypeCode: String,
  daysApplied: [Number, String],
  remainingBalance: [Number, String, null],
})

const emit = defineEmits(['close', 'updated'])

const rejectionReason = ref('')
const submitting = ref(false)
const error = ref('')

// Approving past the balance is allowed — the backend records the excess as
// LWOP — but HR should see the figure before it happens, not after.
const shortfall = computed(() => {
  if (props.remainingBalance === null || props.remainingBalance === undefined) return 0
  const diff = Number(props.daysApplied) - Number(props.remainingBalance)
  return diff > 0 ? diff : 0
})

watch(
  () => props.show,
  (open) => {
    if (!open) return
    rejectionReason.value = ''
    error.value = ''
    submitting.value = false
  },
)

async function submit() {
  if (submitting.value) return

  if (props.mode === 'reject' && !rejectionReason.value.trim()) {
    error.value = 'A rejection reason is required.'
    return
  }

  submitting.value = true
  error.value = ''

  try {
    const path = props.mode === 'approve' ? 'approve' : 'reject'
    const body =
      props.mode === 'approve' ? {} : { rejection_reason: rejectionReason.value.trim() }

    await api.post(`/leave-applications/${props.applicationId}/${path}`, body)
    emit('updated')
    emit('close')
  } catch (err) {
    error.value = err.response?.data?.message || 'Something went wrong.'
  } finally {
    submitting.value = false
  }
}
</script>
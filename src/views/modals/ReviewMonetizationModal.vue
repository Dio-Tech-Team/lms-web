<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-navy-deep/40 px-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
      <h2 class="text-lg font-bold text-navy-deep mb-1">
        {{ mode === 'approve' ? 'Approve Monetization' : 'Reject Monetization' }}
      </h2>
      <p class="text-[13px] text-slate-500 mb-5">
        {{ employeeName }} · {{ requestedDays }} day(s) requested
        <span v-if="remainingBalance !== null && remainingBalance !== undefined">
          · {{ Number(remainingBalance).toFixed(1) }} day(s) available
        </span>
      </p>

      <div
        v-if="error"
        class="bg-rose-tint text-rose-700 text-[13px] rounded-lg px-3.5 py-2.5 mb-4 font-medium"
      >
        {{ error }}
      </div>

      <div v-if="mode === 'approve'" class="mb-5">
        <label class="block text-[12.5px] font-semibold text-slate-600 mb-1.5">
          Days to approve
        </label>
        <input
          v-model="approvedDays"
          type="number"
          step="0.5"
          min="0.5"
          :max="requestedDays"
          class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
        />
        <p class="text-[12px] text-slate-400 mt-1.5">
          Approve fewer days than requested if the full amount can't be funded. Cannot exceed
          {{ requestedDays }}.
        </p>
        <p v-if="isPartial" class="text-[12px] text-amber-700 mt-1.5 font-medium">
          Partial approval — the remaining
          {{ (parseFloat(requestedDays) - parseFloat(approvedDays)).toFixed(1) }}
          day(s) will not be credited. This cannot be undone.
        </p>
      </div>

      <div v-else class="mb-5">
        <label class="block text-[12.5px] font-semibold text-slate-600 mb-1.5">
          Reason for rejection <span class="font-normal text-slate-400">(optional)</span>
        </label>
        <select
          v-model="selectedReason"
          class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
        >
          <option value="">No reason given</option>
          <option v-for="r in MONETIZATION_REJECTION_REASONS" :key="r" :value="r">{{ r }}</option>
          <option :value="OTHER_REASON">Other (please specify)</option>
        </select>
        <textarea
          v-if="selectedReason === OTHER_REASON"
          v-model="otherReason"
          rows="3"
          placeholder="The employee sees this, so say what went wrong."
          class="w-full mt-2 border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors resize-none"
        ></textarea>
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
          {{
            submitting
              ? 'Working...'
              : mode === 'approve'
              ? `Approve ${approvedDays || 0} day(s)`
              : 'Reject'
          }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import api from '@/api/axios'
import { MONETIZATION_REJECTION_REASONS, OTHER_REASON, buildReason } from '@/constants/leaveReasons'

const props = defineProps({
  show: Boolean,
  mode: { type: String, default: 'approve' }, // 'approve' | 'reject'
  monetizationId: [Number, String],
  requestedDays: [Number, String],
  remainingBalance: [Number, String, null],
  employeeName: String,
})

const emit = defineEmits(['close', 'updated'])

const approvedDays = ref('')
const selectedReason = ref('')
const otherReason = ref('')
const submitting = ref(false)
const error = ref('')

// Only true for a genuine partial — a full approval stays quiet, since the
// warning is about days the employee loses.
const isPartial = computed(() => {
  const days = parseFloat(approvedDays.value)
  return !isNaN(days) && days > 0 && days < parseFloat(props.requestedDays)
})

// Pre-fill to the full amount: approving in full is the common case, and
// retyping the number every time would be friction for no benefit.
watch(
  () => props.show,
  (open) => {
    if (!open) return
    approvedDays.value = props.requestedDays ?? ''
    selectedReason.value = ''
    otherReason.value = ''
    error.value = ''
    submitting.value = false
  }
)

async function submit() {
  if (submitting.value) return

  if (props.mode === 'approve') {
    const days = parseFloat(approvedDays.value)
    if (isNaN(days) || days < 0.5) {
      error.value = 'Enter a valid number of days (minimum 0.5).'
      return
    }
    if (days > parseFloat(props.requestedDays)) {
      error.value = `Cannot approve more than the ${props.requestedDays} day(s) requested.`
      return
    }
  }

  submitting.value = true
  error.value = ''

  try {
    const path = props.mode === 'approve' ? 'approve' : 'reject'
    const body =
      props.mode === 'approve'
        ? { approved_days: parseFloat(approvedDays.value) }
        : { rejection_reason: buildReason(selectedReason.value, otherReason.value) }

    await api.post(`/leave-monetizations/${props.monetizationId}/${path}`, body)
    emit('updated')
    emit('close')
  } catch (err) {
    error.value = err.response?.data?.message || 'Something went wrong.'
  } finally {
    submitting.value = false
  }
}
</script>
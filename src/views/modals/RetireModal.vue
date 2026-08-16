<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-navy-deep/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click.self="handleClose"
  >
    <div class="bg-white rounded-2xl border border-sky-100 p-7 w-full max-w-md">
      <h2 class="font-serif text-xl font-semibold text-navy-deep mb-1">Mark as Retired</h2>
      <p class="text-slate-500 text-sm mb-5">{{ employee?.first_name }} {{ employee?.surname }}</p>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label
            class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1.5 block"
          >
            Retirement Type
          </label>
          <select
            v-model="retirementType"
            required
            class="w-full border border-sky-100 rounded-xl px-3.5 py-2.5 text-sm text-navy-deep focus:outline-none focus:ring-2 focus:ring-teal-600/30 bg-white"
          >
            <option value="" disabled>Select type</option>
            <option value="optional">Optional</option>
            <option value="mandatory">Mandatory (age 65)</option>
          </select>
        </div>

        <div>
          <label
            class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1.5 block"
          >
            Effective Date
          </label>
          <input
            v-model="effectiveDate"
            type="date"
            required
            class="w-full border border-sky-100 rounded-xl px-3.5 py-2.5 text-sm font-mono text-navy-deep focus:outline-none focus:ring-2 focus:ring-teal-600/30"
          />
        </div>

        <div>
          <label
            class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1.5 block"
          >
            Remarks <span class="normal-case text-slate-300 font-medium">(optional)</span>
          </label>
          <textarea
            v-model="remarks"
            rows="2"
            class="w-full border border-sky-100 rounded-xl px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-600/30 resize-none"
            placeholder="e.g. Retired after 30 years of service"
          ></textarea>
        </div>

        <p v-if="error" class="text-rose-600 text-xs font-medium">{{ error }}</p>

        <div class="flex gap-2 pt-2">
          <button
            type="button"
            @click="handleClose"
            class="flex-1 bg-white border border-sky-100 text-navy px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-sky transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="flex-1 bg-rose-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-rose-700 transition-colors disabled:opacity-50"
          >
            {{ submitting ? 'Saving...' : 'Confirm Retirement' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import api from '@/api/axios'

const props = defineProps({
  show: Boolean,
  employeeId: [String, Number],
  employee: Object,
})

const emit = defineEmits(['close', 'updated'])

const retirementType = ref('')
const effectiveDate = ref(new Date().toISOString().split('T')[0])
const remarks = ref('')
const error = ref('')
const submitting = ref(false)

// Reset form each time the modal is opened
watch(
  () => props.show,
  (val) => {
    if (val) {
      retirementType.value = ''
      effectiveDate.value = new Date().toISOString().split('T')[0]
      remarks.value = ''
      error.value = ''
    }
  }
)

function handleClose() {
  emit('close')
}

async function handleSubmit() {
  submitting.value = true
  error.value = ''
  try {
    await api.post(`/employees/${props.employeeId}/retire`, {
      retirement_type: retirementType.value,
      effective_date: effectiveDate.value,
      remarks: remarks.value || null,
    })
    emit('updated')
    emit('close')
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to process retirement.'
  } finally {
    submitting.value = false
  }
}
</script>
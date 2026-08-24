<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-navy/20 backdrop-blur-sm p-4"
  >
    <div class="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl border border-sky-100">
      <h2 class="font-serif text-lg font-semibold text-navy-deep mb-4">
        {{ isAdmin ? 'Admin Paper Entry' : 'Apply for Leave' }}
      </h2>

      <form @submit.prevent="submitApplication" class="space-y-4">
        <!-- Leave Type -->
        <div>
          <label class="block text-[10.5px] uppercase font-bold text-slate-400 mb-1"
            >Leave Type</label
          >
          <select
            v-model="form.leave_configuration_id"
            class="w-full border border-sky-100 rounded-lg p-2.5 text-sm"
            required
          >
            <option value="" disabled>Select Leave Type</option>
            <option v-for="config in leaveTypes" :key="config.id" :value="config.id">
              {{ config.name }}
            </option>
          </select>
        </div>

        <!-- Date Range -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-[10.5px] uppercase font-bold text-slate-400 mb-1"
              >Start Date</label
            >
            <input
              type="date"
              v-model="form.start_date"
              class="w-full border border-sky-100 rounded-lg p-2 text-sm"
              required
            />
          </div>
          <div>
            <label class="block text-[10.5px] uppercase font-bold text-slate-400 mb-1"
              >End Date</label
            >
            <input
              type="date"
              v-model="form.end_date"
              class="w-full border border-sky-100 rounded-lg p-2 text-sm"
              required
            />
          </div>
        </div>

        <!-- Reason -->
        <div>
          <label class="block text-[10.5px] uppercase font-bold text-slate-400 mb-1">Reason</label>
          <textarea
            v-model="form.reason"
            class="w-full border border-sky-100 rounded-lg p-2.5 text-sm"
            rows="3"
            required
          ></textarea>
        </div>

        <!-- Admin Paper Toggle -->
        <div v-if="isAdmin" class="flex items-center gap-2 py-2">
          <input
            type="checkbox"
            v-model="form.is_paper_submission"
            id="paper-check"
            class="rounded text-navy border-sky-100"
          />
          <label for="paper-check" class="text-sm font-semibold text-navy cursor-pointer">
            Mark as Paper-Based Submission
          </label>
        </div>

        <div class="flex justify-end gap-2 mt-6">
          <!-- <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm text-slate-500 hover:text-navy"
          >
            Cancel
          </button> -->
          <button
            type="button"
            @click="close"
            class="px-4 py-2 text-sm text-slate-500 hover:text-navy"
          >
            Cancel
          </button>
          <!-- <button
            type="submit"
            class="px-4 py-2 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-navy-deep transition-colors"
          >
            {{ form.is_paper_submission ? 'Post Paper Entry' : 'Submit Application' }}
          </button> -->
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-4 py-2 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-navy-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{
              isSubmitting
                ? 'Submitting...'
                : form.is_paper_submission
                ? 'Post Paper Entry'
                : 'Submit Application'
            }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import api from '@/api/axios'

const props = defineProps(['show', 'employeeId', 'leaveTypes', 'leaveCredits', 'isAdmin'])
const emit = defineEmits(['close', 'updated'])
const isSubmitting = ref(false)

const form = ref({
  leave_configuration_id: '',
  start_date: '',
  end_date: '',
  reason: '',
  is_paper_submission: false,
})

const daysApplied = computed(() => {
  if (!form.value.start_date || !form.value.end_date) return 0
  const start = new Date(form.value.start_date)
  const end = new Date(form.value.end_date)
  const diffTime = Math.abs(end - start)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
})
const selectedConfig = computed(() =>
  (props.leaveTypes || []).find((c) => c.id === form.value.leave_configuration_id)
)

watch(
  [() => form.value.leave_configuration_id, () => form.value.start_date],
  ([configId, startDate]) => {
    if (!configId || !startDate) return
    if (selectedConfig.value?.grant_type !== 'event_manual') return

    const year = new Date(startDate).getFullYear()
    const credit = (props.leaveCredits || []).find(
      (c) => c.code === selectedConfig.value?.code && Number(c.year) === year
    )
    if (!credit) return

    const grantedDays = Number(credit.remaining_balance)
    if (!grantedDays || grantedDays <= 0) return

    const start = new Date(startDate)
    const end = new Date(start)
    end.setDate(end.getDate() + (grantedDays - 1))

    form.value.end_date = end.toISOString().split('T')[0]
  }
)

// async function submitApplication() {
//   try {
//     await api.post(`/leave-applications`, {
//       ...form.value,
//       days_applied: daysApplied.value,
//       employee_id: props.employeeId,
//     })

//     emit('updated')
//     emit('close')

//     // Reset form...
//     form.value = {
//       leave_configuration_id: '',
//       start_date: '',
//       end_date: '',
//       reason: '',
//       is_paper_submission: false,
//     }
//   } catch (error) {
//     // Let's inspect the entire response object in the console
//     console.log('Full Error Object:', error)

//     if (error.response) {
//       // This will print the raw data from the server to your console
//       console.log('Server Response Data:', error.response.data)

//       // Attempt to show the error more gracefully
//       const errorMessage =
//         error.response.data.message ||
//         JSON.stringify(error.response.data.errors) ||
//         'Unknown validation error'
//       alert('Failed: ' + errorMessage)
//     } else {
//       alert('Network error or server unreachable')
//     }
//   }
// }
async function submitApplication() {
  if (isSubmitting.value) return
  isSubmitting.value = true
  try {
    await api.post(`/leave-applications`, {
      ...form.value,
      days_applied: daysApplied.value,
      employee_id: props.employeeId,
    })

    emit('updated')
    close()
  } catch (error) {
    console.log('Full Error Object:', error)

    if (error.response) {
      console.log('Server Response Data:', error.response.data)
      const errorMessage =
        error.response.data.message ||
        JSON.stringify(error.response.data.errors) ||
        'Unknown validation error'
      alert('Failed: ' + errorMessage)
    } else {
      alert('Network error or server unreachable')
    }
  } finally {
    isSubmitting.value = false
  }
}
function close() {
  form.value = {
    leave_configuration_id: '',
    start_date: '',
    end_date: '',
    reason: '',
    is_paper_submission: false,
  }
  emit('close')
}
</script>
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
            {{ form.is_paper_submission ? 'Post Paper Entry' : 'Submit Application' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import api from '@/api/axios'

const props = defineProps(['show', 'employeeId', 'leaveTypes', 'isAdmin'])
const emit = defineEmits(['close', 'updated'])

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

// async function submitApplication() {
//   try {
//     await api.post(`/leave-applications`, {
//       ...form.value,
//       days_applied: daysApplied.value,
//       employee_id: props.employeeId,
//     })

//     emit('updated')
//     emit('close')

//     form.value = {
//       leave_configuration_id: '',
//       start_date: '',
//       end_date: '',
//       reason: '',
//       is_paper_submission: false,
//     }
//   } catch (error) {
//     console.error('Failed to submit leave:', error)
//   }
// }
async function submitApplication() {
  try {
    await api.post(`/leave-applications`, {
      ...form.value,
      days_applied: daysApplied.value,
      employee_id: props.employeeId,
    })

    emit('updated')
    emit('close')
    // Reset form...
  } catch (error) {
    // Let's inspect the entire response object in the console
    console.log('Full Error Object:', error)

    if (error.response) {
      // This will print the raw data from the server to your console
      console.log('Server Response Data:', error.response.data)

      // Attempt to show the error more gracefully
      const errorMessage =
        error.response.data.message ||
        JSON.stringify(error.response.data.errors) ||
        'Unknown validation error'
      alert('Failed: ' + errorMessage)
    } else {
      alert('Network error or server unreachable')
    }
  }
}
</script>
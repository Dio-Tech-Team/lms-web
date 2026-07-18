<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-navy-deep/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  >
    <div class="bg-white rounded-3xl shadow-xl w-full max-w-md p-7">
      <div class="flex items-center justify-between mb-6">
        <h2 class="font-serif text-xl font-semibold text-navy-deep">Update Employment Status</h2>
        <button
          @click="$emit('close')"
          class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-sky hover:text-navy transition-colors text-lg"
        >
          ✕
        </button>
      </div>

      <div
        v-if="promotionError"
        class="bg-rose-tint border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-5 text-sm"
      >
        {{ promotionError }}
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">Previous Position</label>
            <input
              v-model="form.previous_position"
              type="text"
              class="w-full border border-sky-100 bg-sky rounded-xl px-3.5 py-2.5 text-sm text-slate-500 cursor-not-allowed"
              readonly
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">New Position</label>
            <input
              v-model="form.new_position"
              type="text"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5"
              >New Employment Status</label
            >
            <select
              v-model="form.new_employment_status"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              required
            >
              <option value="permanent">Permanent</option>
              <option value="casual">Casual</option>
              <option value="elected">Elected</option>
              <option value="job_order">Job Order</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">Effective Date</label>
            <input
              v-model="form.effective_date"
              type="date"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              required
            />
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-7">
          <button
            type="button"
            @click="$emit('close')"
            class="px-5 py-2.5 text-sm font-semibold text-navy border border-sky-100 rounded-xl hover:bg-sky transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="px-5 py-2.5 text-sm font-semibold bg-teal-600 text-white rounded-xl hover:bg-[#256F63] transition-colors disabled:opacity-50"
          >
            {{ submitting ? 'Saving...' : 'Save History Record' }}
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
  show: { type: Boolean, default: false },
  employeeId: { type: [String, Number], required: true },
  employee: { type: Object, default: null },
})

const emit = defineEmits(['close', 'updated'])

const submitting = ref(false)
const promotionError = ref('')

const form = ref({
  previous_position: '',
  new_position: '',
  previous_employment_status: '',
  new_employment_status: '',
  effective_date: '',
})

// Pre-fill previous position/status from the current employee whenever
// the modal opens — same effect as the original openPromotionModal().
watch(
  () => props.show,
  (visible) => {
    if (visible && props.employee) {
      form.value = {
        previous_position: props.employee.position,
        new_position: props.employee.position,
        previous_employment_status: props.employee.employment_status,
        new_employment_status: props.employee.employment_status,
        effective_date: '',
      }
      promotionError.value = ''
    }
  }
)

async function handleSubmit() {
  submitting.value = true
  promotionError.value = ''
  try {
    await api.post(`/employees/${props.employeeId}/promotions`, form.value)
    emit('updated')
    emit('close')
  } catch (err) {
    promotionError.value =
      err.response?.data?.message || 'Failed to capture entry in history relation'
  } finally {
    submitting.value = false
  }
}
</script>
<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-navy-deep/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  >
    <div class="bg-white rounded-3xl shadow-xl w-full max-w-md p-7">
      <div class="flex items-center justify-between mb-6">
        <h2 class="font-serif text-xl font-semibold text-navy-deep">Rehire Employee</h2>
        <button
          @click="$emit('close')"
          class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-sky hover:text-navy transition-colors text-lg"
        >
          ✕
        </button>
      </div>

      <div
        v-if="rehireError"
        class="bg-rose-tint border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-5 text-sm"
      >
        {{ rehireError }}
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <!-- <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">Position</label>
            <input
              v-model="form.position"
              type="text"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              required
            />
          </div> -->
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">Position</label>
            <select
              v-model="form.position"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              required
            >
              <option v-for="pos in positions" :key="pos.id" :value="pos.title">
                {{ pos.title }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">Employment Status</label>
            <select
              v-model="form.employment_status"
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
            <label class="block text-sm font-medium text-navy-deep mb-1.5">Department</label>
            <select
              v-model="form.department_id"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            >
              <option :value="null">Keep current department</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
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
          <div v-if="form.employment_status === 'casual'">
            <label class="block text-sm font-medium text-navy-deep mb-1.5">
              Appointment End <span class="text-rose-600">*</span>
            </label>
            <input
              v-model="form.appointment_end"
              type="date"
              :min="form.effective_date"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              required
            />
            <p class="text-xs text-slate-400 mt-1">
              Pre-filled as 6 months; change it to match the appointment paper.
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5"
              >Remarks (optional)</label
            >
            <textarea
              v-model="form.remarks"
              rows="2"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              placeholder="Rehired"
            ></textarea>
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
            {{ submitting ? 'Saving...' : 'Confirm Rehire' }}
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
  departments: { type: Array, default: () => [] },
  positions: { type: Array, default: () => [] },
})

const emit = defineEmits(['close', 'updated'])

const submitting = ref(false)
const rehireError = ref('')

const form = ref({
  position: '',
  employment_status: 'permanent',
  department_id: null,
  effective_date: '',
  remarks: '',
})

watch(
  () => props.show,
  (visible) => {
    if (visible && props.employee) {
      form.value = {
        position: props.employee.position || '',
        employment_status: 'permanent',
        department_id: null,
        effective_date: toYmd(new Date()),
        remarks: '',
        appointment_end: '',
      }
      rehireError.value = ''
    }
  }
)

// Local date as YYYY-MM-DD (toISOString is UTC and can land on yesterday)
function toYmd(dt) {
  const p = (n) => String(n).padStart(2, '0')
  return `${dt.getFullYear()}-${p(dt.getMonth() + 1)}-${p(dt.getDate())}`
}

// Casual: pre-fill 6 months from the effective date (Jul 1 → Dec 31)
watch(
  () => [form.value.employment_status, form.value.effective_date],
  ([status, start]) => {
    if (status !== 'casual' || !start) return
    const [y, m, d] = start.split('-').map(Number)
    form.value.appointment_end = toYmd(new Date(y, m - 1 + 6, d - 1))
  }
)

async function handleSubmit() {
  submitting.value = true
  rehireError.value = ''
  try {
    const payload = { ...form.value }
    if (!payload.department_id) delete payload.department_id
    if (payload.employment_status !== 'casual') delete payload.appointment_end
    await api.post(`/employees/${props.employeeId}/rehire`, payload)
    emit('updated')
    emit('close')
  } catch (err) {
    rehireError.value = err.response?.data?.message || 'Failed to process rehire.'
  } finally {
    submitting.value = false
  }
}
</script>
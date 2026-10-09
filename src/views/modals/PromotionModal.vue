<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-navy-deep/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  >
    <div class="bg-white rounded-3xl shadow-xl w-full max-w-md p-7">
      <div class="flex items-center justify-between mb-2">
        <h2 class="font-serif text-xl font-semibold text-navy-deep">Add Employment Record</h2>
        <button
          @click="$emit('close')"
          class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-sky hover:text-navy transition-colors text-lg"
        >
          ✕
        </button>
      </div>
      <p class="text-xs text-slate-500 mb-6">
        For a new change, use today's date. To add an earlier record from the employee's paper file,
        use its past date. Only the most recent record updates the current position.
      </p>

      <div
        v-if="promotionError"
        class="bg-rose-tint border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-5 text-sm"
      >
        {{ promotionError }}
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">Effective Date</label>
            <input
              v-model="form.effective_date"
              type="date"
              :max="today"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">Previous Position</label>
            <input
              :value="
                form.previous_position ||
                (form.effective_date ? 'None — earliest record' : 'Pick a date first')
              "
              type="text"
              class="w-full border border-sky-100 bg-sky rounded-xl px-3.5 py-2.5 text-sm text-slate-500 cursor-not-allowed"
              readonly
            />
            <p class="text-[11px] text-slate-400 mt-1">Filled from the record before this date.</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">New Position</label>
            <div class="relative position-dropdown">
              <button
                type="button"
                @click="isPositionOpen = !isPositionOpen"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm text-left focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors flex justify-between items-center"
              >
                <span :class="form.new_position ? 'text-navy-deep' : 'text-slate-400'">
                  {{ form.new_position || 'Select position' }}
                </span>
                <span
                  class="text-slate-400 text-xs transition-transform"
                  :class="{ 'rotate-180': isPositionOpen }"
                  >▾</span
                >
              </button>

              <ul
                v-if="isPositionOpen"
                class="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-sky-100 rounded-xl shadow-lg py-1"
              >
                <li
                  v-for="pos in positions"
                  :key="pos.id"
                  @click="selectPosition(pos.title)"
                  class="px-3.5 py-2 text-sm cursor-pointer hover:bg-sky transition-colors"
                  :class="{
                    'bg-sky/60 font-medium text-navy-deep': form.new_position === pos.title,
                  }"
                >
                  {{ pos.title }}
                </li>
              </ul>
            </div>
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
              <option value="resigned">Resigned (past only)</option>
            </select>

            <p v-if="resignedTooLate" class="text-[11px] text-rose-600 mt-1">
              A past resignation must be dated before {{ latestDate }}. For a current resignation,
              use the Resign button.
            </p>
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
            :disabled="submitting || !form.new_position || resignedTooLate"
            class="px-5 py-2.5 text-sm font-semibold bg-teal-600 text-white rounded-xl hover:bg-[#256F63] transition-colors disabled:opacity-50"
          >
            {{ submitting ? 'Saving...' : 'Save Record' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import api from '@/api/axios'

const props = defineProps({
  show: { type: Boolean, default: false },
  employeeId: { type: [String, Number], required: true },
  employee: { type: Object, default: null },
  positions: { type: Array, default: () => [] },
})

const emit = defineEmits(['close', 'updated'])

const submitting = ref(false)
const promotionError = ref('')
const isPositionOpen = ref(false)

// Local date as YYYY-MM-DD (not toISOString, which is UTC and can be a day behind in PH)
const today = new Date().toLocaleDateString('en-CA')

const form = ref({
  previous_position: '',
  new_position: '',
  previous_employment_status: '',
  new_employment_status: '',
  effective_date: '',
})

function selectPosition(title) {
  form.value.new_position = title
  isPositionOpen.value = false
}

function handleClickOutside(e) {
  if (isPositionOpen.value && !e.target.closest('.position-dropdown')) {
    isPositionOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))

// The record in effect just before a date. History arrives newest first,
// so the first match is the closest earlier one.
function recordBefore(date) {
  const history = props.employee?.employment_history || []
  return history.find((h) => String(h.effective_date || '').split('T')[0] < date) || null
}
// Newest record's date (history arrives newest first)
const latestDate = computed(
  () => String(props.employee?.employment_history?.[0]?.effective_date || '').split('T')[0]
)

// Resigned is history-only: it must be older than the latest record
const resignedTooLate = computed(
  () =>
    form.value.new_employment_status === 'resigned' &&
    !!form.value.effective_date &&
    form.value.effective_date >= latestDate.value
)

watch(
  () => props.show,
  (visible) => {
    if (visible && props.employee) {
      form.value = {
        previous_position: '',
        new_position: props.employee.position,
        previous_employment_status: '',
        new_employment_status: props.employee.employment_status,
        effective_date: '',
      }
      promotionError.value = ''
      isPositionOpen.value = false
    }
  }
)

// Previous position/status follow the chosen date
watch(
  () => form.value.effective_date,
  (date) => {
    const prev = date ? recordBefore(date) : null
    form.value.previous_position = prev?.new_position || ''
    form.value.previous_employment_status = prev?.new_employment_status || ''
  }
)

async function handleSubmit() {
  submitting.value = true
  promotionError.value = ''
  try {
    await api.post(`/employees/${props.employeeId}/promotions`, {
      ...form.value,
      previous_position: form.value.previous_position || null,
      previous_employment_status: form.value.previous_employment_status || null,
    })
    emit('updated')
    emit('close')
  } catch (err) {
    promotionError.value = err.response?.data?.message || 'Failed to save the employment record.'
  } finally {
    submitting.value = false
  }
}
</script>
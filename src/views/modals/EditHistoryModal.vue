<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-navy-deep/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  >
    <div class="bg-white rounded-3xl shadow-xl w-full max-w-md p-7">
      <div class="flex items-center justify-between mb-1">
        <h2 class="font-serif text-xl font-semibold text-navy-deep">Edit Employment History</h2>
        <button
          @click="$emit('close')"
          class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-sky hover:text-navy transition-colors text-lg"
        >
          ✕
        </button>
      </div>
      <p class="text-xs text-amber-600 mb-6">
        ⚠ Editing Previous Position or New Position on older records may shift this employee's step
        increment calculation. Effective Date changes can too.
      </p>

      <div
        v-if="error"
        class="bg-rose-tint border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-5 text-sm"
      >
        {{ error }}
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">Previous Position</label>
            <input
              v-model="form.previous_position"
              type="text"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            />
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
            <label class="block text-sm font-medium text-navy-deep mb-1.5">Employment Status</label>
            <select
              v-model="form.new_employment_status"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              required
            >
              <option value="permanent">Permanent</option>
              <option value="casual">Casual</option>
              <option value="elected">Elected</option>
              <option value="job_order">Job Order</option>
              <option value="resigned">Resigned</option>
              <option value="retired">Retired</option>
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

          <!-- <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">Remarks</label>
            <textarea
              v-model="form.remarks"
              rows="2"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            ></textarea>
          </div> -->
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
            {{ submitting ? 'Saving...' : 'Save Correction' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import api from '@/api/axios'

const props = defineProps({
  show: { type: Boolean, default: false },
  employeeId: { type: [String, Number], required: true },
  record: { type: Object, default: null },
  positions: { type: Array, default: () => [] },
})

const emit = defineEmits(['close', 'updated'])

const submitting = ref(false)
const error = ref('')
const isPositionOpen = ref(false)

const form = ref({
  previous_position: '',
  new_position: '',
  previous_employment_status: '',
  new_employment_status: '',
  effective_date: '',
  //   remarks: '',
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

// Pre-fill from the record being corrected, not from the current employee —
// unlike PromotionModal, this edits history as it actually happened.
watch(
  () => props.show,
  (visible) => {
    if (visible && props.record) {
      form.value = {
        previous_position: props.record.previous_position || '',
        new_position: props.record.new_position || '',
        previous_employment_status: props.record.previous_employment_status || '',
        new_employment_status: props.record.new_employment_status || '',
        effective_date: props.record.effective_date?.includes('T')
          ? props.record.effective_date.split('T')[0]
          : props.record.effective_date || '',
        // remarks: props.record.remarks || '',
      }
      error.value = ''
      isPositionOpen.value = false
    }
  }
)

async function handleSubmit() {
  submitting.value = true
  error.value = ''
  try {
    await api.put(`/employees/${props.employeeId}/promotions/${props.record.id}`, form.value)
    emit('updated')
    emit('close')
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to save correction'
  } finally {
    submitting.value = false
  }
}
</script>
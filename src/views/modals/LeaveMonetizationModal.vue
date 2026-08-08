<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-navy/20 backdrop-blur-sm p-4"
  >
    <div class="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl border border-sky-100">
      <h2 class="font-serif text-lg font-semibold text-navy-deep mb-4">File Monetization</h2>

      <form @submit.prevent="submit" class="space-y-4">
        <!-- Employee search -->
        <div class="relative">
          <label class="block text-[10.5px] uppercase font-bold text-slate-400 mb-1"
            >Employee</label
          >
          <input
            v-model="employeeSearch"
            type="text"
            placeholder="Search employee name..."
            class="w-full border border-sky-100 rounded-lg p-2.5 text-sm"
            @input="debounceSearch"
          />
          <ul
            v-if="employeeResults.length > 0"
            class="absolute z-10 w-full bg-white border border-sky-100 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg"
          >
            <li
              v-for="emp in employeeResults"
              :key="emp.id"
              @click="selectEmployee(emp)"
              class="px-3 py-2 text-sm hover:bg-sky/60 cursor-pointer"
            >
              {{ emp.first_name }} {{ emp.surname }}
            </li>
          </ul>
          <p v-if="form.employee_id" class="text-xs text-teal-700 font-semibold mt-1">
            Selected: {{ employeeSearch }}
          </p>
        </div>

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
            <option v-for="config in monetizableTypes" :key="config.id" :value="config.id">
              {{ config.name }}
            </option>
          </select>
        </div>

        <!-- Days -->
        <div>
          <label class="block text-[10.5px] uppercase font-bold text-slate-400 mb-1"
            >Days to Monetize</label
          >
          <input
            v-model.number="form.days_monetized"
            type="number"
            step="0.5"
            min="0.5"
            class="w-full border border-sky-100 rounded-lg p-2.5 text-sm"
            required
          />
        </div>

        <!-- Reason -->
        <div>
          <label class="block text-[10.5px] uppercase font-bold text-slate-400 mb-1">Reason</label>
          <textarea
            v-model="form.reason"
            class="w-full border border-sky-100 rounded-lg p-2.5 text-sm"
            rows="3"
          ></textarea>
        </div>

        <div class="flex justify-end gap-2 mt-6">
          <button
            type="button"
            @click="close"
            class="px-4 py-2 text-sm text-slate-500 hover:text-navy"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="!form.employee_id"
            class="px-4 py-2 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-navy-deep transition-colors disabled:opacity-40"
          >
            File & Approve
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import api from '@/api/axios'

const props = defineProps(['show'])
const emit = defineEmits(['close', 'updated'])

const form = ref({
  employee_id: '',
  leave_configuration_id: '',
  days_monetized: '',
  reason: '',
})

const employeeSearch = ref('')
const employeeResults = ref([])
const leaveTypes = ref([])
let searchTimeout = null

const monetizableTypes = computed(() => leaveTypes.value.filter((t) => t.can_monetize))

function debounceSearch() {
  form.value.employee_id = '' // clear selection while typing a new search
  clearTimeout(searchTimeout)
  if (!employeeSearch.value) {
    employeeResults.value = []
    return
  }
  searchTimeout = setTimeout(async () => {
    try {
      const res = await api.get(`/employees?search=${employeeSearch.value}`)
      employeeResults.value = res.data.data
    } catch (err) {
      console.error('Employee search failed:', err)
    }
  }, 400)
}

function selectEmployee(emp) {
  form.value.employee_id = emp.id
  employeeSearch.value = `${emp.first_name} ${emp.surname}`
  employeeResults.value = []
}

async function submit() {
  try {
    await api.post('/leave-monetizations', { ...form.value })
    emit('updated')
    close()
  } catch (error) {
    const msg = error.response?.data?.message || 'Failed to file monetization'
    alert(msg)
  }
}

function close() {
  form.value = { employee_id: '', leave_configuration_id: '', days_monetized: '', reason: '' }
  employeeSearch.value = ''
  employeeResults.value = []
  emit('close')
}

watch(
  () => props.show,
  async (val) => {
    if (val && leaveTypes.value.length === 0) {
      try {
        const res = await api.get('/leave-configurations?active_only=true')
        leaveTypes.value = res.data
      } catch (err) {
        console.error('Failed to load leave types:', err)
      }
    }
  }
)
</script>
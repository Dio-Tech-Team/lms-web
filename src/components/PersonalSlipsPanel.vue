<template>
  <div>
    <!-- Record form -->
    <div class="bg-white rounded-2xl border border-sky-100 p-6 mb-6">
      <h2 class="font-serif text-lg font-semibold text-navy-deep mb-1">Record Personal Slip</h2>
      <p class="text-sm text-slate-500 mb-5">
        Time away is converted with the CSC table and deducted from VL immediately.
      </p>

      <div
        v-if="formError"
        class="bg-rose-tint border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-5 text-sm"
      >
        {{ formError }}
      </div>
      <div
        v-if="formSuccess"
        class="bg-teal-50 border border-teal-200 text-teal-700 px-4 py-3 rounded-xl mb-5 text-sm"
      >
        {{ formSuccess }}
      </div>

      <form @submit.prevent="submit">
        <div class="grid grid-cols-2 gap-4 mb-5">
          <div class="col-span-2 relative employee-picker">
            <label class="block text-sm font-medium text-navy-deep mb-1.5"
              >Employee<span class="text-rose-500">*</span></label
            >
            <div
              v-if="selectedEmployee"
              class="flex items-center justify-between border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm"
            >
              <span class="text-navy-deep font-semibold">
                {{ fullName(selectedEmployee) }}
                <span class="font-mono font-normal text-slate-400 ml-2">{{
                  selectedEmployee.id_number
                }}</span>
              </span>
              <button
                type="button"
                @click="clearEmployee"
                class="text-xs text-teal-700 font-semibold hover:underline"
              >
                Change
              </button>
            </div>
            <template v-else>
              <input
                v-model="employeeQuery"
                type="text"
                placeholder="Search name or ID number..."
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              />
              <ul
                v-if="employeeResults.length"
                class="absolute z-10 mt-1 w-full bg-white border border-sky-100 rounded-xl shadow-lg max-h-56 overflow-y-auto py-1"
              >
                <li
                  v-for="e in employeeResults"
                  :key="e.id"
                  @click="pickEmployee(e)"
                  class="px-3.5 py-2 text-sm cursor-pointer hover:bg-sky transition-colors flex justify-between"
                >
                  <span class="text-navy-deep">{{ fullName(e) }}</span>
                  <span class="text-slate-400 text-[12.5px]">{{ e.department_name }}</span>
                </li>
              </ul>
            </template>
          </div>

          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5"
              >Date<span class="text-rose-500">*</span></label
            >
            <input
              v-model="form.date"
              type="date"
              :max="today"
              required
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">Reason</label>
            <input
              v-model="form.reason"
              type="text"
              maxlength="255"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5"
              >Time Out<span class="text-rose-500">*</span></label
            >
            <input
              v-model="form.time_out"
              type="time"
              required
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5"
              >Time In<span class="text-rose-500">*</span></label
            >
            <input
              v-model="form.time_in"
              type="time"
              required
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            />
          </div>
        </div>

        <div class="flex items-center gap-4">
          <button
            type="submit"
            :disabled="saving || !selectedEmployee || minutes <= 0"
            class="bg-navy text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-navy-deep transition-colors disabled:opacity-50"
          >
            {{ saving ? 'Saving...' : 'Record Slip' }}
          </button>
          <span v-if="minutes > 0" class="text-sm text-slate-500">
            {{ formatDuration(minutes) }} away
          </span>
          <span v-else-if="form.time_out && form.time_in" class="text-sm text-rose-600">
            Time in must be after time out
          </span>
        </div>
      </form>
    </div>

    <!-- List -->
    <div class="bg-white rounded-2xl border border-sky-100 p-6">
      <h2 class="font-serif text-lg font-semibold text-navy-deep mb-5">
        Recorded Slips
        <span v-if="slips.length" class="font-sans font-normal text-sm text-slate-400 ml-1"
          >({{ slips.length }})</span
        >
      </h2>

      <div class="grid grid-cols-3 gap-4 mb-5">
        <div>
          <label class="block text-sm font-medium text-navy-deep mb-1.5">Search Employee</label>
          <input
            v-model="filter.search"
            type="text"
            placeholder="Name..."
            class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-navy-deep mb-1.5">Month</label>
          <select
            v-model="filter.month"
            class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
          >
            <option value="">All Months</option>
            <option v-for="(name, num) in months" :key="num" :value="num">{{ name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-navy-deep mb-1.5">Year</label>
          <select
            v-model="filter.year"
            class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
          >
            <option value="">All Years</option>
            <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="flex items-center justify-center gap-3 py-10">
        <div
          class="w-6 h-6 border-[3px] border-teal-600 border-t-transparent rounded-full animate-spin"
        ></div>
        <span class="text-slate-500 text-sm">Loading slips...</span>
      </div>

      <div
        v-else-if="slips.length"
        class="max-h-[28rem] overflow-y-auto rounded-xl border border-sky-100"
      >
        <table class="w-full text-sm">
          <thead class="bg-sky border-b border-sky-100 sticky top-0 z-10">
            <tr>
              <th
                v-for="col in [
                  'Employee',
                  'Date',
                  'Out',
                  'In',
                  'Duration',
                  'VL Deducted',
                  'LWOP',
                  'Reason',
                  '',
                ]"
                :key="col"
                class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold whitespace-nowrap"
              >
                {{ col }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="s in slips"
              :key="s.id"
              class="border-b border-sky-100 last:border-b-0 transition-colors"
              :class="s.status === 'cancelled' ? 'opacity-50' : 'hover:bg-sky/40'"
            >
              <td class="px-4 py-3.5 font-semibold text-navy-deep whitespace-nowrap">
                {{ fullName(s.employee) }}
              </td>
              <td class="px-4 py-3.5 font-mono text-[12.5px] text-slate-500 whitespace-nowrap">
                {{ s.date }}
              </td>
              <td class="px-4 py-3.5 font-mono text-[12.5px] text-slate-500">
                {{ s.time_out?.slice(0, 5) }}
              </td>
              <td class="px-4 py-3.5 font-mono text-[12.5px] text-slate-500">
                {{ s.time_in?.slice(0, 5) }}
              </td>
              <td class="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                {{ formatDuration(s.minutes) }}
              </td>
              <td class="px-4 py-3.5 font-mono text-[13px] text-rose-600">
                {{ (s.equivalent_days - s.lwop_days).toFixed(3) }}
              </td>
              <td
                class="px-4 py-3.5 font-mono text-[13px]"
                :class="s.lwop_days > 0 ? 'text-rose-600 font-semibold' : 'text-slate-400'"
              >
                {{ Number(s.lwop_days).toFixed(3) }}
              </td>
              <td class="px-4 py-3.5 text-slate-600">{{ s.reason || '—' }}</td>
              <td class="px-4 py-3.5 text-right whitespace-nowrap">
                <span v-if="s.status === 'cancelled'" class="text-xs text-slate-400 font-semibold"
                  >Cancelled</span
                >
                <button
                  v-else
                  @click="cancelSlip(s)"
                  :disabled="cancellingId === s.id"
                  class="text-xs text-rose-600 hover:text-rose-700 font-semibold disabled:opacity-40"
                >
                  {{ cancellingId === s.id ? 'Cancelling...' : 'Cancel' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-else class="text-sm text-slate-400 italic py-8 text-center">
        No slips recorded for this period.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useConfirm } from '@/composables/useConfirm'
import api from '@/api/axios'

const props = defineProps({
  months: { type: Object, required: true },
  availableYears: { type: Array, required: true },
})

const { confirm } = useConfirm()

const d = new Date()
const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
  d.getDate()
).padStart(2, '0')}`

const emptyForm = () => ({ date: today, time_out: '', time_in: '', reason: '' })

const form = ref(emptyForm())
const selectedEmployee = ref(null)
const employeeQuery = ref('')
const employeeResults = ref([])
const saving = ref(false)
const formError = ref('')
const formSuccess = ref('')

const slips = ref([])
const loading = ref(false)
const cancellingId = ref(null)
const filter = ref({ search: '', month: '', year: props.availableYears[0] })

const fullName = (e) => (e ? `${e.surname}, ${e.first_name}` : '')

function formatDuration(mins) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return [h ? `${h}h` : '', m ? `${m}m` : ''].filter(Boolean).join(' ') || '0m'
}

const minutes = computed(() => {
  if (!form.value.time_out || !form.value.time_in) return 0
  const [oh, om] = form.value.time_out.split(':').map(Number)
  const [ih, im] = form.value.time_in.split(':').map(Number)
  return ih * 60 + im - (oh * 60 + om)
})

// Employee search — reuses the Employees list endpoint
let employeeTimer = null
watch(employeeQuery, (q) => {
  clearTimeout(employeeTimer)
  if (!q.trim()) {
    employeeResults.value = []
    return
  }
  employeeTimer = setTimeout(async () => {
    try {
      const res = await api.get('employees', { params: { search: q } })
      // JO and inactive employees have no VL — the backend rejects them anyway
      employeeResults.value = res.data.data.filter(
        (e) => e.is_active && e.employment_status !== 'job_order'
      )
    } catch (err) {
      console.error('Employee search failed:', err)
    }
  }, 300)
})

function pickEmployee(e) {
  selectedEmployee.value = e
  employeeQuery.value = ''
  employeeResults.value = []
}

function clearEmployee() {
  selectedEmployee.value = null
}

async function submit() {
  formError.value = ''
  formSuccess.value = ''

  const name = fullName(selectedEmployee.value)
  const ok = await confirm({
    title: 'Record personal slip?',
    message: `${formatDuration(minutes.value)} will be deducted from ${name}'s VL balance.`,
  })
  if (!ok) return

  saving.value = true
  try {
    const res = await api.post('slips', {
      employee_id: selectedEmployee.value.id,
      ...form.value,
    })
    const slip = res.data.slip
    formSuccess.value = `Recorded for ${name} — ${Number(slip.equivalent_days).toFixed(
      3
    )} day(s) deducted from VL${slip.lwop_days > 0 ? `, ${slip.lwop_days} as LWOP` : ''}.`
    form.value = emptyForm()
    selectedEmployee.value = null
    await fetchSlips()
  } catch (err) {
    formError.value = err.response?.data?.message || 'Failed to record slip.'
  } finally {
    saving.value = false
  }
}

async function fetchSlips() {
  loading.value = true
  try {
    const params = {}
    if (filter.value.search) params.search = filter.value.search
    if (filter.value.month) params.month = filter.value.month
    if (filter.value.year) params.year = filter.value.year
    const res = await api.get('slips', { params })
    slips.value = res.data
  } catch (err) {
    console.error('Failed to fetch slips:', err)
  } finally {
    loading.value = false
  }
}

let filterTimer = null
watch(
  filter,
  () => {
    clearTimeout(filterTimer)
    filterTimer = setTimeout(fetchSlips, 350)
  },
  { deep: true }
)

async function cancelSlip(s) {
  const ok = await confirm({
    title: 'Cancel this slip?',
    message: `The VL deducted for ${fullName(s.employee)} on ${s.date} will be restored.`,
  })
  if (!ok) return

  cancellingId.value = s.id
  try {
    await api.post(`slips/${s.id}/cancel`)
    await fetchSlips()
  } catch (err) {
    formError.value = err.response?.data?.message || 'Failed to cancel slip.'
  } finally {
    cancellingId.value = null
  }
}

onMounted(fetchSlips)
</script>
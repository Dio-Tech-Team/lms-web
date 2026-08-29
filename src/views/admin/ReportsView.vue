<template>
  <div>
    <div
      v-if="errorMessage"
      class="bg-rose-tint text-rose-700 text-sm rounded-lg px-3.5 py-2.5 mb-4 font-medium flex items-center justify-between"
    >
      {{ errorMessage }}
      <button @click="errorMessage = ''" class="text-rose-700 font-bold hover:text-rose-800 ml-3">
        ✕
      </button>
    </div>

    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-700">Reports</h1>
      <button
        @click="exportXlsx"
        :disabled="exporting || loading"
        class="px-4 py-2 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-navy-deep transition-colors disabled:opacity-40"
      >
        {{ exporting ? 'Preparing...' : 'Export to Excel' }}
      </button>
    </div>

    <!-- Report picker -->
    <div class="flex gap-2 mb-5">
      <button
        v-for="r in reports"
        :key="r.key"
        @click="selectReport(r.key)"
        :class="
          activeReport === r.key
            ? 'bg-navy text-white border-navy'
            : 'bg-white text-slate-600 border-sky-100 hover:bg-sky'
        "
        class="px-4 py-2 rounded-xl text-sm font-semibold border transition-colors"
      >
        {{ r.label }}
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-2xl border border-sky-100 p-5 mb-6">
      <div class="grid grid-cols-4 gap-4">
        <div v-if="activeReport !== 'employee-masterlist'">
          <label class="block text-sm font-medium text-navy-deep mb-1.5">Year</label>
          <input
            v-model="filters.year"
            type="number"
            class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            @change="fetchReport"
          />
        </div>

        <div v-if="activeReport === 'leave-utilization'">
          <label class="block text-sm font-medium text-navy-deep mb-1.5">Month</label>
          <select
            v-model="filters.month"
            class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            @change="fetchReport"
          >
            <option value="">Whole year</option>
            <option v-for="(m, i) in months" :key="i" :value="i + 1">{{ m }}</option>
          </select>
        </div>

        <div v-if="activeReport === 'leave-utilization'">
          <label class="block text-sm font-medium text-navy-deep mb-1.5">Leave Type</label>
          <select
            v-model="filters.leave_configuration_id"
            class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            @change="fetchReport"
          >
            <option value="">All Leave Types</option>
            <option v-for="t in leaveTypes" :key="t.id" :value="t.id">{{ t.name }}</option>
          </select>
        </div>

        <div v-if="activeReport === 'employee-masterlist'">
          <label class="block text-sm font-medium text-navy-deep mb-1.5">Employment Status</label>
          <select
            v-model="filters.employment_status"
            class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            @change="fetchReport"
          >
            <option value="">All Statuses</option>
            <option value="permanent">Permanent</option>
            <option value="casual">Casual</option>
            <option value="elected">Elected</option>
            <option value="job_order">Job Order</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-navy-deep mb-1.5">Department</label>
          <select
            v-model="filters.department_id"
            class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            @change="fetchReport"
          >
            <option value="">All Departments</option>
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
              {{ dept.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center gap-3 py-24">
      <div
        class="w-6 h-6 border-[3px] border-teal-600 border-t-transparent rounded-full animate-spin"
      ></div>
      <span class="text-slate-500 text-sm">Building report...</span>
    </div>

    <template v-else>
      <!-- Utilization summary -->
      <div
        v-if="activeReport === 'leave-utilization' && data?.summary"
        class="grid grid-cols-4 gap-4 mb-6"
      >
        <div class="bg-white rounded-2xl border border-sky-100 p-5">
          <p class="text-[10.5px] uppercase tracking-wider text-slate-400 font-bold mb-1">
            Employees on leave
          </p>
          <p class="text-2xl font-bold text-navy-deep">{{ data.summary.employees_on_leave }}</p>
        </div>
        <div class="bg-white rounded-2xl border border-sky-100 p-5">
          <p class="text-[10.5px] uppercase tracking-wider text-slate-400 font-bold mb-1">
            Leave records
          </p>
          <p class="text-2xl font-bold text-navy-deep">{{ data.summary.total_records }}</p>
        </div>
        <div class="bg-white rounded-2xl border border-sky-100 p-5">
          <p class="text-[10.5px] uppercase tracking-wider text-slate-400 font-bold mb-1">
            Days taken
          </p>
          <p class="text-2xl font-bold text-navy-deep">{{ data.summary.total_days }}</p>
        </div>
        <div class="bg-white rounded-2xl border border-sky-100 p-5">
          <p class="text-[10.5px] uppercase tracking-wider text-slate-400 font-bold mb-1">
            Without pay
          </p>
          <p class="text-2xl font-bold text-rose-600">{{ data.summary.total_no_pay_days }}</p>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-2xl border border-sky-100 overflow-hidden">
        <div
          class="flex items-center justify-between px-5 py-3.5 bg-sky/60 border-b border-sky-100"
        >
          <span class="font-semibold text-navy-deep text-sm">
            {{ data?.report || 'Report' }}
            <span v-if="data?.period || data?.year" class="text-slate-400 font-normal">
              · {{ data?.period || data?.year }}
            </span>
          </span>
          <span class="text-[12.5px] text-slate-500">{{ rows.length }} row(s)</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-sky/30 border-b border-sky-100">
              <tr>
                <th
                  v-for="col in columns"
                  :key="col"
                  class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold whitespace-nowrap"
                >
                  {{ col }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, i) in rows"
                :key="i"
                class="border-b border-sky-100 last:border-b-0 hover:bg-sky/40 transition-colors"
              >
                <!-- Balances -->
                <template v-if="activeReport === 'leave-balances'">
                  <td class="px-4 py-3 font-semibold text-navy-deep whitespace-nowrap">
                    {{ row.name }}
                  </td>
                  <td class="px-4 py-3 font-mono text-[12.5px] text-slate-500">
                    {{ row.id_number }}
                  </td>
                  <td class="px-4 py-3 text-slate-600">{{ row.department }}</td>
                  <td class="px-4 py-3 text-slate-600">{{ row.position }}</td>
                  <td class="px-4 py-3 text-slate-600">{{ row.employment_status }}</td>
                  <td
                    v-for="t in data.leave_types"
                    :key="t.code"
                    class="px-4 py-3 font-mono text-[12.5px] text-navy-deep"
                  >
                    {{ row.balances[t.code].toFixed(3) }}
                  </td>
                </template>

                <!-- Masterlist -->
                <template v-else-if="activeReport === 'employee-masterlist'">
                  <td class="px-4 py-3 font-semibold text-navy-deep whitespace-nowrap">
                    {{ row.name }}
                  </td>
                  <td class="px-4 py-3 font-mono text-[12.5px] text-slate-500">
                    {{ row.id_number }}
                  </td>
                  <td class="px-4 py-3 text-slate-600">{{ row.sex }}</td>
                  <td class="px-4 py-3 text-slate-600">{{ row.department }}</td>
                  <td class="px-4 py-3 text-slate-600">{{ row.position }}</td>
                  <td class="px-4 py-3 text-slate-600">{{ row.employment_status }}</td>
                  <td class="px-4 py-3 font-mono text-[12.5px] text-slate-500">
                    {{ row.date_hired }}
                  </td>
                  <td class="px-4 py-3 font-mono text-[12.5px] text-slate-500">
                    {{ row.contact_number }}
                  </td>
                  <td class="px-4 py-3 text-slate-600">{{ row.email }}</td>
                </template>

                <!-- Utilization -->
                <template v-else>
                  <td class="px-4 py-3 font-semibold text-navy-deep whitespace-nowrap">
                    {{ row.name }}
                  </td>
                  <td class="px-4 py-3 font-mono text-[12.5px] text-slate-500">
                    {{ row.id_number }}
                  </td>
                  <td class="px-4 py-3 text-slate-600">{{ row.department }}</td>
                  <td class="px-4 py-3">
                    <span
                      class="bg-sky-100 text-navy px-2 py-0.5 rounded-full text-[11px] font-bold font-mono"
                    >
                      {{ row.code }}
                    </span>
                  </td>
                  <td class="px-4 py-3 font-mono text-[12.5px] text-slate-500">
                    {{ row.start_date }}
                  </td>
                  <td class="px-4 py-3 font-mono text-[12.5px] text-slate-500">
                    {{ row.end_date }}
                  </td>
                  <td class="px-4 py-3 text-slate-600">{{ row.days_taken }}</td>
                  <td
                    class="px-4 py-3"
                    :class="row.no_pay_days > 0 ? 'text-rose-600 font-semibold' : 'text-slate-400'"
                  >
                    {{ row.no_pay_days }}
                  </td>
                </template>
              </tr>

              <tr v-if="rows.length === 0">
                <td :colspan="columns.length" class="px-4 py-12 text-center text-slate-400 text-sm">
                  No data for this period
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axios'

const reports = [
  { key: 'leave-balances', label: 'Leave Balances' },
  { key: 'leave-utilization', label: 'Leave Utilization' },
  { key: 'employee-masterlist', label: 'Employee Masterlist' },
]

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const activeReport = ref('leave-balances')
const data = ref(null)
const departments = ref([])
const leaveTypes = ref([])
const loading = ref(true)
const exporting = ref(false)
const errorMessage = ref('')

const filters = ref({
  year: new Date().getFullYear(),
  month: '',
  department_id: '',
  leave_configuration_id: '',
  employment_status: '',
})

const rows = computed(() => data.value?.rows ?? [])

// Balances has a column per leave type, so its header can only be built
// once the report has told us which types it included.
const columns = computed(() => {
  if (activeReport.value === 'leave-balances') {
    const base = ['Employee', 'ID Number', 'Department', 'Position', 'Status']
    return base.concat((data.value?.leave_types ?? []).map((t) => t.code))
  }

  if (activeReport.value === 'employee-masterlist') {
    return [
      'Employee',
      'ID Number',
      'Sex',
      'Department',
      'Position',
      'Status',
      'Date Hired',
      'Contact',
      'Email',
    ]
  }

  return ['Employee', 'ID Number', 'Department', 'Type', 'Start', 'End', 'Days', 'Without Pay']
})

function buildParams(extra = {}) {
  const params = new URLSearchParams()

  // Department applies to every report; the rest are report-specific, and
  // sending a filter the endpoint doesn't validate would 422.
  if (filters.value.department_id) params.append('department_id', filters.value.department_id)

  if (activeReport.value !== 'employee-masterlist' && filters.value.year) {
    params.append('year', filters.value.year)
  }

  if (activeReport.value === 'leave-utilization') {
    if (filters.value.month) params.append('month', filters.value.month)
    if (filters.value.leave_configuration_id) {
      params.append('leave_configuration_id', filters.value.leave_configuration_id)
    }
  }

  if (activeReport.value === 'employee-masterlist' && filters.value.employment_status) {
    params.append('employment_status', filters.value.employment_status)
  }

  Object.entries(extra).forEach(([k, v]) => params.append(k, v))
  return params
}

function selectReport(key) {
  activeReport.value = key
  data.value = null
  fetchReport()
}

async function fetchReport() {
  loading.value = true
  errorMessage.value = ''
  try {
    const res = await api.get(`/reports/${activeReport.value}?${buildParams()}`)
    data.value = res.data
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Failed to build report'
    data.value = null
  } finally {
    loading.value = false
  }
}

async function exportXlsx() {
  if (exporting.value) return
  exporting.value = true
  errorMessage.value = ''
  try {
    const res = await api.get(`/reports/${activeReport.value}?${buildParams({ format: 'xlsx' })}`, {
      responseType: 'blob',
    })

    // The filename the server chose is in Content-Disposition; falling back
    // to the report key keeps the download named something sensible if the
    // header is missing or stripped by a proxy.
    const disposition = res.headers['content-disposition'] || ''
    const match = disposition.match(/filename="?([^"]+)"?/)
    const filename = match ? match[1] : `${activeReport.value}.xlsx`

    const url = URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (err) {
    errorMessage.value = 'Failed to export report'
    console.error('Export failed:', err)
  } finally {
    exporting.value = false
  }
}

onMounted(async () => {
  await fetchReport()

  try {
    const deptRes = await api.get('/departments')
    departments.value = deptRes.data.data
  } catch (err) {
    console.error('Error fetching departments:', err)
  }

  try {
    const typeRes = await api.get('/leave-configurations')
    leaveTypes.value = typeRes.data
  } catch (err) {
    console.error('Error fetching leave types:', err)
  }
})
</script>
<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <!-- <p class="text-[11px] uppercase tracking-wider text-teal-600 font-bold mb-1">Leave</p> -->
        <h1 class="text-2xl font-bold text-gray-700">Leave Records</h1>
      </div>
      <button
        @click="showSummary = !showSummary"
        class="bg-white border border-sky-100 text-navy px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-sky transition-colors flex items-center gap-2"
      >
        {{ showSummary ? 'Hide Summary' : 'View Leave Summary' }}
        <span class="text-xs transition-transform" :class="showSummary ? 'rotate-180' : ''">▾</span>
      </button>
    </div>

    <!-- Summary Table -->
    <div v-if="showSummary" class="bg-white rounded-2xl border border-sky-100 p-6 mb-6">
      <div class="flex items-center justify-between mb-5">
        <h2 class="font-serif text-lg font-semibold text-navy-deep">
          Employee Leave Summary
          <span class="text-slate-400 font-sans font-normal text-sm ml-1">({{ summaryYear }})</span>
        </h2>
        <p class="text-[12px] text-slate-400">Click a row to filter records below</p>
      </div>

      <!-- Summary Filters -->
      <div class="grid grid-cols-3 gap-4 mb-5">
        <div>
          <label class="block text-sm font-medium text-navy-deep mb-1.5">Search Employee</label>
          <input
            v-model="summarySearch"
            type="text"
            placeholder="Type employee name..."
            class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            @input="debounceSummarySearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-navy-deep mb-1.5">Department</label>
          <select
            v-model="summaryDepartment"
            class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            @change="fetchSummary(1)"
          >
            <option value="">All Departments</option>
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
              {{ dept.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-navy-deep mb-1.5">Year</label>
          <input
            v-model="summaryYear"
            type="number"
            class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            @change="fetchSummary(1)"
          />
        </div>
      </div>

      <div v-if="summaryLoading" class="flex justify-center py-10">
        <div
          class="w-6 h-6 border-[3px] border-teal-600 border-t-transparent rounded-full animate-spin"
        ></div>
      </div>

      <table v-else class="w-full text-sm">
        <thead class="bg-sky/60 border-b border-sky-100">
          <tr>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Employee
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Position
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Department
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              VL Used
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              SL Used
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Total Days Used
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="emp in summary"
            :key="emp.id"
            class="border-b border-sky-100 last:border-b-0 hover:bg-sky/40 cursor-pointer transition-colors"
            @click="filterByEmployee(emp.first_name, emp.surname)"
          >
            <td class="px-4 py-3.5 font-semibold text-navy-deep">
              {{ emp.first_name }} {{ emp.surname }}
            </td>
            <td class="px-4 py-3.5 text-slate-600">{{ emp.position }}</td>
            <td class="px-4 py-3.5 text-slate-600">{{ emp.department_name }}</td>
            <td
              class="px-4 py-3.5 font-mono text-[13px] font-semibold"
              :class="Number(emp.vl_used) > 0 ? 'text-navy' : 'text-slate-500'"
            >
              {{ Number(emp.vl_used ?? 0).toFixed(2) }} days
            </td>
            <td
              class="px-4 py-3.5 font-mono text-[13px] font-semibold"
              :class="Number(emp.sl_used) > 0 ? 'text-teal-700' : 'text-slate-500'"
            >
              {{ Number(emp.sl_used ?? 0).toFixed(2) }} days
            </td>
            <td class="px-4 py-3.5 font-mono text-[13px] font-semibold text-navy-deep">
              {{ (Number(emp.vl_used ?? 0) + Number(emp.sl_used ?? 0)).toFixed(2) }} days
            </td>
          </tr>
          <tr v-if="summary.length === 0">
            <td colspan="6" class="px-4 py-10 text-center text-slate-400 text-sm">
              No records found
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Summary Pagination -->
      <div class="flex items-center justify-between pt-4 border-t border-sky-100 mt-4">
        <p class="text-[12.5px] text-slate-500">
          Page <span class="font-semibold text-navy-deep">{{ summaryCurrentPage }}</span> of
          {{ summaryLastPage }}
        </p>
        <div class="flex gap-2">
          <button
            @click="fetchSummary(summaryCurrentPage - 1)"
            :disabled="summaryCurrentPage === 1"
            class="px-3.5 py-1.5 text-[12.5px] font-semibold border border-sky-100 rounded-lg bg-white hover:bg-sky text-navy transition-colors disabled:opacity-40 disabled:hover:bg-white"
          >
            ← Previous
          </button>
          <button
            @click="fetchSummary(summaryCurrentPage + 1)"
            :disabled="summaryCurrentPage === summaryLastPage"
            class="px-3.5 py-1.5 text-[12.5px] font-semibold border border-sky-100 rounded-lg bg-white hover:bg-sky text-navy transition-colors disabled:opacity-40 disabled:hover:bg-white"
          >
            Next →
          </button>
        </div>
      </div>
    </div>

    <!-- Detailed Records -->
    <div class="bg-white rounded-2xl border border-sky-100 p-6">
      <div class="flex items-center justify-between mb-5">
        <h2 class="font-serif text-lg font-semibold text-navy-deep">Detailed Records</h2>
        <button
          v-if="employeeSearch"
          @click="clearFilter"
          class="text-[12.5px] font-semibold text-navy border border-sky-100 rounded-xl px-3.5 py-1.5 hover:bg-sky transition-colors"
        >
          Clear Filter ✕
        </button>
      </div>

      <!-- Filters -->
      <div class="grid grid-cols-4 gap-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-navy-deep mb-1.5">Search Employee</label>
          <input
            v-model="employeeSearch"
            type="text"
            placeholder="Type employee name..."
            class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            @input="debounceSearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-navy-deep mb-1.5">Department</label>
          <select
            v-model="selectedDepartment"
            class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            @change="fetchRecords(1)"
          >
            <option value="">All Departments</option>
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
              {{ dept.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-navy-deep mb-1.5">Leave Type</label>
          <select
            v-model="selectedLeaveType"
            class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            @change="fetchRecords(1)"
          >
            <option value="">All Types</option>
            <option v-for="config in leaveConfigs" :key="config.id" :value="config.code">
              {{ config.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-navy-deep mb-1.5">Year</label>
          <input
            v-model="selectedYear"
            type="number"
            class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            @change="fetchRecords(1)"
          />
        </div>
      </div>

      <!-- Records Table -->
      <div v-if="loading" class="flex justify-center py-10">
        <div
          class="w-6 h-6 border-[3px] border-teal-600 border-t-transparent rounded-full animate-spin"
        ></div>
      </div>

      <table v-else class="w-full text-sm">
        <thead class="bg-sky/60 border-b border-sky-100">
          <tr>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Employee
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Leave Type
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Start Date
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              End Date
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Days
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Recorded By
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="record in records"
            :key="record.id"
            class="border-b border-sky-100 last:border-b-0 hover:bg-sky/40 transition-colors"
          >
            <td class="px-4 py-3.5 font-semibold text-navy-deep">
              {{ record.first_name }} {{ record.surname }}
            </td>
            <td class="px-4 py-3.5">
              <span
                class="bg-sky-100 text-navy px-2 py-0.5 rounded-full text-[11px] font-bold font-mono"
              >
                {{ record.code }}
              </span>
            </td>
            <td class="px-4 py-3.5 font-mono text-[12.5px] text-slate-500">
              {{ formatDate(record.start_date) }}
            </td>
            <td class="px-4 py-3.5 font-mono text-[12.5px] text-slate-500">
              {{ formatDate(record.end_date) }}
            </td>
            <td class="px-4 py-3.5 text-slate-600">{{ record.days_taken }}</td>
            <td class="px-4 py-3.5 text-slate-600">{{ record.recorded_by }}</td>
          </tr>
          <tr v-if="records.length === 0">
            <td colspan="6" class="px-4 py-10 text-center text-slate-400 text-sm">
              No leave records found
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Records Pagination -->
      <div class="flex items-center justify-between pt-4 border-t border-sky-100 mt-4">
        <p class="text-[12.5px] text-slate-500">
          Page <span class="font-semibold text-navy-deep">{{ recordsCurrentPage }}</span> of
          {{ recordsLastPage }}
          <span class="text-slate-400">· {{ recordsTotal }} total records</span>
        </p>
        <div class="flex gap-2">
          <button
            @click="fetchRecords(recordsCurrentPage - 1)"
            :disabled="recordsCurrentPage === 1"
            class="px-3.5 py-1.5 text-[12.5px] font-semibold border border-sky-100 rounded-lg bg-white hover:bg-sky text-navy transition-colors disabled:opacity-40 disabled:hover:bg-white"
          >
            ← Previous
          </button>
          <button
            @click="fetchRecords(recordsCurrentPage + 1)"
            :disabled="recordsCurrentPage === recordsLastPage"
            class="px-3.5 py-1.5 text-[12.5px] font-semibold border border-sky-100 rounded-lg bg-white hover:bg-sky text-navy transition-colors disabled:opacity-40 disabled:hover:bg-white"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

const currentYear = new Date().getFullYear()

// Summary
const showSummary = ref(false)
const summary = ref([])
const summaryLoading = ref(false)
const summaryCurrentPage = ref(1)
const summaryLastPage = ref(1)

// Records
const records = ref([])
const loading = ref(false)
const recordsCurrentPage = ref(1)
const recordsLastPage = ref(1)
const recordsTotal = ref(0)

// Filters
const employeeSearch = ref('')
const selectedLeaveType = ref('')
const selectedYear = ref(currentYear)
const leaveConfigs = ref([])
const selectedDepartment = ref('')
const departments = ref([])
const summaryDepartment = ref('')

let searchTimeout = null

const summaryYear = ref(currentYear)
const summarySearch = ref('')
let summarySearchTimeout = null

function debounceSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchRecords(1)
  }, 500)
}
function debounceSummarySearch() {
  clearTimeout(summarySearchTimeout)
  summarySearchTimeout = setTimeout(() => {
    fetchSummary(1)
  }, 500)
}

function formatDate(date) {
  if (!date) return 'N/A'
  return date.toString().split('T')[0]
}

async function fetchSummary(page = 1) {
  summaryLoading.value = true
  try {
    const params = new URLSearchParams({ page })
    if (summaryYear.value) params.append('year', summaryYear.value)
    if (summarySearch.value) params.append('search', summarySearch.value)
    if (summaryDepartment.value) params.append('department_id', summaryDepartment.value)

    const response = await api.get(`/leave-records/summary?${params}`)
    summary.value = response.data.data
    summaryCurrentPage.value = response.data.current_page
    summaryLastPage.value = response.data.last_page
  } catch (err) {
    console.error('Error fetching summary:', err)
  } finally {
    summaryLoading.value = false
  }
}
async function fetchRecords(page = 1) {
  loading.value = true
  try {
    const params = new URLSearchParams({ page })
    if (employeeSearch.value) params.append('search', employeeSearch.value)
    if (selectedLeaveType.value) params.append('leave_type', selectedLeaveType.value)
    if (selectedYear.value) params.append('year', selectedYear.value)
    if (selectedDepartment.value) params.append('department_id', selectedDepartment.value)

    const response = await api.get(`/leave-records?${params}`)
    records.value = response.data.data
    recordsCurrentPage.value = response.data.current_page
    recordsLastPage.value = response.data.last_page
    recordsTotal.value = response.data.total
  } catch (err) {
    console.error('Error fetching records:', err)
  } finally {
    loading.value = false
  }
}

function filterByEmployee(firstName, surname) {
  employeeSearch.value = firstName + ' ' + surname
  fetchRecords(1)
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
}

function clearFilter() {
  employeeSearch.value = ''
  fetchRecords(1)
}

onMounted(async () => {
  await fetchSummary()
  await fetchRecords()
  const deptResponse = await api.get('/departments')
  departments.value = deptResponse.data.data
  try {
    const configResponse = await api.get('/leave-configurations')
    leaveConfigs.value = configResponse.data
  } catch (err) {
    console.error('Error fetching configs:', err)
  }
})
</script>

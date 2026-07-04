<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Leave Records</h1>

    <!-- Summary Table -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">
        Employee Leave Summary ({{ summaryYear }})
      </h2>

      <!-- Summary Filters -->
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <input
            v-model="summaryYear"
            type="number"
            class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            @change="fetchSummary(1)"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Search Employee</label>
          <input
            v-model="summarySearch"
            type="text"
            placeholder="Type employee name..."
            class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            @input="debounceSummarySearch"
          />
        </div>
      </div>

      <div v-if="summaryLoading" class="flex justify-center py-8">
        <div
          class="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"
        ></div>
      </div>

      <table v-else class="w-full text-sm">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Employee</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Position</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Department</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">VL Used</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">SL Used</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Total Days Used</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="emp in summary"
            :key="emp.id"
            class="border-b hover:bg-gray-50 cursor-pointer"
            @click="filterByEmployee(emp.first_name, emp.surname)"
          >
            <td class="px-4 py-3 font-medium text-gray-900">
              {{ emp.first_name }} {{ emp.surname }}
            </td>
            <td class="px-4 py-3 text-gray-700">{{ emp.position }}</td>
            <td class="px-4 py-3 text-gray-700">{{ emp.department_name }}</td>
            <td
              class="px-4 py-3 font-medium"
              :class="Number(emp.vl_used) > 0 ? 'text-blue-600' : 'text-gray-400'"
            >
              {{ Number(emp.vl_used ?? 0).toFixed(2) }} days
            </td>
            <td
              class="px-4 py-3 font-medium"
              :class="Number(emp.sl_used) > 0 ? 'text-green-600' : 'text-gray-400'"
            >
              {{ Number(emp.sl_used ?? 0).toFixed(2) }} days
            </td>
            <td class="px-4 py-3 font-medium text-gray-900">
              {{ (Number(emp.vl_used ?? 0) + Number(emp.sl_used ?? 0)).toFixed(2) }} days
            </td>
          </tr>
          <tr v-if="summary.length === 0">
            <td colspan="6" class="px-4 py-8 text-center text-gray-500">No records found</td>
          </tr>
        </tbody>
      </table>

      <!-- Summary Pagination -->
      <div class="flex items-center justify-between pt-3 border-t mt-3">
        <p class="text-sm text-gray-500">Page {{ summaryCurrentPage }} of {{ summaryLastPage }}</p>
        <div class="flex gap-2">
          <button
            @click="fetchSummary(summaryCurrentPage - 1)"
            :disabled="summaryCurrentPage === 1"
            class="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            ← Previous
          </button>
          <button
            @click="fetchSummary(summaryCurrentPage + 1)"
            :disabled="summaryCurrentPage === summaryLastPage"
            class="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      </div>
    </div>

    <!-- Detailed Records -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-800">
          Detailed Records
          <span v-if="employeeSearch" class="text-sm font-normal text-blue-600 ml-2">
            <!-- (filtered: "{{ employeeSearch }}") -->
          </span>
        </h2>
        <button
          v-if="employeeSearch"
          @click="clearFilter"
          class="text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded px-3 py-1.5"
        >
          Clear Filter ✕
        </button>
      </div>

      <!-- Filters -->
      <div class="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Search Employee</label>
          <input
            v-model="employeeSearch"
            type="text"
            placeholder="Type employee name..."
            class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            @input="debounceSearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
          <select
            v-model="selectedLeaveType"
            class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            @change="fetchRecords(1)"
          >
            <option value="">All Types</option>
            <option v-for="config in leaveConfigs" :key="config.id" :value="config.code">
              {{ config.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <input
            v-model="selectedYear"
            type="number"
            class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            @change="fetchRecords(1)"
          />
        </div>
      </div>

      <!-- Records Table -->
      <div v-if="loading" class="flex justify-center py-8">
        <div
          class="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"
        ></div>
      </div>

      <table v-else class="w-full text-sm">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Employee</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Leave Type</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Start Date</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">End Date</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Days</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Recorded By</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in records" :key="record.id" class="border-b hover:bg-gray-50">
            <td class="px-4 py-3 font-medium text-gray-900">
              {{ record.first_name }} {{ record.surname }}
            </td>
            <td class="px-4 py-3">
              <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                {{ record.code }}
              </span>
            </td>
            <td class="px-4 py-3 text-gray-700">{{ formatDate(record.start_date) }}</td>
            <td class="px-4 py-3 text-gray-700">{{ formatDate(record.end_date) }}</td>
            <td class="px-4 py-3 text-gray-700">{{ record.days_taken }}</td>
            <td class="px-4 py-3 text-gray-700">{{ record.recorded_by }}</td>
          </tr>
          <tr v-if="records.length === 0">
            <td colspan="6" class="px-4 py-8 text-center text-gray-500">No leave records found</td>
          </tr>
        </tbody>
      </table>

      <!-- Records Pagination -->
      <div class="flex items-center justify-between pt-3 border-t mt-3">
        <p class="text-sm text-gray-500">
          Page {{ recordsCurrentPage }} of {{ recordsLastPage }} ({{ recordsTotal }} total records)
        </p>
        <div class="flex gap-2">
          <button
            @click="fetchRecords(recordsCurrentPage - 1)"
            :disabled="recordsCurrentPage === 1"
            class="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            ← Previous
          </button>
          <button
            @click="fetchRecords(recordsCurrentPage + 1)"
            :disabled="recordsCurrentPage === recordsLastPage"
            class="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
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

    console.log('Fetching summary with params:', params.toString()) // ← add this
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

  try {
    const configResponse = await api.get('/leave-configurations')
    leaveConfigs.value = configResponse.data
  } catch (err) {
    console.error('Error fetching configs:', err)
  }
})
</script>
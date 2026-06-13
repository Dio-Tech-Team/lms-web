<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Leave Records</h1>
    </div>

    <!-- Filter -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="flex gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Filter by Employee</label>
          <select
            v-model="selectedEmployee"
            class="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            @change="fetchRecords"
          >
            <option value="">All Employees</option>
            <option v-for="emp in employees" :key="emp.id" :value="emp.id">
              {{ emp.first_name }} {{ emp.last_name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div
        class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"
      ></div>
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Employee</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Leave Type</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Start Date</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">End Date</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Days</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Remarks</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Recorded By</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in records" :key="record.id" class="border-b hover:bg-gray-50">
            <td class="px-4 py-3">{{ record.employee }}</td>
            <td class="px-4 py-3">
              <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                {{ record.code }}
              </span>
            </td>
            <td class="px-4 py-3">{{ record.start_date }}</td>
            <td class="px-4 py-3">{{ record.end_date }}</td>
            <td class="px-4 py-3">{{ record.days_taken }}</td>
            <td class="px-4 py-3">{{ record.remarks || 'N/A' }}</td>
            <td class="px-4 py-3">{{ record.recorded_by }}</td>
          </tr>
          <tr v-if="records.length === 0">
            <td colspan="7" class="px-4 py-8 text-center text-gray-500">No leave records found</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

const records = ref([])
const employees = ref([])
const loading = ref(true)
const selectedEmployee = ref('')

onMounted(async () => {
  try {
    const empResponse = await api.get('/employees')
    employees.value = empResponse.data
    await fetchRecords()
  } catch (error) {
    console.error('Error:', error)
  }
})

async function fetchRecords() {
  loading.value = true
  try {
    const params = selectedEmployee.value ? `?employee_id=${selectedEmployee.value}` : ''
    const response = await api.get(`/leave-records${params}`)
    records.value = response.data
  } catch (error) {
    console.error('Error fetching records:', error)
  } finally {
    loading.value = false
  }
}
</script>
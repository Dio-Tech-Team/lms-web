<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Leave Credit Computation</h1>

    <!-- Upload Form -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Upload Attendance File</h2>
      <!-- History / Filter Section -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Past Attendance Records</h2>

        <div class="grid grid-cols-4 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <select
              v-model="filter.month"
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">All Months</option>
              <option v-for="(name, num) in months" :key="num" :value="num">{{ name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input
              v-model="filter.year"
              type="number"
              placeholder="e.g. 2026"
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              v-model="filter.department_id"
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">All Departments</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
          </div>
          <div class="flex items-end">
            <button
              @click="fetchHistory"
              class="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 w-full"
            >
              Search
            </button>
          </div>
        </div>

        <div v-if="historyLoading" class="text-center py-8 text-gray-500 text-sm">
          Loading records...
        </div>

        <table v-else-if="historyRecords.length > 0" class="w-full text-sm">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="text-left px-4 py-3 text-gray-600">Employee</th>
              <th class="text-left px-4 py-3 text-gray-600">Department</th>
              <th class="text-left px-4 py-3 text-gray-600">Month/Year</th>
              <th class="text-left px-4 py-3 text-gray-600">VL Earned</th>
              <th class="text-left px-4 py-3 text-gray-600">Tardiness</th>
              <th class="text-left px-4 py-3 text-gray-600">SL Earned</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in historyRecords" :key="record.id" class="border-b hover:bg-gray-50">
              <td class="px-4 py-3 font-medium text-gray-900">
                {{ record.employee?.first_name }} {{ record.employee?.surname }}
              </td>
              <td class="px-4 py-3 text-gray-700">
                {{ record.employee?.department?.name || 'N/A' }}
              </td>
              <td class="px-4 py-3 text-gray-700">{{ record.month }} {{ record.year }}</td>
              <td class="px-4 py-3 text-gray-700">{{ record.vl_earned }}</td>
              <td class="px-4 py-3 text-red-600">{{ record.tardiness_equivalent_days }}</td>
              <td class="px-4 py-3 text-gray-700">{{ record.sl_earned }}</td>
            </tr>
          </tbody>
        </table>

        <p v-else class="text-sm text-gray-400 italic py-4 text-center">
          No records found. Try adjusting your filters or upload a new attendance file above.
        </p>
      </div>
      <div
        v-if="uploadError"
        class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4 text-sm"
      >
        {{ uploadError }}
      </div>

      <form @submit.prevent="handleUpload">
        <div class="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <select
              v-model="form.month"
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              required
            >
              <option value="">Select Month</option>
              <option v-for="(name, num) in months" :key="num" :value="num">{{ name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input
              v-model="form.year"
              type="number"
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Department (optional)</label
            >
            <input
              v-model="form.department"
              type="text"
              placeholder="e.g. MASO"
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Attendance Excel File</label>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            @change="handleFileChange"
            class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            required
          />
          <p class="text-xs text-gray-500 mt-1">Accepted formats: .xlsx, .xls, .csv</p>
        </div>

        <button
          type="submit"
          :disabled="uploading"
          class="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 disabled:opacity-50"
        >
          {{ uploading ? 'Processing...' : 'Upload & Compute' }}
        </button>
      </form>
    </div>

    <!-- Results -->
    <div v-if="results.length > 0" class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">
        Computation Results ({{ results.length }} employees processed)
      </h2>
      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="text-left px-4 py-3 text-gray-600">Employee</th>
            <th class="text-left px-4 py-3 text-gray-600">VL Earned</th>
            <th class="text-left px-4 py-3 text-gray-600">SL Earned</th>
            <th class="text-left px-4 py-3 text-gray-600">Tardiness Deducted</th>
            <th class="text-left px-4 py-3 text-gray-600">Total Earned VL Credits</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(r, index) in results" :key="index" class="border-b hover:bg-gray-50">
            <td class="px-4 py-3 font-medium text-gray-900">{{ r.employee }}</td>
            <td class="px-4 py-3 text-gray-700">{{ r.vl_earned }}</td>
            <td class="px-4 py-3 text-gray-700">{{ r.sl_earned }}</td>
            <td class="px-4 py-3 text-red-600">{{ r.tardiness_deducted }}</td>
            <td class="px-4 py-3 font-medium text-green-700">
              {{ (r.vl_earned - r.tardiness_deducted).toFixed(3) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Errors -->
    <div v-if="errors.length > 0" class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold text-red-600 mb-4">
        Unmatched Entries ({{ errors.length }})
      </h2>
      <p class="text-sm text-gray-500 mb-3">
        These rows could not be matched to an existing employee. Please check the spelling/format in
        your Excel file and re-upload.
      </p>
      <ul class="space-y-2">
        <li
          v-for="(err, index) in errors"
          :key="index"
          class="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm"
        >
          {{ err }}
        </li>
      </ul>
    </div>
  </div>
</template>
<!-- 
<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

const months = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
}
const departments = ref([])
const filter = ref({
  month: '',
  year: '',
  department_id: '',
})
const historyRecords = ref([])
const historyLoading = ref(false)

const form = ref({
  month: '',
  year: new Date().getFullYear(),
  department: '',
})

const selectedFile = ref(null)
const uploading = ref(false)
const uploadError = ref('')
const results = ref([])
const errors = ref([])

function handleFileChange(event) {
  selectedFile.value = event.target.files[0]
}

async function handleUpload() {
  if (!selectedFile.value) {
    uploadError.value = 'Please select a file to upload.'
    return
  }

  uploading.value = true
  uploadError.value = ''
  results.value = []
  errors.value = []

  const formData = new FormData()
  formData.append('file', selectedFile.value)
  formData.append('month', form.value.month)
  formData.append('year', form.value.year)
  if (form.value.department) {
    formData.append('department', form.value.department)
  }

  try {
    const response = await api.post('/attendance/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    results.value = response.data.results
    errors.value = response.data.errors
  } catch (err) {
    uploadError.value = err.response?.data?.message || 'Failed to process attendance file.'
  } finally {
    uploading.value = false
  }

  async function fetchHistory() {
    historyLoading.value = true
    try {
      const params = {}
      if (filter.value.month) params.month = filter.value.month
      if (filter.value.year) params.year = filter.value.year
      if (filter.value.department_id) params.department_id = filter.value.department_id

      const response = await api.get('/attendance', { params })
      historyRecords.value = response.data
    } catch (err) {
      console.error('Failed to fetch attendance history:', err)
    } finally {
      historyLoading.value = false
    }
  }

  onMounted(async () => {
    try {
      const deptResponse = await api.get('/departments')
      departments.value = deptResponse.data.data
    } catch (err) {
      console.error('Failed to fetch departments:', err)
    }

    fetchHistory()
  })
}
</script> -->
<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

const months = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
}

const departments = ref([])
const filter = ref({ month: '', year: '', department_id: '' })
const historyRecords = ref([])
const historyLoading = ref(false)
const form = ref({ month: '', year: new Date().getFullYear(), department: '' })
const selectedFile = ref(null)
const uploading = ref(false)
const uploadError = ref('')
const results = ref([])
const errors = ref([])

function handleFileChange(event) {
  selectedFile.value = event.target.files[0]
}
async function fetchHistory() {
  historyLoading.value = true
  try {
    const params = {}
    if (filter.value.month) params.month = filter.value.month
    if (filter.value.year) params.year = filter.value.year
    if (filter.value.department_id) params.department_id = filter.value.department_id

    const historyResponse = await api.get('/attendance', { params }) // ← renamed
    console.log('History response:', historyResponse.data)
    historyRecords.value = historyResponse.data
  } catch (err) {
    console.error('Failed to fetch attendance history:', err)
  } finally {
    historyLoading.value = false
  }
}

async function handleUpload() {
  if (!selectedFile.value) {
    uploadError.value = 'Please select a file to upload.'
    return
  }

  uploading.value = true
  uploadError.value = ''
  results.value = []
  errors.value = []

  const formData = new FormData()
  formData.append('file', selectedFile.value)
  formData.append('month', form.value.month)
  formData.append('year', form.value.year)
  if (form.value.department) {
    formData.append('department', form.value.department)
  }

  try {
    const response = await api.post('/attendance/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    results.value = response.data.results
    errors.value = response.data.errors
    await fetchHistory() // refresh history after upload
  } catch (err) {
    uploadError.value = err.response?.data?.message || 'Failed to process attendance file.'
  } finally {
    uploading.value = false
  }
}

onMounted(async () => {
  try {
    const deptResponse = await api.get('/departments')
    departments.value = deptResponse.data.data
  } catch (err) {
    console.error('Failed to fetch departments:', err)
  }
  fetchHistory()
})
</script>
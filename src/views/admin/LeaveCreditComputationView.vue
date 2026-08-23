<template>
  <div>
    <div class="mb-6">
      <!-- <p class="text-[11px] uppercase tracking-wider text-teal-600 font-bold mb-1">Leave</p> -->
      <!-- <h1 class="font-serif text-3xl font-semibold text-navy-deep">Leave</h1> -->
      <h1 class="text-2xl font-bold text-gray-700">Leave Credit Computation</h1>
    </div>

    <!-- Upload Form -->
    <div class="bg-white rounded-2xl border border-sky-100 p-6 mb-6">
      <div class="flex items-center justify-between mb-5">
        <h2 class="font-serif text-lg font-semibold text-navy-deep">Upload Attendance File</h2>
      </div>

      <div
        v-if="uploadError"
        class="bg-rose-tint border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-5 text-sm"
      >
        {{ uploadError }}
      </div>

      <form @submit.prevent="handleUpload">
        <!-- Upload Mode Toggle -->
        <div class="flex gap-3 mb-5">
          <button
            type="button"
            @click="uploadMode = 'single'"
            :class="
              uploadMode === 'single'
                ? 'bg-navy text-white border-navy'
                : 'bg-white text-slate-600 border-sky-100 hover:bg-sky'
            "
            class="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors"
          >
            Single Department
          </button>
          <button
            type="button"
            @click="uploadMode = 'multi'"
            :class="
              uploadMode === 'multi'
                ? 'bg-navy text-white border-navy'
                : 'bg-white text-slate-600 border-sky-100 hover:bg-sky'
            "
            class="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors"
          >
            All Departments (multi-sheet)
          </button>
        </div>

        <div
          class="grid gap-4 mb-5"
          :class="uploadMode === 'single' ? 'grid-cols-3' : 'grid-cols-2'"
        >
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">Month</label>
            <select
              v-model="form.month"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              required
            >
              <option value="">Select Month</option>
              <option v-for="(name, num) in months" :key="num" :value="num">{{ name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">Year</label>
            <input
              v-model="form.year"
              type="number"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              required
            />
          </div>
          <div v-if="uploadMode === 'single'">
            <!-- <label class="block text-sm font-medium text-navy-deep mb-1.5"
              >Department (optional)</label
            > -->
            <!-- <input
              v-model="form.department"
              type="text"
              placeholder="e.g. MASO"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            /> -->
          </div>
        </div>

        <div class="mb-5">
          <label class="block text-sm font-medium text-navy-deep mb-1.5"
            >Attendance Excel File</label
          >
          <div class="border-2 border-dashed border-sky-100 rounded-xl px-4 py-5 bg-sky/30">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              @change="handleFileChange"
              class="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-navy file:text-white hover:file:bg-navy-deep file:cursor-pointer cursor-pointer"
              required
            />
            <p class="text-xs text-slate-400 mt-2">
              <template v-if="uploadMode === 'single'">
                Accepted formats: .xlsx, .xls, .cs
              </template>
              <template v-else> Accepted formats: .xlsx, .xls, .cs </template>
            </p>
          </div>
        </div>

        <button
          type="submit"
          :disabled="uploading"
          class="bg-navy text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-navy-deep transition-colors disabled:opacity-50"
        >
          {{ uploading ? 'Processing...' : 'Upload & Compute' }}
        </button>
      </form>
    </div>

    <!-- History / Filter Section -->
    <div class="bg-white rounded-2xl border border-sky-100 p-6 mb-6">
      <h2 class="font-serif text-lg font-semibold text-navy-deep mb-5">Past Attendance Records</h2>

      <div class="grid grid-cols-4 gap-4 mb-5">
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
          <input
            v-model="filter.year"
            type="number"
            placeholder="e.g. 2026"
            class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-navy-deep mb-1.5">Department</label>
          <select
            v-model="filter.department_id"
            class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
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
            class="bg-navy text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-navy-deep transition-colors w-full"
          >
            Search
          </button>
        </div>
      </div>

      <div v-if="historyLoading" class="flex items-center justify-center gap-3 py-10">
        <div
          class="w-6 h-6 border-[3px] border-teal-600 border-t-transparent rounded-full animate-spin"
        ></div>
        <span class="text-slate-500 text-sm">Loading records...</span>
      </div>

      <table v-else-if="historyRecords.length > 0" class="w-full text-sm">
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
              Department
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Month/Year
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              VL Earned
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Tardiness
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              SL Earned
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="record in historyRecords"
            :key="record.id"
            class="border-b border-sky-100 last:border-b-0 hover:bg-sky/40 transition-colors"
          >
            <td class="px-4 py-3.5 font-semibold text-navy-deep">
              {{ record.employee?.first_name }} {{ record.employee?.surname }}
            </td>
            <td class="px-4 py-3.5 text-slate-600">
              {{ record.employee?.department?.name || 'N/A' }}
            </td>
            <td class="px-4 py-3.5 font-mono text-[12.5px] text-slate-500">
              {{ record.month }} {{ record.year }}
            </td>
            <td class="px-4 py-3.5 font-mono text-[13px] text-navy">{{ record.vl_earned }}</td>
            <td class="px-4 py-3.5 font-mono text-[13px] text-rose-600">
              {{ record.tardiness_equivalent_days }}
            </td>
            <td class="px-4 py-3.5 font-mono text-[13px] text-teal-700">{{ record.sl_earned }}</td>
          </tr>
        </tbody>
      </table>

      <p v-else class="text-sm text-slate-400 italic py-8 text-center">
        No records found. Try adjusting your filters or upload a new attendance file above.
      </p>
    </div>
    <!-- Missing Attendance Check -->
    <div class="bg-white rounded-2xl border border-sky-100 p-6 mb-6">
      <h2 class="font-serif text-lg font-semibold text-navy-deep mb-5">Check Missing Attendance</h2>
      <div class="grid grid-cols-3 gap-4 mb-5">
        <div>
          <label class="block text-sm font-medium text-navy-deep mb-1.5">Month</label>
          <select
            v-model="checkMonth"
            class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
          >
            <option value="">Select Month</option>
            <option v-for="(name, num) in months" :key="num" :value="num">{{ name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-navy-deep mb-1.5">Year</label>
          <input
            v-model="checkYear"
            type="number"
            class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
          />
        </div>
        <div class="flex items-end">
          <button
            @click="checkMissing"
            :disabled="missingLoading"
            class="bg-navy text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-navy-deep transition-colors w-full disabled:opacity-50"
          >
            {{ missingLoading ? 'Checking...' : 'Check' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Missing Attendance Results (shared by upload + standalone check) -->
    <div v-if="missingData" class="bg-white rounded-2xl border border-amber-200 p-6 mb-6">
      <h2 class="font-serif text-lg font-semibold text-amber-700 mb-2">
        Missing Attendance
        <span class="font-sans font-normal text-sm text-slate-400 ml-1"
          >({{ missingData.total }})</span
        >
      </h2>

      <p v-if="missingData.total === 0" class="text-sm text-teal-700 py-4">
        All eligible employees have attendance recorded{{
          missingData.month ? ` for ${missingData.month} ${missingData.year}` : ''
        }}.
      </p>

      <div v-else class="space-y-4 mt-4">
        <div v-for="(employees, department) in missingData.byDepartment" :key="department">
          <h3 class="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-2">
            {{ department }} ({{ employees.length }})
          </h3>
          <ul class="space-y-1.5">
            <li
              v-for="emp in employees"
              :key="emp.id"
              class="bg-amber-50 border border-amber-200 text-amber-800 px-3.5 py-2 rounded-xl text-sm flex justify-between"
            >
              <span>{{ emp.name }}</span>
              <span class="capitalize text-amber-600 text-[12.5px]">{{
                emp.employment_status?.replace('_', ' ')
              }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- Results -->
    <div v-if="results.length > 0" class="bg-white rounded-2xl border border-sky-100 p-6 mb-6">
      <div class="flex items-center justify-between mb-5">
        <h2 class="font-serif text-lg font-semibold text-navy-deep">
          Computation Results
          <span class="font-sans font-normal text-sm text-slate-400 ml-1"
            >({{ results.length }} employees processed)</span
          >
        </h2>
      </div>
      <table class="w-full text-sm">
        <thead class="bg-sky/60 border-b border-sky-100">
          <tr>
            <th
              v-if="uploadMode === 'multi'"
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Department
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Employee
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              VL Earned
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              SL Earned
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Tardiness Deducted
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Total Earned VL Credits
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(r, index) in results"
            :key="index"
            class="border-b border-sky-100 last:border-b-0 hover:bg-sky/40 transition-colors"
          >
            <td v-if="uploadMode === 'multi'" class="px-4 py-3.5 text-slate-500 text-[12.5px]">
              {{ r.sheet }}
            </td>
            <td class="px-4 py-3.5 font-semibold text-navy-deep">{{ r.employee }}</td>
            <td class="px-4 py-3.5 font-mono text-[13px] text-navy">{{ r.vl_earned }}</td>
            <td class="px-4 py-3.5 font-mono text-[13px] text-teal-700">{{ r.sl_earned }}</td>
            <td class="px-4 py-3.5 font-mono text-[13px] text-rose-600">
              {{ r.tardiness_deducted }}
            </td>
            <td class="px-4 py-3.5 font-mono text-[13px] font-bold text-navy-deep">
              {{ (r.vl_earned - r.tardiness_deducted).toFixed(3) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Errors -->
    <div v-if="errors.length > 0" class="bg-white rounded-2xl border border-rose-200 p-6">
      <h2 class="font-serif text-lg font-semibold text-rose-600 mb-2">
        Unmatched Entries
        <span class="font-sans font-normal text-sm text-slate-400 ml-1">({{ errors.length }})</span>
      </h2>
      <p class="text-sm text-slate-500 mb-4">
        These rows could not be matched to an existing employee. Please check the spelling/format in
        your Excel file and re-upload.
      </p>
      <ul class="space-y-2">
        <li
          v-for="(err, index) in errors"
          :key="index"
          class="bg-rose-tint border border-rose-200 text-rose-700 px-3.5 py-2.5 rounded-xl text-sm"
        >
          {{ err }}
        </li>
      </ul>
    </div>
  </div>
</template>

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
const uploadMode = ref('single') // 'single' or 'multi' — purely a UI hint, backend already handles both automatically
const selectedFile = ref(null)
const uploading = ref(false)
const uploadError = ref('')
const missingData = ref(null) // shared by both upload-time and standalone check
const missingLoading = ref(false)
const checkMonth = ref('')
const checkYear = ref(new Date().getFullYear())
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

    const historyResponse = await api.get('/attendance', { params })
    historyRecords.value = historyResponse.data
  } catch (err) {
    console.error('Failed to fetch attendance history:', err)
  } finally {
    historyLoading.value = false
  }
}

// async function handleUpload() {
//   if (!selectedFile.value) {
//     uploadError.value = 'Please select a file to upload.'
//     return
//   }

//   uploading.value = true
//   uploadError.value = ''
//   results.value = []
//   errors.value = []

//   const formData = new FormData()
//   formData.append('file', selectedFile.value)
//   formData.append('month', form.value.month)
//   formData.append('year', form.value.year)
//   if (form.value.department) {
//     formData.append('department', form.value.department)
//   }

//   try {
//     const response = await api.post('/attendance/upload', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     })
//     results.value = response.data.results
//     errors.value = response.data.errors
//     await fetchHistory() // refresh history after upload
//   } catch (err) {
//     uploadError.value = err.response?.data?.message || 'Failed to process attendance file.'
//   } finally {
//     uploading.value = false
//   }
// }
async function handleUpload() {
  if (!selectedFile.value) {
    uploadError.value = 'Please select a file to upload.'
    return
  }

  uploading.value = true
  uploadError.value = ''
  results.value = []
  errors.value = []
  missingData.value = null // reset

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
    missingData.value = {
      total: response.data.total_missing,
      byDepartment: response.data.missing_by_department,
    }
    await fetchHistory()
  } catch (err) {
    uploadError.value = err.response?.data?.message || 'Failed to process attendance file.'
  } finally {
    uploading.value = false
  }
}

async function checkMissing() {
  if (!checkMonth.value || !checkYear.value) return
  missingLoading.value = true
  try {
    const response = await api.get('/attendance/missing-check', {
      params: { month: checkMonth.value, year: checkYear.value },
    })
    missingData.value = {
      total: response.data.total_missing,
      byDepartment: response.data.missing_by_department,
      month: response.data.month,
      year: response.data.year,
    }
  } catch (err) {
    console.error('Failed to check missing attendance:', err)
  } finally {
    missingLoading.value = false
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
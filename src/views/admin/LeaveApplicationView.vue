<!-- <template>
  <div>

    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-700">Leave Applications</h1>
    </div>

    <div class="flex gap-2 mb-6">
      <button
        @click="filterStatus = ''"
        :class="filterStatus === '' ? 'bg-gray-600 text-white' : 'bg-white text-gray-600'"
        class="px-4 py-2 rounded text-sm border border-gray-300"
      >
        All
      </button>
      <button
        @click="filterStatus = 'pending'"
        :class="filterStatus === 'pending' ? 'bg-gray-600 text-white' : 'bg-white text-gray-600'"
        class="px-4 py-2 rounded text-sm border border-gray-300"
      >
        Pending
      </button>
      <button
        @click="filterStatus = 'approved'"
        :class="filterStatus === 'approved' ? 'bg-gray-600 text-white' : 'bg-white text-gray-600'"
        class="px-4 py-2 rounded text-sm border border-gray-300"
      >
        Approved
      </button>
      <button
        @click="filterStatus = 'cancelled'"
        :class="filterStatus === 'cancelled' ? 'bg-gray-600 text-white' : 'bg-white text-gray-600'"
        class="px-4 py-2 rounded text-sm border border-gray-300"
      >
        Cancelled
      </button>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-20">
      <div
        class="w-8 h-8 border-4 border-gray-600 border-t-transparent rounded-full animate-spin"
      ></div>
    </div>


    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Employee</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Leave Type</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Start Date</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">End Date</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Days</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Reason</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Status</th>

            <th class="text-left px-4 py-3 text-gray-600 font-medium">Actions</th>

            <th class="text-left px-4 py-3 text-gray-600 font-medium">Form</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="app in filteredApplications" :key="app.id" class="border-b hover:bg-gray-50">
            <td class="px-4 py-3">{{ app.first_name }} {{ app.surname }}</td>
            <td class="px-4 py-3">
              <span class="bg-gray-100 text-white-700 px-2 py-1 rounded text-xs font-medium">
                {{ app.leave_type_code }}
              </span>
            </td>
            <td class="px-4 py-3">{{ formatDate(app.start_date) }}</td>
            <td class="px-4 py-3">{{ formatDate(app.end_date) }}</td>
            <td class="px-4 py-3">{{ app.days_applied }}</td>
            <td class="px-4 py-3">{{ app.reason || 'N/A' }}</td>
            <td class="px-4 py-3">
              <span
                :class="{
                  'bg-gray-100 text-yellow-700': app.status === 'pending',
                  'bg-gray-100 text-green-700': app.status === 'approved',
                  'bg-gray-100 text-red-700': app.status === 'cancelled',
                }"
                class="px-2 py-1 rounded-full text-xs font-medium capitalize"
              >
                {{ app.status }}
              </span>
            </td>
            <td class="px-4 py-3">
              <div v-if="app.status === 'pending'" class="flex gap-2">
                <button
                  @click="handleApprove(app.id)"
                  class="text-green-600 hover:text-green-700 text-sm"
                >
                  Approve
                </button>
                <button
                  @click="handleCancel(app.id)"
                  class="text-red-600 hover:text-red-700 text-sm"
                >
                  Cancel
                </button>
              </div>

              <span v-else class="text-gray-400 text-sm">
                {{ app.reviewed_by ? 'By ' + app.reviewed_by : '-' }}
              </span>
            </td>
            <td class="px-4 py-3 text-center">
              <button
                @click="viewLeaveForm(app.id)"
                class="text-blue-600 hover:text-blue-800 font-medium text-sm inline-flex items-center gap-1"
                title="View/Print Form"
              >
                📄 View Form
              </button>
            </td>

            <td class="px-4 py-3"></td>
          </tr>
          <tr v-if="filteredApplications.length === 0">
            <td colspan="8" class="px-4 py-8 text-center text-gray-500">No applications found</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      v-if="pdfUrl"
      class="mt-8 bg-white rounded-lg shadow border border-gray-200 overflow-hidden"
    >
      <div class="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
        <span class="font-bold text-gray-700 text-sm">Form Document View</span>
        <button @click="pdfUrl = null" class="text-xs text-red-500 hover:underline">
          Close View
        </button>
      </div>
      <div class="h-[600px]">
        <iframe :src="pdfUrl" class="w-full h-full border-0"></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import api from '@/api/axios'

const pdfModalOpen = ref(false)
const pdfUrl = ref(null)

const applications = ref([])
const loading = ref(true)
const filterStatus = ref('')

const filteredApplications = computed(() => {
  if (!filterStatus.value) return applications.value
  return applications.value.filter((app) => app.status === filterStatus.value)
})

onMounted(async () => {
  await fetchApplications()
})

async function fetchApplications() {
  loading.value = true
  try {
    const response = await api.get('/leave-applications')
    applications.value = response.data?.data || response.data || []
  } catch (error) {
    console.error('Error fetching applications:', error)
    applications.value = []
  } finally {
    loading.value = false
  }
}
async function handleApprove(id) {
  if (confirm('Are you sure you want to approve this leave application?')) {
    try {
      await api.post(`/leave-applications/${id}/approve`)
      await fetchApplications()
    } catch (err) {
      console.error('Failed to approve', err)
    }
  }
}

async function handleCancel(id) {
  if (confirm('Are you sure you want to cancel this leave application?')) {
    try {
      await api.post(`/leave-applications/${id}/cancel`)
      await fetchApplications()
    } catch (err) {
      console.error('Failed to cancel', err)
    }
  }
}
function formatDate(dateString) {
  if (!dateString) return 'N/A'
  return dateString.split('T')[0]
}

async function viewLeaveForm(id) {
  loading.value = true 
  try {
    const response = await api.get(`/leave-applications/${id}/pdf`, {
      responseType: 'blob',
    })

    if (pdfUrl.value) {
      URL.revokeObjectURL(pdfUrl.value)
    }

    const file = new Blob([response.data], { type: 'application/pdf' })
    pdfUrl.value = URL.createObjectURL(file)
    pdfModalOpen.value = true
  } catch (error) {
    console.error('Failed to load leave application PDF:', error)
    alert('Could not generate leave form inside the panel.')
  } finally {
    loading.value = false
  }
}

</script> -->
<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-700">Leave Applications</h1>
    </div>

    <!-- Filter Tabs -->
    <div class="flex gap-2 mb-6">
      <button
        v-for="tab in ['', 'pending', 'approved', 'cancelled']"
        :key="tab"
        @click="setFilter(tab)"
        :class="filterStatus === tab ? 'bg-gray-600 text-white' : 'bg-white text-gray-600'"
        class="px-4 py-2 rounded text-sm border border-gray-300 capitalize"
      >
        {{ tab === '' ? 'All' : tab }}
      </button>
    </div>
    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Search Employee</label>
          <input
            v-model="search"
            type="text"
            placeholder="Type employee name..."
            class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            @input="debounceSearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <select
            v-model="selectedDepartment"
            class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            @change="fetchApplications(1)"
          >
            <option value="">All Departments</option>
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
              {{ dept.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <input
            v-model="selectedYear"
            type="number"
            class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            @change="fetchApplications(1)"
          />
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div
        class="w-8 h-8 border-4 border-gray-600 border-t-transparent rounded-full animate-spin"
      ></div>
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Employee</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Department</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Leave Type</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Start Date</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">End Date</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Days</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Reason</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Actions</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Form</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="app in applications" :key="app.id" class="border-b hover:bg-gray-50">
            <td class="px-4 py-3">{{ app.first_name }} {{ app.surname }}</td>
            <td class="px-4 py-3">
              <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                {{ app.leave_type_code }}
              </span>
            </td>
            <td class="px-4 py-3 text-gray-700">{{ app.department_name }}</td>
            <td class="px-4 py-3">{{ formatDate(app.start_date) }}</td>
            <td class="px-4 py-3">{{ formatDate(app.end_date) }}</td>
            <td class="px-4 py-3">{{ app.days_applied }}</td>
            <td class="px-4 py-3">{{ app.reason || 'N/A' }}</td>
            <td class="px-4 py-3">
              <span
                :class="{
                  'bg-yellow-100 text-yellow-700': app.status === 'pending',
                  'bg-green-100 text-green-700': app.status === 'approved',
                  'bg-red-100 text-red-700': app.status === 'cancelled',
                }"
                class="px-2 py-1 rounded-full text-xs font-medium capitalize"
              >
                {{ app.status }}
              </span>
            </td>
            <td class="px-4 py-3">
              <div v-if="app.status === 'pending'" class="flex gap-2">
                <button
                  @click="handleApprove(app.id)"
                  class="text-green-600 hover:text-green-700 text-sm"
                >
                  Approve
                </button>
                <button
                  @click="handleCancel(app.id)"
                  class="text-red-600 hover:text-red-700 text-sm"
                >
                  Cancel
                </button>
              </div>
              <span v-else class="text-gray-400 text-sm">
                {{ app.reviewed_by_username ? 'By ' + app.reviewed_by_username : '-' }}
              </span>
            </td>
            <td class="px-4 py-3 text-center">
              <button
                @click="viewLeaveForm(app.id)"
                class="text-blue-600 hover:text-blue-800 font-medium text-sm inline-flex items-center gap-1"
              >
                📄 View Form
              </button>
            </td>
          </tr>
          <tr v-if="applications.length === 0">
            <td colspan="10" class="px-4 py-8 text-center text-gray-500">No applications found</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="flex items-center justify-between px-4 py-3 border-t">
        <p class="text-sm text-gray-500">
          Page {{ currentPage }} of {{ lastPage }} ({{ total }} total applications)
        </p>
        <div class="flex gap-2">
          <button
            @click="fetchApplications(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            ← Previous
          </button>
          <button
            @click="fetchApplications(currentPage + 1)"
            :disabled="currentPage === lastPage"
            class="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      </div>
    </div>

    <!-- PDF Preview -->
    <div
      v-if="pdfUrl"
      class="mt-8 bg-white rounded-lg shadow border border-gray-200 overflow-hidden"
    >
      <div class="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
        <span class="font-bold text-gray-700 text-sm">Form Document View</span>
        <button @click="pdfUrl = null" class="text-xs text-red-500 hover:underline">
          Close View
        </button>
      </div>
      <div class="h-[600px]">
        <iframe :src="pdfUrl" class="w-full h-full border-0"></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

const applications = ref([])
const loading = ref(true)
const filterStatus = ref('')
const pdfUrl = ref(null)
const currentPage = ref(1)
const lastPage = ref(1)
const total = ref(0)

const search = ref('')
const selectedDepartment = ref('')
const selectedYear = ref(new Date().getFullYear())
const departments = ref([])
let searchTimeout = null

function debounceSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchApplications(1)
  }, 500)
}

async function fetchApplications(page = 1) {
  loading.value = true
  try {
    const params = new URLSearchParams({ page })
    if (filterStatus.value) params.append('status', filterStatus.value)
    if (search.value) params.append('search', search.value)
    if (selectedDepartment.value) params.append('department_id', selectedDepartment.value)
    if (selectedYear.value) params.append('year', selectedYear.value)

    const response = await api.get(`/leave-applications?${params}`)
    applications.value = response.data.data
    currentPage.value = response.data.current_page
    lastPage.value = response.data.last_page
    total.value = response.data.total
  } catch (error) {
    console.error('Error fetching applications:', error)
    applications.value = []
  } finally {
    loading.value = false
  }
}

function setFilter(status) {
  filterStatus.value = status
  fetchApplications(1) // reset to page 1 when filter changes
}

async function handleApprove(id) {
  if (confirm('Are you sure you want to approve this leave application?')) {
    try {
      await api.post(`/leave-applications/${id}/approve`)
      await fetchApplications(currentPage.value)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve')
    }
  }
}

async function handleCancel(id) {
  if (confirm('Are you sure you want to cancel this leave application?')) {
    try {
      await api.post(`/leave-applications/${id}/cancel`)
      await fetchApplications(currentPage.value)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel')
    }
  }
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  return dateString.toString().split('T')[0]
}

async function viewLeaveForm(id) {
  loading.value = true
  try {
    const response = await api.get(`/leave-applications/${id}/pdf`, {
      responseType: 'blob',
    })
    if (pdfUrl.value) URL.revokeObjectURL(pdfUrl.value)
    const file = new Blob([response.data], { type: 'application/pdf' })
    pdfUrl.value = URL.createObjectURL(file)
  } catch (error) {
    console.error('Failed to load PDF:', error)
    alert('Could not generate leave form.')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchApplications()
  try {
    const deptResponse = await api.get('/departments')
    departments.value = deptResponse.data.data // ← add this
  } catch (err) {
    console.error('Error fetching departments:', err)
  }
})
</script>
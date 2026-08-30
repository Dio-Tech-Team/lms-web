<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <!-- <p class="text-[11px] uppercase tracking-wider text-teal-600 font-bold mb-1">Leave</p> -->
        <h1 class="font-serif text-2xl font-semibold text-navy-deep">Leave Applications</h1>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex gap-2 mb-5">
      <button
        v-for="tab in ['', 'pending', 'approved', 'rejected', 'cancelled']"
        :key="tab"
        @click="setFilter(tab)"
        :class="
          filterStatus === tab
            ? 'bg-navy text-white border-navy'
            : 'bg-white text-slate-600 border-sky-100 hover:bg-sky'
        "
        class="px-4 py-2 rounded-xl text-sm font-semibold border capitalize transition-colors"
      >
        {{ tab === '' ? 'All' : tab }}
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-2xl border border-sky-100 p-5 mb-6">
      <div class="grid grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-navy-deep mb-1.5">Search Employee</label>
          <input
            v-model="search"
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
            @change="fetchApplications(1)"
          >
            <option value="">All Departments</option>
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
              {{ dept.name }}
            </option>
          </select>
        </div>
        <!-- <div>
          <label class="block text-sm font-medium text-navy-deep mb-1.5">Year</label>
          <input
            v-model="selectedYear"
            type="number"
            class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            @change="fetchApplications(1)"
          />
        </div> -->
        <div>
          <label class="block text-sm font-medium text-navy-deep mb-1.5">Month</label>
          <input
            v-model="selectedMonth"
            type="month"
            class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            @change="fetchApplications(1)"
          />
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center gap-3 py-24">
      <div
        class="w-6 h-6 border-[3px] border-teal-600 border-t-transparent rounded-full animate-spin"
      ></div>
      <span class="text-slate-500 text-sm">Loading applications...</span>
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-2xl border border-sky-100 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-sky/60 border-b border-sky-100">
          <tr>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              No
            </th>

            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Employee
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Type
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Department
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Start
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              End
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Days
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Reason
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Status
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Actions
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Form
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(app, index) in applications"
            :key="app.id"
            class="border-b border-sky-100 last:border-b-0 hover:bg-sky/40 transition-colors"
          >
            <td class="px-4 py-3.5 text-slate-500 font-mono text-[12.5px]">
              {{ (currentPage - 1) * perPage + index + 1 }}
            </td>
            <td class="px-4 py-3.5 font-semibold text-navy-deep">
              {{ app.first_name }} {{ app.surname }}
            </td>
            <td class="px-4 py-3.5">
              <span
                class="bg-sky-100 text-navy px-2 py-0.5 rounded-full text-[11px] font-bold font-mono"
              >
                {{ app.leave_type_code }}
              </span>
            </td>
            <td class="px-4 py-3.5 text-slate-600">{{ app.department_name }}</td>
            <td class="px-4 py-3.5 font-mono text-[12.5px] text-slate-500">
              {{ formatDate(app.start_date) }}
            </td>
            <td class="px-4 py-3.5 font-mono text-[12.5px] text-slate-500">
              {{ formatDate(app.end_date) }}
            </td>
            <td class="px-4 py-3.5 text-slate-600">{{ app.days_applied }}</td>
            <td class="px-4 py-3.5 text-slate-600">{{ app.reason || 'N/A' }}</td>
            <td class="px-4 py-3.5">
              <span
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold capitalize"
                :class="{
                  'bg-amber-tint text-amber-700': app.status === 'pending',
                  'bg-teal-tint text-teal-700': app.status === 'approved',
                  'bg-rose-tint text-rose-700': app.status === 'rejected',
                  'bg-slate-100 text-slate-500': app.status === 'cancelled',
                }"
              >
                <span
                  class="w-1.5 h-1.5 rounded-full"
                  :class="{
                    'bg-amber-700': app.status === 'pending',
                    'bg-teal-700': app.status === 'approved',
                    'bg-rose-700': app.status === 'rejected',
                    'bg-slate-500': app.status === 'cancelled',
                  }"
                ></span>
                {{ app.status }}
              </span>
            </td>
            <td class="px-4 py-3.5">
              <div v-if="app.status === 'pending'" class="flex gap-3">
                <button
                  @click="openReview(app, 'approve')"
                  class="text-teal-700 hover:text-teal-800 font-semibold text-sm transition-colors"
                >
                  Approve
                </button>

                <button
                  @click="openReview(app, 'reject')"
                  class="text-rose-600 hover:text-rose-700 font-semibold text-sm transition-colors"
                >
                  Reject
                </button>
              </div>
              <!-- <span v-else class="text-slate-400 text-sm">
                {{ app.reviewed_by_username ? 'By ' + app.reviewed_by_username : '—' }}
              </span> -->
              <span v-else class="text-slate-400 text-sm">
                {{ app.reviewed_by_username ? 'By ' + app.reviewed_by_username : '—' }}
              </span>
            </td>
            <td class="px-4 py-3.5 text-center">
              <button
                @click="viewLeaveForm(app.id)"
                class="text-navy hover:text-navy-deep font-semibold text-sm inline-flex items-center gap-1.5 transition-colors"
              >
                📄 View
              </button>
            </td>
          </tr>
          <tr v-if="applications.length === 0">
            <td colspan="11" class="px-4 py-12 text-center text-slate-400 text-sm">
              No applications found
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="flex items-center justify-between px-5 py-4 border-t border-sky-100 bg-sky/30">
        <p class="text-[12.5px] text-slate-500">
          Page <span class="font-semibold text-navy-deep">{{ currentPage }}</span> of {{ lastPage }}
          <span class="text-slate-400">· {{ total }} total applications</span>
        </p>
        <div class="flex gap-2">
          <button
            @click="fetchApplications(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3.5 py-1.5 text-[12.5px] font-semibold border border-sky-100 rounded-lg bg-white hover:bg-sky text-navy transition-colors disabled:opacity-40 disabled:hover:bg-white"
          >
            ← Previous
          </button>
          <button
            @click="fetchApplications(currentPage + 1)"
            :disabled="currentPage === lastPage"
            class="px-3.5 py-1.5 text-[12.5px] font-semibold border border-sky-100 rounded-lg bg-white hover:bg-sky text-navy transition-colors disabled:opacity-40 disabled:hover:bg-white"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
    <ReviewApplicationModal
      :show="reviewModal.show"
      :mode="reviewModal.mode"
      :application-id="reviewModal.id"
      :employee-name="reviewModal.employeeName"
      :leave-type-code="reviewModal.leaveTypeCode"
      :days-applied="reviewModal.daysApplied"
      :remaining-balance="reviewModal.remainingBalance"
      @close="reviewModal.show = false"
      @updated="fetchApplications(currentPage)"
    />
    <!-- PDF Preview -->
    <div v-if="pdfUrl" class="mt-6 bg-white rounded-2xl border border-sky-100 overflow-hidden">
      <div class="flex items-center justify-between px-5 py-3.5 bg-sky/60 border-b border-sky-100">
        <span class="font-serif font-semibold text-navy-deep text-sm">Form Document View</span>
        <button
          @click="pdfUrl = null"
          class="text-[12.5px] font-semibold text-rose-600 hover:text-rose-700 transition-colors"
        >
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
import ReviewApplicationModal from '../../views/modals/ReviewApplicationModal.vue'

const applications = ref([])
const loading = ref(true)
const filterStatus = ref('')
const pdfUrl = ref(null)
const currentPage = ref(1)
const lastPage = ref(1)
const perPage = ref(15)
const total = ref(0)

const search = ref('')
const selectedDepartment = ref('')
const now = new Date()
const selectedMonth = ref(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)

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
    // if (selectedYear.value) params.append('year', selectedYear.value)
    if (selectedMonth.value) {
      const [year, month] = selectedMonth.value.split('-')
      params.append('year', year)
      params.append('month', month)
    }

    const response = await api.get(`/leave-applications?${params}`)
    applications.value = response.data.data
    currentPage.value = response.data.current_page
    lastPage.value = response.data.last_page
    total.value = response.data.total
    perPage.value = response.data.per_page
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

// async function handleApprove(id) {
//   if (confirm('Are you sure you want to approve this leave application?')) {
//     try {
//       await api.post(`/leave-applications/${id}/approve`)
//       await fetchApplications(currentPage.value)
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to approve')
//     }
//   }
// }
// async function handleApprove(app) {
//   let message = 'Are you sure you want to approve this leave application?'
//   if (app.remaining_balance !== null && Number(app.remaining_balance) < Number(app.days_applied)) {
//     const shortfall = (Number(app.days_applied) - Number(app.remaining_balance)).toFixed(2)
//     message = `This employee only has ${Number(app.remaining_balance).toFixed(
//       2
//     )} day(s) remaining, but applied for ${
//       app.days_applied
//     }. ${shortfall} day(s) will be recorded as Leave Without Pay. Continue?`
//   }
//   if (confirm(message)) {
//     try {
//       await api.post(`/leave-applications/${app.id}/approve`)
//       await fetchApplications(currentPage.value)
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to approve')
//     }
//   }
// }
// async function handleReject(id) {
//   if (confirm('Are you sure you want to Reject this leave application?')) {
//     try {
//       await api.post(`/leave-applications/${id}/reject`)
//       await fetchApplications(currentPage.value)
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to Reject')
//     }
//   }
// }

// async function handleReject(id) {
//   const reason = prompt('Please provide a reason for rejecting this leave application:')

//   if (reason === null) {
//     // user clicked Cancel
//     return
//   }

//   if (!reason.trim()) {
//     alert('A rejection reason is required.')
//     return
//   }

//   try {
//     await api.post(`/leave-applications/${id}/reject`, { rejection_reason: reason.trim() })
//     await fetchApplications(currentPage.value)
//   } catch (err) {
//     alert(err.response?.data?.message || 'Failed to Reject')
//   }
// }

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

const reviewModal = ref({
  show: false,
  mode: 'approve',
  id: null,
  employeeName: '',
  leaveTypeCode: '',
  daysApplied: 0,
  remainingBalance: null,
})

function openReview(app, mode) {
  reviewModal.value = {
    show: true,
    mode,
    id: app.id,
    employeeName: `${app.first_name} ${app.surname}`,
    leaveTypeCode: app.leave_type_code,
    daysApplied: app.days_applied,
    remainingBalance: app.remaining_balance,
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
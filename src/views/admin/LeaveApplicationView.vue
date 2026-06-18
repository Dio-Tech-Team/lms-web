<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-700">Leave Applications</h1>
    </div>

    <!-- Filter Tabs -->
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
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Leave Type</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Start Date</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">End Date</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Days</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Reason</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="app in filteredApplications" :key="app.id" class="border-b hover:bg-gray-50">
            <td class="px-4 py-3">{{ app.employee }}</td>
            <td class="px-4 py-3">
              <span class="bg-gray-100 text-white-700 px-2 py-1 rounded text-xs font-medium">
                {{ app.code }}
              </span>
            </td>
            <td class="px-4 py-3">{{ app.start_date }}</td>
            <td class="px-4 py-3">{{ app.end_date }}</td>
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
          </tr>
          <tr v-if="filteredApplications.length === 0">
            <td colspan="8" class="px-4 py-8 text-center text-gray-500">No applications found</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/api/axios'

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
    applications.value = response.data
  } catch (error) {
    console.error('Error fetching applications:', error)
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
</script>
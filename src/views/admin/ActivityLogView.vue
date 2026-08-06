<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-700">Activity Logs</h1>
    </div>

    <div class="flex gap-3 mb-4">
      <select
        v-model="selectedAction"
        @change="fetchLogs(1)"
        class="border border-sky-200 rounded-lg px-3 py-1.5 text-sm text-navy-deep font-semibold bg-white"
      >
        <option value="">All Actions</option>
        <option v-for="action in actionOptions" :key="action" :value="action">{{ action }}</option>
      </select>

      <select
        v-model="selectedRole"
        @change="fetchLogs(1)"
        class="border border-sky-200 rounded-lg px-3 py-1.5 text-sm text-navy-deep font-semibold bg-white"
      >
        <option value="">All Roles</option>
        <option value="hr_admin">HR Admin</option>
        <option value="super_admin">Super Admin</option>
        <option value="employee">Employee</option>
      </select>

      <button
        v-if="selectedAction || selectedRole"
        @click="clearFilters"
        class="px-3.5 py-1.5 text-[12.5px] font-semibold border border-sky-100 rounded-lg bg-white hover:bg-sky text-navy transition-colors"
      >
        Clear filters
      </button>
    </div>

    <div class="bg-white rounded-2xl border border-sky-100 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-sky/60 border-b border-sky-100">
          <tr>
            <th
              class="text-left px-5 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              When
            </th>
            <th
              class="text-left px-5 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              User
            </th>
            <th
              class="text-left px-5 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Action
            </th>
            <th
              class="text-left px-5 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="log in logs"
            :key="log.id"
            class="border-b border-sky-100 last:border-b-0 hover:bg-sky/40 transition-colors"
          >
            <td class="px-5 py-3.5 text-slate-500 whitespace-nowrap">
              {{ formatDate(log.created_at) }}
            </td>
            <td class="px-5 py-3.5">
              <p class="font-semibold text-navy-deep">{{ log.user?.username ?? 'Unknown' }}</p>
              <p class="text-[12px] text-slate-400 capitalize">
                {{ log.user?.role?.replace('_', ' ') }}
              </p>
            </td>
            <td class="px-5 py-3.5">
              <span
                class="bg-sky-100 text-navy px-2 py-0.5 rounded-full text-[11px] font-bold font-mono"
                >{{ log.action }}</span
              >
            </td>
            <td class="px-5 py-3.5 text-slate-600">{{ log.description }}</td>
          </tr>
          <tr v-if="logs.length === 0">
            <td colspan="4" class="px-5 py-12 text-center text-slate-400 text-sm">
              No activity yet
            </td>
          </tr>
        </tbody>
      </table>

      <div class="flex items-center justify-between px-5 py-4 border-t border-sky-100 bg-sky/30">
        <p class="text-[12.5px] text-slate-500">
          Page <span class="font-semibold text-navy-deep">{{ currentPage }}</span> of {{ lastPage }}
        </p>
        <div class="flex gap-2">
          <button
            @click="fetchLogs(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3.5 py-1.5 text-[12.5px] font-semibold border border-sky-100 rounded-lg bg-white hover:bg-sky text-navy transition-colors disabled:opacity-40 disabled:hover:bg-white"
          >
            ← Previous
          </button>
          <button
            @click="fetchLogs(currentPage + 1)"
            :disabled="currentPage === lastPage"
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

const logs = ref([])
const currentPage = ref(1)
const lastPage = ref(1)

const actionOptions = ref([])
const selectedAction = ref('')
const selectedRole = ref('')

async function fetchLogs(page = 1) {
  try {
    const response = await api.get('/activity-logs', {
      params: {
        page,
        action: selectedAction.value || undefined,
        role: selectedRole.value || undefined,
      },
    })
    logs.value = response.data.data
    currentPage.value = response.data.current_page
    lastPage.value = response.data.last_page
  } catch (error) {
    console.error('Error fetching activity logs:', error)
  }
}

function clearFilters() {
  selectedAction.value = ''
  selectedRole.value = ''
  fetchLogs(1)
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleString('en-PH', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(async () => {
  fetchLogs()
  try {
    const actionsRes = await api.get('/activity-logs/actions')
    actionOptions.value = actionsRes.data
  } catch (error) {
    console.error('Error fetching filter options:', error)
  }
})
</script>
<template>
  <div>
    <div
      v-if="message"
      class="text-sm rounded-lg px-3.5 py-2.5 mb-4 font-medium flex items-center justify-between"
      :class="
        message.type === 'success' ? 'bg-teal-tint text-teal-700' : 'bg-rose-tint text-rose-700'
      "
    >
      {{ message.text }}
      <button
        @click="message = null"
        class="font-bold ml-3"
        :class="message.type === 'success' ? 'hover:text-teal-800' : 'hover:text-rose-800'"
      >
        ✕
      </button>
    </div>
    <div class="mb-7 flex items-center justify-between">
      <h1 class="font-serif text-2xl font-semibold text-navy-deep">Dashboard</h1>
      <div class="flex items-center gap-3">
        <button
          @click="handleInitializeAll"
          :disabled="initializing"
          class="text-sm font-semibold text-teal-700 border border-teal-200 rounded-lg px-3 py-1.5 bg-white hover:bg-teal-50 disabled:opacity-50"
        >
          {{ initializing ? 'Initializing…' : 'Initialize Credits' }}
        </button>
        <select
          v-model="selectedYear"
          class="border border-sky-200 rounded-lg px-3 py-1.5 text-sm text-navy-deep font-semibold bg-white"
        >
          <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center gap-3 py-24">
      <div
        class="w-6 h-6 border-[3px] border-teal-600 border-t-transparent rounded-full animate-spin"
      ></div>
      <span class="text-slate-500 text-sm">Loading dashboard...</span>
    </div>
    <div
      v-else-if="hasError"
      class="flex flex-col items-center justify-center gap-2 py-24 text-center"
    >
      <p class="text-slate-600 font-semibold">Couldn't load dashboard data.</p>
      <p class="text-slate-400 text-sm">Please refresh the page or try again in a moment.</p>
    </div>

    <template v-else>
      <!-- Stat Row -->
      <div class="grid grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-2xl border border-sky-100 p-5">
          <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold">
            Total Employees
          </p>
          <p class="font-serif text-3xl font-semibold text-navy-deep mt-1.5">
            {{ totalEmployees }}
          </p>
          <p class="text-[12px] text-slate-400 mt-1.5">
            {{ permanentEmployees }} permanent · {{ casualEmployees }} casual
          </p>
        </div>

        <div class="bg-white rounded-2xl border border-sky-100 p-5">
          <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold">
            Active Employees
          </p>
          <p class="font-serif text-3xl font-semibold text-navy-deep mt-1.5">
            {{ activeEmployees }}
          </p>
          <p class="text-[12px] text-teal-700 font-semibold mt-1.5">
            {{ inactiveEmployees }} inactive
          </p>
        </div>

        <div class="bg-white rounded-2xl border border-sky-100 p-5">
          <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold">
            Pending Applications
          </p>
          <p class="font-serif text-3xl font-semibold text-navy-deep mt-1.5">
            {{ leaveStats.pending_count }}
          </p>
          <p class="text-[12px] text-amber-700 font-semibold mt-1.5">awaiting HR review</p>
        </div>

        <div class="bg-white rounded-2xl border border-sky-100 p-5">
          <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold">
            Approved This Year
          </p>
          <p class="font-serif text-3xl font-semibold text-navy-deep mt-1.5">
            {{ leaveStats.approved_count }}
          </p>
          <p class="text-[12px] text-slate-400 mt-1.5">
            {{ leaveStats.cancelled_count }} cancelled
          </p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-5 mb-6">
        <!-- Recent Applications -->
        <div class="bg-white rounded-2xl border border-sky-100 p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-serif text-lg font-semibold text-navy-deep">
              Recent Leave Applications
            </h2>
            <RouterLink
              to="/leave-applications"
              class="text-[12.5px] font-semibold text-teal-700 hover:text-teal-800"
            >
              View all →
            </RouterLink>
          </div>
          <table class="w-full text-sm">
            <tbody>
              <tr
                v-for="app in recentApplications"
                :key="app.id"
                class="border-b border-sky-100 last:border-b-0"
              >
                <td class="py-2.5 pr-3">
                  <p class="font-semibold text-navy-deep">{{ app.first_name }} {{ app.surname }}</p>
                  <p class="text-[12px] text-slate-400">{{ app.department_name }}</p>
                </td>
                <td class="py-2.5 pr-3">
                  <span
                    class="bg-sky-100 text-navy px-2 py-0.5 rounded-full text-[11px] font-bold font-mono"
                  >
                    {{ app.leave_type_code }}
                  </span>
                </td>
                <td class="py-2.5">
                  <span
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold capitalize"
                    :class="{
                      'bg-amber-tint text-amber-700': app.status === 'pending',
                      'bg-teal-tint text-teal-700': app.status === 'approved',
                      'bg-rose-tint text-rose-700': app.status === 'cancelled',
                    }"
                  >
                    {{ app.status }}
                  </span>
                </td>
              </tr>
              <tr v-if="recentApplications.length === 0">
                <td class="py-8 text-center text-slate-400 text-sm">No applications yet</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Department Breakdown -->
        <div class="bg-white rounded-2xl border border-sky-100 p-6">
          <div class="flex items-center justify-between mb-5">
            <h2 class="font-serif text-lg font-semibold text-navy-deep">Employees by Department</h2>
            <span class="font-mono text-[10.5px] text-slate-400"
              >{{ departmentBreakdown.length }} DEPTS</span
            >
          </div>
          <div class="space-y-3.5 max-h-64 overflow-y-auto pr-1">
            <div
              v-for="dept in departmentBreakdown"
              :key="dept.name"
              class="flex items-center gap-3"
            >
              <div
                class="w-44 text-[12.5px] font-semibold text-navy-deep flex-shrink-0 truncate"
                :title="dept.name"
              >
                {{ dept.name }}
              </div>
              <div class="flex-1 h-2 bg-sky-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-navy to-teal-600 rounded-full"
                  :style="{ width: (dept.count / maxDeptCount) * 100 + '%' }"
                ></div>
              </div>
              <div class="w-8 text-right font-mono text-[12px] text-slate-500 flex-shrink-0">
                {{ dept.count }}
              </div>
            </div>
            <p
              v-if="departmentBreakdown.length === 0"
              class="text-center text-slate-400 text-sm py-6"
            >
              No department data yet
            </p>
          </div>
        </div>
      </div>

      <!-- Analytics Row -->
      <div class="grid grid-cols-2 gap-5 mb-6">
        <div class="bg-white rounded-2xl border border-sky-100 p-6">
          <h2 class="font-serif text-lg font-semibold text-navy-deep mb-4">
            Leave Applications — {{ selectedYear }}
          </h2>
          <Line
            v-if="trendChartData"
            :data="trendChartData"
            :options="chartOptions"
            class="max-h-64"
          />
        </div>

        <div class="bg-white rounded-2xl border border-sky-100 p-6">
          <h2 class="font-serif text-lg font-semibold text-navy-deep mb-4">Leave Type Breakdown</h2>
          <Doughnut
            v-if="typeChartData"
            :data="typeChartData"
            :options="doughnutOptions"
            class="max-h-64"
          />
        </div>
      </div>

      <!-- Low Credit Alerts -->
      <div class="bg-white rounded-2xl border border-sky-100 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-serif text-lg font-semibold text-navy-deep">Low Leave Credit Alerts</h2>
          <span class="font-mono text-[10.5px] text-slate-400">VL/SL BELOW 3 DAYS</span>
        </div>
        <table class="w-full text-sm">
          <tbody>
            <tr
              v-for="credit in leaveStats.low_credit_alerts"
              :key="credit.id"
              class="border-b border-sky-100 last:border-b-0"
            >
              <td class="py-2.5 pr-3">
                <p class="font-semibold text-navy-deep">
                  {{ credit.employee?.first_name }} {{ credit.employee?.surname }}
                </p>
                <p class="text-[12px] text-slate-400">{{ credit.employee?.department?.name }}</p>
              </td>
              <td class="py-2.5 pr-3">
                <span
                  class="bg-sky-100 text-navy px-2 py-0.5 rounded-full text-[11px] font-bold font-mono"
                >
                  {{ credit.leave_configuration?.code }}
                </span>
              </td>
              <td class="py-2.5 text-right font-mono text-rose-700 font-bold">
                {{ credit.remaining_balance }} days
              </td>
            </tr>
            <tr v-if="!leaveStats.low_credit_alerts || leaveStats.low_credit_alerts.length === 0">
              <td colspan="3" class="py-8 text-center text-slate-400 text-sm">
                No low-credit employees
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useConfirm } from '@/composables/useConfirm' // adjust path if yours differs
import api from '@/api/axios'
import { Line, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement
)

const stats = ref({
  total: 0,
  active: 0,
  inactive: 0,
  permanent: 0,
  casual: 0,
  department_breakdown: [],
})
const leaveStats = ref({
  pending_count: 0,
  approved_count: 0,
  cancelled_count: 0,
  monthly_trend: [],
  leave_type_breakdown: [],
  low_credit_alerts: [],
})
const applications = ref([])
const loading = ref(true)
const hasError = ref(false)
const { confirm } = useConfirm()
const initializing = ref(false)
const message = ref(null)

const currentYear = new Date().getFullYear()
const selectedYear = ref(currentYear)
// const availableYears = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3]
const availableYears = [currentYear + 1, currentYear, currentYear - 1, currentYear - 2]

const totalEmployees = computed(() => stats.value.total)
const activeEmployees = computed(() => stats.value.active)
const inactiveEmployees = computed(() => stats.value.inactive)
const permanentEmployees = computed(() => stats.value.permanent)
const casualEmployees = computed(() => stats.value.casual)

watch(selectedYear, fetchLeaveStats)

const departmentBreakdown = computed(() =>
  stats.value.department_breakdown.map((d) => ({ name: d.department_name, count: d.count }))
)
const maxDeptCount = computed(() => Math.max(1, ...departmentBreakdown.value.map((d) => d.count)))

const recentApplications = computed(() => applications.value.slice(0, 5))

const trendChartData = computed(() => {
  if (!leaveStats.value.monthly_trend?.length) return null
  return {
    labels: leaveStats.value.monthly_trend.map((m) => m.month),
    datasets: [
      {
        label: 'Applications',
        data: leaveStats.value.monthly_trend.map((m) => m.count),
        borderColor: '#0d9488',
        backgroundColor: 'rgba(13, 148, 136, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  }
})

async function fetchLeaveStats() {
  try {
    const res = await api.get('/dashboard/leave-stats', { params: { year: selectedYear.value } })
    leaveStats.value = res.data
  } catch (error) {
    console.error('Error fetching leave stats:', error)
    hasError.value = true
  }
}

const typeChartData = computed(() => {
  if (!leaveStats.value.leave_type_breakdown?.length) return null
  return {
    labels: leaveStats.value.leave_type_breakdown.map((t) => t.code),
    datasets: [
      {
        data: leaveStats.value.leave_type_breakdown.map((t) => t.count),
        backgroundColor: ['#0d9488', '#f59e0b', '#0369a1', '#e11d48', '#8b5cf6', '#64748b'],
      },
    ],
  }
})

async function handleInitializeAll() {
  const ok = await confirm({
    title: 'Initialize Leave Credits',
    message: `This will initialize leave credits for every active employee for ${selectedYear.value}. Employees who already have credits for this year are skipped. Continue?`,
  })
  if (!ok) return

  initializing.value = true
  message.value = null
  try {
    const res = await api.post('/employees/leave-credits/initialize-all', {
      year: selectedYear.value,
    })
    message.value = { type: 'success', text: res.data.message }
    await fetchLeaveStats()
  } catch (error) {
    console.error('Error initializing credits:', error)
    message.value = {
      type: 'error',
      text: error.response?.data?.message || 'Failed to initialize leave credits.',
    }
  } finally {
    initializing.value = false
  }
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
}
const doughnutOptions = { responsive: true, maintainAspectRatio: false }

onMounted(async () => {
  try {
    const [statsResponse, leaveStatsResponse, appResponse] = await Promise.all([
      api.get('/employees/stats'),
      api.get('/dashboard/leave-stats'),
      api.get('/leave-applications'),
    ])
    stats.value = statsResponse.data
    leaveStats.value = leaveStatsResponse.data
    applications.value = appResponse.data.data || appResponse.data || []
    await fetchLeaveStats()
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    hasError.value = true
  } finally {
    loading.value = false
  }
})
</script>
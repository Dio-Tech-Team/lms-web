<template>
  <div>
    <div class="mb-7">
      <!-- <p class="text-[11px] uppercase tracking-wider text-teal-600 font-bold mb-1">Overview</p> -->
      <h1 class="text-2xl font-bold text-gray-700">Dashboard</h1>
      <!-- <p class="text-slate-500 text-sm mt-1">
        Where leave credits, applications, and employee records stand today.
      </p> -->
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center gap-3 py-24">
      <div
        class="w-6 h-6 border-[3px] border-teal-600 border-t-transparent rounded-full animate-spin"
      ></div>
      <span class="text-slate-500 text-sm">Loading dashboard...</span>
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
          <p class="font-serif text-3xl font-semibold text-navy-deep mt-1.5">{{ pendingCount }}</p>
          <p class="text-[12px] text-amber-700 font-semibold mt-1.5">awaiting HR review</p>
        </div>

        <div class="bg-white rounded-2xl border border-sky-100 p-5">
          <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold">
            Approved This Year
          </p>
          <p class="font-serif text-3xl font-semibold text-navy-deep mt-1.5">{{ approvedCount }}</p>
          <p class="text-[12px] text-slate-400 mt-1.5">{{ cancelledCount }} cancelled</p>
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
          <div class="space-y-3.5">
            <div
              v-for="dept in departmentBreakdown"
              :key="dept.name"
              class="flex items-center gap-3"
            >
              <div class="w-32 text-[12.5px] font-semibold text-navy-deep flex-shrink-0 truncate">
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
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/api/axios'

const stats = ref({
  total: 0,
  active: 0,
  inactive: 0,
  permanent: 0,
  casual: 0,
  department_breakdown: [],
})
const applications = ref([])
const loading = ref(true)

const totalEmployees = computed(() => stats.value.total)
const activeEmployees = computed(() => stats.value.active)
const inactiveEmployees = computed(() => stats.value.inactive)
const permanentEmployees = computed(() => stats.value.permanent)
const casualEmployees = computed(() => stats.value.casual)

const departmentBreakdown = computed(() =>
  stats.value.department_breakdown.map((d) => ({ name: d.department_name, count: d.count }))
)
const maxDeptCount = computed(() => Math.max(1, ...departmentBreakdown.value.map((d) => d.count)))

const pendingCount = computed(() => applications.value.filter((a) => a.status === 'pending').length)
const approvedCount = computed(
  () => applications.value.filter((a) => a.status === 'approved').length
)
const cancelledCount = computed(
  () => applications.value.filter((a) => a.status === 'cancelled').length
)

const recentApplications = computed(() => applications.value.slice(0, 5))

onMounted(async () => {
  try {
    const [statsResponse, appResponse] = await Promise.all([
      api.get('/employees/stats'),
      api.get('/leave-applications'),
    ])
    stats.value = statsResponse.data
    applications.value = appResponse.data.data || appResponse.data || []
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  } finally {
    loading.value = false
  }
})
</script>
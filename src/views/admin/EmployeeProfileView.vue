<template>
  <div>
    <button
      @click="goBack"
      class="flex items-center gap-1.5 text-slate-500 text-sm mb-5 hover:text-navy transition-colors font-medium"
    >
      ← Back to Employees
    </button>

    <div v-if="loading" class="flex items-center justify-center gap-3 py-24">
      <div
        class="w-6 h-6 border-[3px] border-teal-600 border-t-transparent rounded-full animate-spin"
      ></div>
      <span class="text-slate-500 text-sm">Loading employee record...</span>
    </div>

    <!-- Profile Content -->
    <div v-else-if="employee">
      <!-- Profile Header -->
      <div class="bg-white rounded-2xl border border-sky-100 p-7 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[11px] uppercase tracking-wider text-teal-600 font-bold mb-1.5">
              {{ employee.department?.name || employee.department || 'LGU Echague' }}
            </p>
            <h1 class="font-serif text-2xl font-semibold text-navy-deep">
              {{ employee.first_name }} {{ employee.middle_name }}. {{ employee.surname }}
            </h1>
            <p class="text-slate-500 text-sm mt-1">{{ employee.position }}</p>
            <div class="flex gap-2 mt-3">
              <span
                class="px-2.5 py-1 rounded-full text-[11px] font-bold"
                :class="
                  employee.is_active ? 'bg-teal-tint text-teal-700' : 'bg-gray-100 text-slate-500'
                "
              >
                {{ employee.is_active ? 'Active' : 'Inactive' }}
              </span>
              <span
                class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-100 text-navy capitalize"
              >
                {{ employee.employment_status?.replace('_', ' ') }}
              </span>
            </div>
          </div>
          <div class="flex gap-2">
            <button
              @click="showEditModal = true"
              class="bg-white border border-sky-100 text-navy px-4 py-2 rounded-xl text-sm font-semibold hover:bg-sky transition-colors"
            >
              Edit
            </button>
            <button
              v-if="employee.is_active"
              @click="handleDeactivate"
              class="bg-navy text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-navy-deep transition-colors"
            >
              Deactivate
            </button>
          </div>
        </div>
      </div>

      <!-- Personal & Employment Info -->
      <div class="grid grid-cols-2 gap-5 mb-6">
        <!-- Personal Information -->
        <div class="bg-white rounded-2xl border border-sky-100 p-6">
          <h2 class="font-serif text-lg font-semibold text-navy-deep mb-4">Personal Information</h2>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                ID Number
              </p>
              <p class="font-mono text-[13px] text-navy-deep">{{ employee.id_number || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                Email
              </p>
              <p class="font-medium text-ink">{{ employee.email || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                Contact Number
              </p>
              <p class="font-mono text-[13px] text-navy-deep">
                {{ employee.contact_number || 'N/A' }}
              </p>
            </div>
            <div>
              <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                Sex / Civil Status
              </p>
              <p class="font-medium text-ink capitalize">
                {{ employee.sex || 'N/A' }} / {{ employee.civil_status || 'N/A' }}
              </p>
            </div>
            <div>
              <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                Birthdate
              </p>
              <p class="font-mono text-[13px] text-navy-deep">
                {{ formatDate(employee?.birthdate) }}
              </p>
            </div>
            <div>
              <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                Place of Birth
              </p>
              <p class="font-medium text-ink">{{ employee.place_of_birth || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                Height / Weight
              </p>
              <p class="font-medium text-ink">
                {{ employee.height ? employee.height + 'cm' : 'N/A' }} /
                {{ employee.weight ? employee.weight + 'kg' : 'N/A' }}
              </p>
            </div>
            <div>
              <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                Blood Type
              </p>
              <p class="font-medium text-ink">{{ employee.bloodtype || 'N/A' }}</p>
            </div>
            <div class="col-span-2">
              <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                Educational Attainment
              </p>
              <p class="font-medium text-ink capitalize">
                {{ employee.highest_educational_attainment || 'N/A' }}
              </p>
            </div>
            <div class="col-span-2">
              <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                Residential Address
              </p>
              <p class="font-medium text-ink">{{ employee.residential_address || 'N/A' }}</p>
            </div>
          </div>
        </div>

        <!-- Right column: Employment + Government IDs stacked -->
        <div class="flex flex-col gap-5">
          <div class="bg-white rounded-2xl border border-sky-100 p-6">
            <h2 class="font-serif text-lg font-semibold text-navy-deep mb-4">
              Employment Information
            </h2>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                  Department
                </p>
                <p class="font-medium text-ink">
                  {{ employee.department?.name || employee.department || 'N/A' }}
                </p>
              </div>
              <div>
                <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                  Employment Status
                </p>
                <p class="font-medium text-ink capitalize">
                  {{ employee.employment_status?.replace('_', ' ') }}
                </p>
              </div>
              <div class="col-span-2">
                <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                  Date Hired
                </p>
                <p class="font-mono text-[13px] text-navy-deep">
                  {{ formatDate(employee?.date_hired) }}
                </p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl border border-sky-100 p-6">
            <h2 class="font-serif text-lg font-semibold text-navy-deep mb-4">
              Statutory Identifications
            </h2>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                  TIN
                </p>
                <p class="font-mono text-[13px] text-navy-deep">
                  {{ employee.tin_number || 'N/A' }}
                </p>
              </div>
              <div>
                <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                  UMID
                </p>
                <p class="font-mono text-[13px] text-navy-deep">{{ employee.umid_id || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                  Pag-IBIG
                </p>
                <p class="font-mono text-[13px] text-navy-deep">
                  {{ employee.pagibig_id || 'N/A' }}
                </p>
              </div>
              <div>
                <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                  PhilHealth
                </p>
                <p class="font-mono text-[13px] text-navy-deep">
                  {{ employee.philhealth_number || 'N/A' }}
                </p>
              </div>
              <div class="col-span-2">
                <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                  PSN
                </p>
                <p class="font-mono text-[13px] text-navy-deep">
                  {{ employee.psn_number || 'N/A' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Career Milestones -->
      <div class="bg-white rounded-2xl border border-sky-100 p-6 mb-6">
        <h2 class="font-serif text-lg font-semibold text-navy-deep mb-4">Career Progression</h2>
        <div class="grid grid-cols-3 gap-4">
          <!-- Step Increment -->
          <div class="border border-sky-100 rounded-xl p-4 bg-sky/30">
            <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
              Step Increment
            </p>
            <p
              v-if="employee.step_increment?.current_step"
              class="font-serif text-2xl font-semibold text-navy-deep"
            >
              Step {{ employee.step_increment.current_step }}
            </p>
            <p v-else class="text-sm text-slate-400 italic">
              {{ employee.step_increment?.message || 'N/A' }}
            </p>
            <p
              v-if="employee.step_increment?.next_step_date"
              class="text-xs text-slate-500 mt-2 font-mono"
            >
              Next step: {{ employee.step_increment.next_step_date }}
            </p>
            <button
              v-if="employee.step_increment?.all_steps?.length > 0"
              @click="showAllSteps = !showAllSteps"
              class="text-xs text-teal-700 hover:text-teal-800 font-semibold mt-2.5"
            >
              {{ showAllSteps ? 'Hide all steps' : 'View all steps' }}
            </button>
            <div
              v-if="showAllSteps && employee.step_increment?.all_steps?.length > 0"
              class="mt-3 pt-3 border-t border-sky-100 space-y-1.5"
            >
              <div
                v-for="s in employee.step_increment.all_steps"
                :key="s.step"
                class="flex justify-between text-xs"
                :class="{
                  'text-slate-400': s.status === 'reached',
                  'text-navy-deep font-bold': s.status === 'current',
                  'text-slate-300': s.status === 'upcoming',
                }"
              >
                <span>Step {{ s.step }}</span>
                <span class="font-mono">{{ s.date }}</span>
              </div>
            </div>
          </div>

          <!-- Loyalty Pay -->
          <div class="border border-sky-100 rounded-xl p-4 bg-sky/30">
            <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
              Loyalty Pay
            </p>
            <p
              v-if="employee.loyalty_pay?.years_until_next !== null"
              class="font-serif text-2xl font-semibold text-navy-deep"
            >
              {{ employee.loyalty_pay?.years_served?.toFixed(0) ?? 0 }} yrs
            </p>
            <p v-else class="text-sm text-slate-400 italic">
              {{ employee.loyalty_pay?.message || 'N/A' }}
            </p>
            <p
              v-if="employee.loyalty_pay?.eligible"
              class="text-xs text-teal-700 font-semibold mt-2"
            >
              {{ employee.loyalty_pay.milestones_received }} Loyalty Pay received
            </p>
            <p
              v-if="employee.loyalty_pay?.years_until_next !== null"
              class="text-xs text-slate-500 mt-1"
            >
              Next: {{ employee.loyalty_pay?.next_milestone }} yrs ({{
                employee.loyalty_pay?.years_until_next?.toFixed(1)
              }}
              yrs to go)
            </p>
          </div>

          <!-- Retirement -->
          <div class="border border-sky-100 rounded-xl p-4 bg-sky/30">
            <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
              Retirement
            </p>
            <p class="font-serif text-2xl font-semibold text-navy-deep">
              {{ employee.retirement?.current_age ?? 'N/A' }} yrs old
            </p>
            <p
              v-if="employee.retirement?.eligible_now"
              class="text-xs text-rose-600 mt-2 font-semibold"
            >
              Eligible for retirement
            </p>
            <p v-else class="text-xs text-slate-500 mt-2 font-mono">
              Retirement date: {{ employee.retirement?.retirement_date }}
            </p>
          </div>
        </div>
      </div>

      <!-- Employment History -->
      <div class="bg-white rounded-2xl border border-sky-100 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-serif text-lg font-semibold text-navy-deep">Employment History</h2>
          <button
            @click="showPromotionModal = true"
            class="bg-navy text-white px-3.5 py-2 rounded-xl text-sm font-semibold hover:bg-navy-deep transition-colors"
          >
            Update Employment Status
          </button>
        </div>

        <div v-if="employee.employment_history && employee.employment_history.length > 0">
          <table class="w-full text-sm">
            <thead class="bg-sky/60 border-b border-sky-100">
              <tr>
                <th
                  class="text-left px-4 py-3 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
                >
                  Previous Position
                </th>
                <th
                  class="text-left px-4 py-3 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
                >
                  New Position
                </th>
                <th
                  class="text-left px-4 py-3 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
                >
                  Employment Status
                </th>
                <th
                  class="text-left px-4 py-3 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
                >
                  Effective Date
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="employment in showAllHistory
                  ? employee.employment_history
                  : employee.employment_history.slice(0, 1)"
                :key="employment.id"
                class="border-b border-sky-100 last:border-b-0 hover:bg-sky/40 transition-colors"
              >
                <td class="px-4 py-3 text-slate-600">{{ employment.previous_position || '' }}</td>
                <td class="px-4 py-3 font-semibold text-navy-deep">
                  {{ employment.new_position }}
                </td>
                <td class="px-4 py-3 text-slate-600 capitalize">
                  {{ employment.new_employment_status?.replace('_', ' ') }}
                </td>
                <td class="px-4 py-3 text-slate-500 font-mono text-[12.5px]">
                  {{ employment.effective_date }}
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="employee.employment_history.length > 1" class="mt-3 flex justify-start">
            <button
              @click="showAllHistory = !showAllHistory"
              type="button"
              class="text-xs text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1 transition-colors"
            >
              {{
                showAllHistory
                  ? 'Hide historical records'
                  : `View all history (${employee.employment_history.length} records)`
              }}
              <span>{{ showAllHistory ? '▲' : '▼' }}</span>
            </button>
          </div>
        </div>
        <div v-else class="text-slate-400 text-sm italic py-4">
          No employment history recorded yet.
        </div>
      </div>

      <!-- Leave Balance -->
      <div class="bg-white rounded-2xl border border-sky-100 p-6 mt-6">
        <div class="flex items-center justify-between mb-5">
          <h2 class="font-serif text-lg font-semibold text-navy-deep">Leave Balance</h2>
          <div class="flex gap-2">
            <button
              @click="showLeaveEntryModal = true"
              class="text-[12.5px] font-semibold text-white bg-teal-600 rounded-xl px-3.5 py-1.5 hover:bg-teal-700 transition-colors"
            >
              Apply Leave
            </button>
            <button
              @click="showAllCredits = !showAllCredits"
              class="text-[12.5px] font-semibold text-teal-700 border border-teal-100 rounded-xl px-3.5 py-1.5 hover:bg-teal-50 transition-colors"
            >
              {{ showAllCredits ? 'Show Less' : 'Show Privileges' }}
            </button>
            <button
              @click="showLeaveCard = true"
              class="text-[12.5px] font-semibold text-navy border border-sky-100 rounded-xl px-3.5 py-1.5 hover:bg-sky transition-colors"
            >
              View Leave Card
            </button>
          </div>
        </div>

        <div v-if="filteredCredits.length > 0" class="grid grid-cols-2 gap-4">
          <div
            v-for="credit in filteredCredits"
            :key="credit.id"
            class="border border-dashed border-sky-100 rounded-xl p-4"
          >
            <div class="flex items-center justify-between mb-3">
              <span class="font-semibold text-navy-deep">{{ credit.leave_type }}</span>
              <span
                class="bg-sky-100 text-navy px-2 py-0.5 rounded-full text-[11px] font-bold font-mono"
              >
                {{ credit.code }}
              </span>
            </div>
            <div class="grid grid-cols-3 gap-2 text-center">
              <div>
                <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                  Total
                </p>
                <p class="font-serif text-lg font-semibold text-navy-deep">
                  {{ Number(credit.total_credits).toFixed(3) }}
                </p>
              </div>
              <div>
                <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                  Used
                </p>
                <p class="font-serif text-lg font-semibold text-rose-600">
                  {{ Number(credit.used_credits).toFixed(3) }}
                </p>
              </div>
              <div>
                <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                  Remaining
                </p>
                <p class="font-serif text-lg font-semibold text-teal-700">
                  {{ Number(credit.remaining_balance).toFixed(3) }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-slate-500 text-sm">
          No leave credits found.
          <button
            @click="initializeCredits"
            class="text-teal-700 hover:text-teal-800 font-semibold ml-1"
          >
            Initialize Credits
          </button>
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="text-center py-14 text-slate-400 text-sm">Employee not found.</div>

    <!-- Modals: each owns its own form state + API call now, parent just
         passes IDs/data in and listens for close/updated -->
    <EditEmployeeModal
      :show="showEditModal"
      :employee-id="route.params.id"
      :employee="employee"
      :departments="departments"
      @close="showEditModal = false"
      @updated="fetchEmployee"
    />

    <PromotionModal
      :show="showPromotionModal"
      :employee-id="route.params.id"
      :employee="employee"
      @close="showPromotionModal = false"
      @updated="fetchEmployee"
    />

    <LeaveCardModal
      :show="showLeaveCard"
      :employee-id="route.params.id"
      @close="showLeaveCard = false"
    />
    <LeaveEntryModal
      :show="showLeaveEntryModal"
      :employee-id="route.params.id"
      :leave-types="leaveTypes"
      @close="showLeaveEntryModal = false"
      @updated="fetchEmployee"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/api/axios'
import EditEmployeeModal from '../../views/modals/EditEmployeeModal.vue'
import PromotionModal from '../../views/modals/PromotionModal.vue'
import LeaveCardModal from '../../views/modals/LeaveCardModal.vue'
import LeaveEntryModal from '../../views/modals/LeaveEntryModal.vue'

const router = useRouter()
const route = useRoute()

const employee = ref(null)
const loading = ref(true)
const departments = ref([])
const leaveCredits = ref([])
const leaveTypes = ref([])

const showEditModal = ref(false)
const showPromotionModal = ref(false)
const showLeaveCard = ref(false)
const showLeaveEntryModal = ref(false)

const showAllSteps = ref(false)
const showAllHistory = ref(false)
const showAllCredits = ref(false)

async function fetchEmployee() {
  try {
    const response = await api.get(`/employees/${route.params.id}`)
    employee.value = response.data
  } catch (error) {
    console.error('Error fetching employee:', error)
  }
}

// onMounted(async () => {
//   try {
//     const [empResponse, deptResponse, creditsResponse] = await Promise.all([
//       api.get(`/employees/${route.params.id}`),
//       api.get('/departments'),
//       api.get(`/employees/${route.params.id}/leave-credits`),
//       api.get('/leave-configurations'),
//     ])

//     employee.value = empResponse.data
//     departments.value = deptResponse.data.data
//     leaveCredits.value =
//       creditsResponse.data.credits || creditsResponse.data.data || creditsResponse.data
//     leaveTypes.value = leaveTypesResponse.data
//     if (!leaveCredits.value || leaveCredits.value.length === 0) {
//       await initializeCredits()
//     }
//   } catch (error) {
//     console.error('Error fetching profiling attributes:', error)
//   } finally {
//     loading.value = false
//   }
// })
onMounted(async () => {
  try {
    // 1. Add 'leaveTypesResponse' to the array
    const [empResponse, deptResponse, creditsResponse, leaveTypesResponse] = await Promise.all([
      api.get(`/employees/${route.params.id}`),
      api.get('/departments'),
      api.get(`/employees/${route.params.id}/leave-credits`),
      api.get('/leave-configurations?active_only=true'),
    ])

    employee.value = empResponse.data
    departments.value = deptResponse.data.data
    leaveCredits.value =
      creditsResponse.data.credits || creditsResponse.data.data || creditsResponse.data

    // 2. Now this will work correctly
    leaveTypes.value = leaveTypesResponse.data.data || leaveTypesResponse.data

    if (!leaveCredits.value || leaveCredits.value.length === 0) {
      await initializeCredits()
    }
  } catch (error) {
    console.error('Error fetching profiling attributes:', error)
  } finally {
    loading.value = false
  }
})

async function handleDeactivate() {
  if (confirm('Are you sure you want to deactivate this employee?')) {
    try {
      await api.delete(`/employees/${route.params.id}`)
      await fetchEmployee()
    } catch (err) {
      console.error('Failed to update system state on record deactivation', err)
    }
  }
}

async function initializeCredits() {
  try {
    await api.post(`/employees/${route.params.id}/leave-credits/initialize`)
    const creditsResponse = await api.get(`/employees/${route.params.id}/leave-credits`)
    leaveCredits.value = creditsResponse.data.credits || creditsResponse.data
  } catch (error) {
    console.error('Failed to initialize credits', error)
  }
}

const filteredCredits = computed(() => {
  const mainCodes = ['VL', 'SL']
  const extraCodes = ['SPL', 'WL', 'FL']

  return leaveCredits.value.filter((credit) => {
    const code = String(credit.code || '')
      .toUpperCase()
      .trim()
    if (showAllCredits.value) {
      return [...mainCodes, ...extraCodes].includes(code)
    }
    return mainCodes.includes(code)
  })
})

function formatDate(dateStr) {
  if (!dateStr) return 'N/A'
  return dateStr.includes('T') ? dateStr.split('T')[0] : dateStr
}

function goBack() {
  router.push('/employees')
}
</script>
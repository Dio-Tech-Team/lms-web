<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <!-- <p class="text-[11px] uppercase tracking-wider text-teal-600 font-bold mb-1">Records</p> -->
        <h1 class="font-serif text-2xl font-semibold text-navy-deep">Employees</h1>
      </div>
      <button
        v-if="authStore.isSuperAdmin"
        @click="showAddModal = true"
        class="bg-navy text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-navy-deep transition-colors shadow-sm"
      >
        + Add Employee
      </button>
    </div>

    <AddEmployeeModal
      :show="showAddModal"
      :departments="departments"
      :positions="positions"
      @close="showAddModal = false"
      @created="fetchEmployees(currentPage)"
    />

    <!-- Search + Filter -->
    <div class="mb-5 flex gap-3">
      <div class="relative w-64">
        <svg
          class="absolute left-3.5 top-1/2 -translate-y-1/2"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#8B98A6"
          stroke-width="2"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          v-model="search"
          type="text"
          placeholder="Search employees..."
          class="w-full border border-sky-100 rounded-xl pl-9 pr-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 transition-colors"
        />
      </div>

      <select
        v-model="selectedDepartment"
        class="border border-sky-100 rounded-xl px-3.5 py-2.5 text-sm w-56 bg-white text-navy-deep focus:outline-none focus:ring-2 focus:ring-teal-600 transition-colors"
      >
        <option value="">All Departments</option>
        <option v-for="dept in departments" :key="dept.id" :value="dept.id">
          {{ dept.name }}
        </option>
      </select>

      <select
        v-model="selectedSex"
        class="border border-sky-100 rounded-xl px-3.5 py-2.5 text-sm w-40 bg-white text-navy-deep focus:outline-none focus:ring-2 focus:ring-teal-600 transition-colors"
      >
        <option value="">All Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <!-- 
      <select
        v-model="stepIncrementYear"
        @change="fetchEmployees(1)"
        class="border border-sky-100 rounded-xl px-3.5 py-2.5 text-sm w-56 bg-white text-navy-deep focus:outline-none focus:ring-2 focus:ring-teal-600 transition-colors"
      > -->
      <select
        v-model="stepIncrementYear"
        class="border border-sky-100 rounded-xl px-3.5 py-2.5 text-sm w-56 bg-white text-navy-deep focus:outline-none focus:ring-2 focus:ring-teal-600 transition-colors"
      >
        <option value="">Step Increment</option>
        <option v-for="y in stepIncrementYearOptions" :key="y" :value="y">
          {{ y }}
        </option>
      </select>
    </div>

    <!-- Employee Table List -->

    <div class="bg-white rounded-2xl border border-sky-100 overflow-hidden">
      <table class="w-full text-sm table-fixed">
        <thead class="bg-sky/60 border-b border-sky-100">
          <tr>
            <th
              class="w-10 text-left px-5 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              No.
            </th>

            <th
              v-if="!stepIncrementYear"
              class="w-32 text-left px-5 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              ID Number
            </th>

            <th
              class="w-40 text-left px-5 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Name
            </th>
            <th
              class="w-36 text-left px-5 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Position
            </th>
            <th
              class="w-56 text-left px-5 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Department
            </th>
            <th
              v-if="!stepIncrementYear"
              class="w-28 text-left px-5 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Status
            </th>

            <th
              v-if="!stepIncrementYear"
              class="w-24 text-left px-5 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              On Leave
            </th>

            <th
              v-if="stepIncrementYear"
              class="w-28 text-left px-5 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Current Step
            </th>
            <th
              v-if="stepIncrementYear"
              class="w-28 text-left px-5 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Next Step
            </th>
            <th
              v-if="stepIncrementYear"
              class="w-32 text-left px-5 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Increment Date
            </th>
            <th
              class="w-20 text-left px-5 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(employee, index) in employees"
            :key="employee.id"
            class="border-b border-sky-100 last:border-b-0 hover:bg-sky/40 transition-colors"
          >
            <td class="px-5 py-3.5 text-slate-500">
              <!-- {{ (currentPage - 1) * 10 + index + 1 }} -->
              {{ (currentPage - 1) * perPage + index + 1 }}
            </td>
            <td
              v-if="!stepIncrementYear"
              class="px-5 py-3.5 font-mono text-[12.5px] text-slate-500 truncate"
            >
              {{ employee.id_number }}
            </td>

            <td class="px-5 py-3.5 font-semibold text-navy-deep truncate">
              {{ employee.first_name }} {{ employee.surname }}
            </td>
            <td class="px-5 py-3.5 text-slate-600 truncate">{{ employee.position }}</td>
            <td class="px-5 py-3.5 text-slate-600 truncate" :title="employee.department_name">
              {{ employee.department_name }}
            </td>

            <td v-if="!stepIncrementYear" class="px-5 py-3.5 text-slate-600 capitalize truncate">
              {{ employee.employment_status?.replace('_', ' ') }}
            </td>
            <td v-if="!stepIncrementYear" class="px-5 py-3.5">
              <span
                v-if="employee.is_on_leave"
                class="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-100 text-amber-700"
              >
                On Leave
              </span>
              <span v-else class="text-slate-300 text-[12px]">—</span>
            </td>

            <td v-if="stepIncrementYear" class="px-5 py-3.5 text-slate-600">
              Step {{ employee.current_step || 'N/A' }}
            </td>
            <td v-if="stepIncrementYear" class="px-5 py-3.5 text-teal-700 font-semibold">
              Step {{ employee.next_step || 'N/A' }}
            </td>
            <td v-if="stepIncrementYear" class="px-5 py-3.5 text-slate-600">
              {{ employee.next_step_date || 'N/A' }}
            </td>
            <td class="px-5 py-3.5">
              <button
                @click="viewEmployee(employee.id)"
                class="text-teal-700 hover:text-teal-800 font-semibold text-sm transition-colors"
              >
                View →
              </button>
            </td>
          </tr>

          <tr v-if="employees.length === 0">
            <!-- <td
              :colspan="stepIncrementYear ? 7 : 7"
              class="px-5 py-12 text-center text-slate-400 text-sm"
            > -->
            <td colspan="8" class="px-5 py-12 text-center text-slate-400 text-sm">
              {{
                stepIncrementYear
                  ? `No step increments scheduled for ${stepIncrementYear}`
                  : 'No employees found'
              }}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination Controls -->
      <div class="flex items-center justify-between px-5 py-4 border-t border-sky-100 bg-sky/30">
        <p class="text-[12.5px] text-slate-500">
          Page <span class="font-semibold text-navy-deep">{{ currentPage }}</span> of {{ lastPage }}
          <span class="text-slate-400">· {{ total }} total employees</span>
        </p>
        <div class="flex gap-2">
          <button
            @click="fetchEmployees(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3.5 py-1.5 text-[12.5px] font-semibold border border-sky-100 rounded-lg bg-white hover:bg-sky text-navy transition-colors disabled:opacity-40 disabled:hover:bg-white"
          >
            ← Previous
          </button>
          <button
            @click="fetchEmployees(currentPage + 1)"
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
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/axios'
import AddEmployeeModal from '../../views/modals/AddEmployeeModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const employees = ref([])
const search = ref('')
const selectedDepartment = ref('')
const selectedSex = ref('')
const stepIncrementYear = ref('')
const showAddModal = ref(false)
const currentPage = ref(1)
const lastPage = ref(1)
const total = ref(0)
const departments = ref([])
const positions = ref([])
const perPage = ref(10)

// current year + next 2 years as quick filter options
const stepIncrementYearOptions = computed(() => {
  const current = new Date().getFullYear()
  return Array.from({ length: 3 }, (_, i) => current + i)
})

let requestId = 0

async function fetchEmployees(page = 1) {
  const myId = ++requestId
  if (stepIncrementYear.value) {
    try {
      const response = await api.get('/employees/step-increment-forecast', {
        params: { year: stepIncrementYear.value },
      })
      if (myId !== requestId) return

      let results = response.data.employees.map((e) => {
        const [first_name, ...rest] = e.name.split(' ')
        return {
          id: e.employee_id,
          first_name,
          surname: rest.join(' '),
          position: e.position,
          department_name: e.department,
          current_step: e.current_step,
          next_step: e.next_step,
          next_step_date: e.next_step_date,
          id_number: '',
          sex: e.sex,
        }
      })

      if (selectedDepartment.value) {
        const deptName = departments.value.find((d) => d.id == selectedDepartment.value)?.name
        results = results.filter((e) => e.department_name === deptName)
      }

      if (selectedSex.value) {
        results = results.filter((e) => e.sex === selectedSex.value)
      }
      if (search.value) {
        const q = search.value.toLowerCase()
        results = results.filter((e) => `${e.first_name} ${e.surname}`.toLowerCase().includes(q))
      }

      employees.value = results
      currentPage.value = 1
      lastPage.value = 1
      total.value = employees.value.length
    } catch (error) {
      console.error('Error fetching step increment forecast:', error)
      employees.value = []
      currentPage.value = 1
      lastPage.value = 1
      total.value = 0
    }
    return
  }
  // if (stepIncrementYear.value) {
  //   try {
  //     const response = await api.get('/employees/step-increment-forecast', {
  //       params: { year: stepIncrementYear.value },
  //     })

  //     employees.value = response.data.employees.map((e) => {
  //       const [first_name, ...rest] = e.name.split(' ')
  //       return {
  //         id: e.employee_id,
  //         first_name,
  //         surname: rest.join(' '),
  //         position: e.position,
  //         department_name: e.department,
  //         current_step: e.current_step,
  //         next_step: e.next_step,
  //         next_step_date: e.next_step_date,
  //         id_number: '',
  //       }
  //     })
  //     currentPage.value = 1
  //     lastPage.value = 1
  //     total.value = employees.value.length
  //   } catch (error) {
  //     console.error('Error fetching step increment forecast:', error)
  //     employees.value = []
  //     currentPage.value = 1
  //     lastPage.value = 1
  //     total.value = 0
  //   }
  //   return
  // }

  // Filter by on_leave status (currently commented out)
  //   const onLeaveFilter = ref('')

  //   <select
  //   v-model="onLeaveFilter"
  //   class="border border-sky-100 rounded-xl px-3.5 py-2.5 text-sm w-44 bg-white text-navy-deep focus:outline-none focus:ring-2 focus:ring-teal-600 transition-colors"
  // >
  //   <option value="">All Employees</option>
  //   <option value="1">Currently on Leave</option>
  //   <option value="0">Available</option>
  // </select>

  // params: {
  //   page: page,
  //   department_id: selectedDepartment.value,
  //   sex: selectedSex.value,
  //   search: search.value,
  //   on_leave: onLeaveFilter.value,
  // },

  // watch(onLeaveFilter, () => {
  //   fetchEmployees(1)
  // })

  try {
    const employeeResponse = await api.get(`/employees`, {
      params: {
        page: page,
        department_id: selectedDepartment.value,
        sex: selectedSex.value,
        search: search.value,
      },
    })
    if (myId !== requestId) return
    employees.value = employeeResponse.data.data
    perPage.value = employeeResponse.data.per_page
    currentPage.value = employeeResponse.data.current_page
    lastPage.value = employeeResponse.data.last_page
    total.value = employeeResponse.data.total
  } catch (error) {
    console.error('Error fetching employees:', error)
  }
}

onMounted(async () => {
  await fetchEmployees()
  try {
    const deptResponse = await api.get('/departments')
    departments.value = deptResponse.data.data
  } catch (error) {
    console.error('Error fetching departments:', error)
  }
  try {
    const posResponse = await api.get('/positions')
    positions.value = posResponse.data
  } catch (error) {
    console.error('Error fetching positions:', error)
  }
})

watch(selectedDepartment, () => {
  fetchEmployees(1)
})
watch(selectedSex, () => {
  fetchEmployees(1)
})
watch(stepIncrementYear, () => {
  fetchEmployees(1)
})
let searchTimeout = null
watch(search, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchEmployees(1)
  }, 400)
})

function viewEmployee(id) {
  router.push(`/employees/${id}`)
}
</script>
<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <!-- <p class="text-[11px] uppercase tracking-wider text-teal-600 font-bold mb-1">Records</p> -->
        <h1 class="text-2xl font-bold text-gray-700">Employees</h1>
      </div>
      <button
        @click="showAddModal = true"
        class="bg-navy text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-navy-deep transition-colors shadow-sm"
      >
        + Add Employee
      </button>

      <!-- Add Employee Modal -->
      <div
        v-if="showAddModal"
        class="fixed inset-0 bg-navy-deep/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <div
          class="bg-white rounded-3xl shadow-xl w-full max-w-2xl p-7 max-h-[90vh] overflow-y-auto"
        >
          <div class="flex items-center justify-between mb-6">
            <h2 class="font-serif text-xl font-semibold text-navy-deep">Add New Employee</h2>
            <button
              @click="showAddModal = false"
              class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-sky hover:text-navy transition-colors text-lg"
            >
              ✕
            </button>
          </div>

          <div
            v-if="formError"
            class="bg-rose-tint border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-5 text-sm"
          >
            {{ formError }}
          </div>

          <form @submit.prevent="handleAddEmployee">
            <h3 class="text-[11px] font-bold text-teal-600 mb-3 uppercase tracking-wider">
              Account Information
            </h3>
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label class="block text-sm font-medium text-navy-deep mb-1.5">Username</label>
                <input
                  v-model="form.username"
                  type="text"
                  class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-navy-deep mb-1.5">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-navy-deep mb-1.5">Password</label>
                <input
                  v-model="form.password"
                  type="password"
                  class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-navy-deep mb-1.5"
                  >Confirm Password</label
                >
                <input
                  v-model="form.password_confirmation"
                  type="password"
                  class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                  required
                />
              </div>
            </div>

            <h3 class="text-[11px] font-bold text-teal-600 mb-3 uppercase tracking-wider">
              Personal Information
            </h3>
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label class="block text-sm font-medium text-navy-deep mb-1.5">First Name</label>
                <input
                  v-model="form.first_name"
                  type="text"
                  class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-navy-deep mb-1.5">Middle Name</label>
                <input
                  v-model="form.middle_name"
                  type="text"
                  class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-navy-deep mb-1.5">Surname</label>
                <input
                  v-model="form.surname"
                  type="text"
                  class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-navy-deep mb-1.5">ID Number</label>
                <input
                  v-model="form.id_number"
                  type="text"
                  class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-navy-deep mb-1.5">Birthdate</label>
                <input
                  v-model="form.birthdate"
                  type="date"
                  class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-navy-deep mb-1.5"
                  >Place of Birth</label
                >
                <input
                  v-model="form.place_of_birth"
                  type="text"
                  class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-navy-deep mb-1.5">Sex</label>
                <select
                  v-model="form.sex"
                  class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                  required
                >
                  <option value="">Select Sex</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-navy-deep mb-1.5">Civil Status</label>
                <select
                  v-model="form.civil_status"
                  class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                  required
                >
                  <option value="">Select Civil Status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="widowed">Widowed</option>
                  <option value="separated">Separated</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-navy-deep mb-1.5">Height</label>
                <input
                  v-model="form.height"
                  type="text"
                  placeholder="e.g. 5'6&quot;"
                  class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-navy-deep mb-1.5">Weight</label>
                <input
                  v-model="form.weight"
                  type="text"
                  placeholder="e.g. 65kg"
                  class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-navy-deep mb-1.5">Blood Type</label>
                <input
                  v-model="form.bloodtype"
                  type="text"
                  placeholder="e.g. O+"
                  class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-navy-deep mb-1.5"
                  >Highest Educational Attainment</label
                >
                <select
                  v-model="form.highest_educational_attainment"
                  class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                  required
                >
                  <option value="">Select</option>
                  <option value="elementary">Elementary</option>
                  <option value="secondary">Secondary</option>
                  <option value="vocational">Vocational</option>
                  <option value="college">College</option>
                  <option value="graduated">Graduated</option>
                </select>
              </div>
            </div>

            <h3 class="text-[11px] font-bold text-teal-600 mb-3 uppercase tracking-wider">
              Contact & Address
            </h3>
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label class="block text-sm font-medium text-navy-deep mb-1.5"
                  >Residential Address</label
                >
                <input
                  v-model="form.residential_address"
                  type="text"
                  class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-navy-deep mb-1.5"
                  >Contact Number</label
                >
                <input
                  v-model="form.contact_number"
                  type="text"
                  class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <h3 class="text-[11px] font-bold text-teal-600 mb-3 uppercase tracking-wider">
              Government IDs
            </h3>
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label class="block text-sm font-medium text-navy-deep mb-1.5">UMID</label>
                <input
                  v-model="form.umid_id"
                  type="text"
                  class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-navy-deep mb-1.5">Pag-IBIG ID</label>
                <input
                  v-model="form.pagibig_id"
                  type="text"
                  class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-navy-deep mb-1.5"
                  >PhilHealth Number</label
                >
                <input
                  v-model="form.philhealth_number"
                  type="text"
                  class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-navy-deep mb-1.5">PSN Number</label>
                <input
                  v-model="form.psn_number"
                  type="text"
                  class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-navy-deep mb-1.5">TIN Number</label>
                <input
                  v-model="form.tin_number"
                  type="text"
                  class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <h3 class="text-[11px] font-bold text-teal-600 mb-3 uppercase tracking-wider">
              Employment Information
            </h3>
            <div class="grid grid-cols-2 gap-4 mb-7">
              <div>
                <label class="block text-sm font-medium text-navy-deep mb-1.5">Position</label>
                <input
                  v-model="form.position"
                  type="text"
                  class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-navy-deep mb-1.5">Department</label>
                <select
                  v-model="form.department_id"
                  class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                  required
                >
                  <option value="">Select Department</option>
                  <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                    {{ dept.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-navy-deep mb-1.5"
                  >Employment Status</label
                >
                <select
                  v-model="form.employment_status"
                  class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="permanent">Permanent</option>
                  <option value="casual">Casual</option>
                  <option value="elected">Elected</option>
                  <option value="job_order">Job Order</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-navy-deep mb-1.5">Date Hired</label>
                <input
                  v-model="form.date_hired"
                  type="date"
                  class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                  required
                />
              </div>
            </div>

            <div class="flex justify-end gap-3">
              <button
                type="button"
                @click="showAddModal = false"
                class="px-5 py-2.5 text-sm font-semibold text-navy border border-sky-100 rounded-xl hover:bg-sky transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="formLoading"
                class="px-5 py-2.5 text-sm font-semibold bg-navy text-white rounded-xl hover:bg-navy-deep transition-colors disabled:opacity-50"
              >
                {{ formLoading ? 'Saving...' : 'Save Employee' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

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
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl border border-sky-100 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-sky/60 border-b border-sky-100">
          <tr>
            <th
              class="text-left px-5 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              ID Number
            </th>
            <th
              class="text-left px-5 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Name
            </th>
            <th
              class="text-left px-5 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Position
            </th>
            <th
              class="text-left px-5 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Department
            </th>
            <th
              class="text-left px-5 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Status
            </th>
            <th
              class="text-left px-5 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="employee in filteredEmployees"
            :key="employee.id"
            class="border-b border-sky-100 last:border-b-0 hover:bg-sky/40 transition-colors"
          >
            <td class="px-5 py-3.5 font-mono text-[12.5px] text-slate-500">
              {{ employee.id_number }}
            </td>
            <td class="px-5 py-3.5 font-semibold text-navy-deep">
              {{ employee.first_name }} {{ employee.surname }}
            </td>
            <td class="px-5 py-3.5 text-slate-600">{{ employee.position }}</td>
            <td class="px-5 py-3.5 text-slate-600">{{ employee.department_name }}</td>
            <td class="px-5 py-3.5 text-slate-600 capitalize">
              {{ employee.employment_status?.replace('_', ' ') }}
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
          <tr v-if="filteredEmployees.length === 0">
            <td colspan="6" class="px-5 py-12 text-center text-slate-400 text-sm">
              No employees found
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
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'
import { watch } from 'vue'

const router = useRouter()
const employees = ref([])
const search = ref('')
const selectedDepartment = ref('') //
const showAddModal = ref(false)
const currentPage = ref(1)
const lastPage = ref(1)
const total = ref(0)
const departments = ref([])
const formError = ref(null)
const formLoading = ref(false)

const form = ref({
  username: '',
  email: '',
  password: '',
  password_confirmation: '',
  first_name: '',
  middle_name: '',
  surname: '',
  birthdate: '',
  place_of_birth: '',
  sex: '',
  civil_status: '',
  height: '',
  weight: '',
  bloodtype: '',
  highest_educational_attainment: '',
  residential_address: '',
  contact_number: '',
  id_number: '',
  position: '',
  department_id: '',
  employment_status: '',
  date_hired: '',
  umid_id: '',
  pagibig_id: '',
  philhealth_number: '',
  psn_number: '',
  tin_number: '',
})

async function fetchEmployees(page = 1) {
  try {
    // const employeeResponse = await api.get(`/employees?page=${page}`)
    const employeeResponse = await api.get(`/employees`, {
      params: {
        page: page,
        department_id: selectedDepartment.value,
      },
    })
    employees.value = employeeResponse.data.data
    currentPage.value = employeeResponse.data.current_page
    lastPage.value = employeeResponse.data.last_page
    total.value = employeeResponse.data.total
  } catch (error) {
    console.error('Error fetching employees:', error)
  }
}

async function handleAddEmployee() {
  formLoading.value = true
  formError.value = ''
  try {
    await api.post('employees', form.value)
    showAddModal.value = false
    await fetchEmployees(currentPage.value)
    Object.keys(form.value).forEach((key) => {
      form.value[key] = ''
    })
  } catch (error) {
    formError.value = error.response?.data?.message || 'Failed to add employee. Please try again.'
  } finally {
    formLoading.value = false
  }
}

const filteredEmployees = computed(() => {
  if (!search.value) return employees.value
  return employees.value.filter(
    (emp) =>
      emp.first_name.toLowerCase().includes(search.value.toLowerCase()) ||
      emp.surname.toLowerCase().includes(search.value.toLowerCase()) ||
      emp.id_number.toLowerCase().includes(search.value.toLowerCase()) ||
      emp.position.toLowerCase().includes(search.value.toLowerCase())
  )
})

onMounted(async () => {
  await fetchEmployees()
  try {
    const deptResponse = await api.get('/departments')
    departments.value = deptResponse.data.data
  } catch (error) {
    console.error('Error fetching departments:', error)
  }
})
watch(selectedDepartment, () => {
  fetchEmployees(1) // Reset to page 1 on filter change
})

function viewEmployee(id) {
  router.push(`/employees/${id}`)
}
</script>
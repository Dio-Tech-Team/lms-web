<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-600">Employees</h1>
      <button
        @click="showAddModal = true"
        class="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700"
      >
        Add Employee
      </button>

      <!-- Add Employee Modal -->
      <div
        v-if="showAddModal"
        class="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-50"
      >
        <div
          class="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-screen overflow-y-auto"
        >
          <!-- Modal Header -->
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-800">Add New Employee</h2>
            <button @click="showAddModal = false" class="text-gray-400 hover:text-gray-600 text-xl">
              ✕
            </button>
          </div>

          <!-- Error Message -->
          <div
            v-if="formError"
            class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4 text-sm"
          >
            {{ formError }}
          </div>

          <!-- Form -->
          <form @submit.prevent="handleAddEmployee">
            <!-- Account Info -->
            <h3 class="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
              Account Information
            </h3>
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  v-model="form.username"
                  type="text"
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  v-model="form.password"
                  type="password"
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  v-model="form.password_confirmation"
                  type="password"
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <!-- Personal Info -->
            <h3 class="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
              Personal Information
            </h3>
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  v-model="form.first_name"
                  type="text"
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                <input
                  v-model="form.middle_name"
                  type="text"
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Surname</label>
                <input
                  v-model="form.surname"
                  type="text"
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                <input
                  v-model="form.id_number"
                  type="text"
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Birthdate</label>
                <input
                  v-model="form.birthdate"
                  type="date"
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Place of Birth</label>
                <input
                  v-model="form.place_of_birth"
                  type="text"
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Sex</label>
                <select
                  v-model="form.sex"
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  required
                >
                  <option value="">Select Sex</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Civil Status</label>
                <select
                  v-model="form.civil_status"
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
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
                <label class="block text-sm font-medium text-gray-700 mb-1">Height</label>
                <input
                  v-model="form.height"
                  type="text"
                  placeholder="e.g. 5'6&quot;"
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                <input
                  v-model="form.weight"
                  type="text"
                  placeholder="e.g. 65kg"
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                <input
                  v-model="form.bloodtype"
                  type="text"
                  placeholder="e.g. O+"
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Highest Educational Attainment</label
                >
                <select
                  v-model="form.highest_educational_attainment"
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
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

              <!-- Contact and Address -->
              <h3 class="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                Contact & Address
              </h3>
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Residential Address</label
                  >
                  <input
                    v-model="form.residential_address"
                    type="text"
                    class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input
                    v-model="form.contact_number"
                    type="text"
                    class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <!-- Government IDs -->
              <h3 class="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                Government IDs
              </h3>
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">UMID</label>
                  <input
                    v-model="form.umid_id"
                    type="text"
                    class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Pag-IBIG ID</label>
                  <input
                    v-model="form.pagibig_id"
                    type="text"
                    class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >PhilHealth Number</label
                  >
                  <input
                    v-model="form.philhealth_number"
                    type="text"
                    class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">PSN Number</label>
                  <input
                    v-model="form.psn_number"
                    type="text"
                    class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">TIN Number</label>
                  <input
                    v-model="form.tin_number"
                    type="text"
                    class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>

            <!-- Employment Info -->
            <h3 class="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
              Employment Information
            </h3>
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <input
                  v-model="form.position"
                  type="text"
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  v-model="form.department_id"
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  required
                >
                  <option value="">Select Department</option>
                  <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                    {{ dept.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Employment Status</label
                >
                <select
                  v-model="form.employment_status"
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
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
                <label class="block text-sm font-medium text-gray-700 mb-1">Date Hired</label>
                <input
                  v-model="form.date_hired"
                  type="date"
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  required
                />
              </div>
            </div>

            <!-- Buttons -->
            <div class="flex justify-end gap-3">
              <button
                type="button"
                @click="showAddModal = false"
                class="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="formLoading"
                class="px-4 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
              >
                {{ formLoading ? 'Saving...' : 'Save Employee' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Search -->
    <div class="mb-4">
      <input
        v-model="search"
        type="text"
        placeholder="Search employees..."
        class="border border-gray-300 rounded px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">ID Number</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Name</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Position</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Department</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Employment Status</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="employee in filteredEmployees"
            :key="employee.id"
            class="border-b hover:bg-gray-50"
          >
            <td class="px-4 py-3">{{ employee.id_number }}</td>
            <td class="px-4 py-3">{{ employee.first_name }} {{ employee.surname }}</td>
            <td class="px-4 py-3">{{ employee.position }}</td>
            <td class="px-4 py-3">{{ employee.department }}</td>
            <td class="px-4 py-3 capitalize">{{ employee.employment_status }}</td>
            <!-- <td class="px-4 py-3">
              <span
                :class="
                  employee.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                "
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ employee.is_active ? 'Active' : 'Inactive' }}
              </span>
            </td> -->
            <td class="px-4 py-3">
              <button
                @click="viewEmployee(employee.id)"
                class="text-blue-600 hover:text-blue-700 text-sm mr-3"
              >
                View
              </button>
            </td>
          </tr>
          <tr v-if="filteredEmployees.length === 0">
            <td colspan="6" class="px-4 py-8 text-center text-gray-500">No employees found</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'

const router = useRouter()
const employees = ref([])
const search = ref('')
const showAddModal = ref(false)
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
const departments = ref([]) // Fixes line 162 warning and line 340 ReferenceError
const formError = ref(null) // Fixes line 31 warning
const formLoading = ref(false) // Fixes line 204 & 207 warnin

async function handleAddEmployee() {
  formLoading.value = true
  formError.value = ''

  try {
    await api.post('employees', form.value)
    showAddModal.value = false

    const response = await api.get('/employees')
    employees.value = response.data

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
  try {
    const response = await api.get('/employees')
    employees.value = response.data

    const deptResponse = await api.get('/departments')
    departments.value = deptResponse.data.data
  } catch (error) {
    console.error('Error fetching employees:', error)
  }
})

function viewEmployee(id) {
  router.push(`/employees/${id}`)
}
</script>
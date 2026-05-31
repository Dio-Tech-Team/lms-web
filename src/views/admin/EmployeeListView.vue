<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Employees</h1>
      <button
        @click="showAddModal = true"
        class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
      >
        Add Employee
      </button>
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
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
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
            <td class="px-4 py-3">{{ employee.first_name }} {{ employee.last_name }}</td>
            <td class="px-4 py-3">{{ employee.position }}</td>
            <td class="px-4 py-3">{{ employee.department }}</td>
            <td class="px-4 py-3">
              <span
                :class="
                  employee.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                "
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ employee.is_active ? 'Active' : 'Inactive' }}
              </span>
            </td>
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

const filteredEmployees = computed(() => {
  if (!search.value) return employees.value
  return employees.value.filter(
    (emp) =>
      emp.first_name.toLowerCase().includes(search.value.toLowerCase()) ||
      emp.last_name.toLowerCase().includes(search.value.toLowerCase()) ||
      emp.id_number.toLowerCase().includes(search.value.toLowerCase()) ||
      emp.position.toLowerCase().includes(search.value.toLowerCase())
  )
})

onMounted(async () => {
  try {
    const response = await api.get('/employees')
    employees.value = response.data
  } catch (error) {
    console.error('Error fetching employees:', error)
  }
})

function viewEmployee(id) {
  router.push(`/employees/${id}`)
}
</script>
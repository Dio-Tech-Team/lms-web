<template>
  <div>
    <!-- Back Button -->
    <button @click="goBack" class="text-blue-600 text-sm mb-4">← Back to Employees</button>
    <!-- Loading -->
    <div v-if="loading" class="text-center py-10 text-gray-500">Loading...</div>

    <!-- Profile Content -->
    <div v-else-if="employee">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">
              {{ employee.first_name }} {{ employee.middle_name }} {{ employee.last_name }}
            </h1>
            <p class="text-gray-500 text-sm mt-1">{{ employee.position }}</p>
            <span
              :class="
                employee.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              "
              class="px-2 py-1 rounded-full text-xs font-medium mt-2 inline-block"
            >
              {{ employee.is_active ? 'Active' : 'Inactive' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Details -->
      <div class="grid grid-cols-2 gap-6 mb-6">
        <!-- Personal Info -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Personal Information</h2>
          <div class="space-y-3">
            <div>
              <p class="text-xs text-gray-500">ID Number</p>
              <p class="text-sm font-medium">{{ employee.id_number }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Email</p>
              <p class="text-sm font-medium">{{ employee.email }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Contact Number</p>
              <p class="text-sm font-medium">{{ employee.contact_number || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Birthdate</p>
              <p class="text-sm font-medium">{{ employee.birthdate || 'N/A' }}</p>
            </div>
          </div>
        </div>

        <!-- Employment Info -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Employment Information</h2>
          <div class="space-y-3">
            <div>
              <p class="text-xs text-gray-500">Department</p>
              <p class="text-sm font-medium">{{ employee.department }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Employment Status</p>
              <p class="text-sm font-medium capitalize">{{ employee.employment_status }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Date Hired</p>
              <p class="text-sm font-medium">{{ employee.date_hired }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Promotion History -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Promotion History</h2>
        <div v-if="employee.promotion_history && employee.promotion_history.length > 0">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b">
              <tr>
                <th class="text-left px-4 py-3 text-gray-600">Previous Position</th>
                <th class="text-left px-4 py-3 text-gray-600">New Position</th>
                <th class="text-left px-4 py-3 text-gray-600">Promotion Date</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="promotion in employee.promotion_history"
                :key="promotion.id"
                class="border-b"
              >
                <td class="px-4 py-3">{{ promotion.previous_position }}</td>
                <td class="px-4 py-3">{{ promotion.new_position }}</td>
                <td class="px-4 py-3">{{ promotion.promotion_date }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-gray-500 text-sm">No promotion history yet.</div>
      </div>
    </div>

    <!-- Error -->
    <div v-else class="text-center py-10 text-red-500">Employee not found.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/api/axios'

const router = useRouter()
const route = useRoute()

const employee = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await api.get(`/employees/${route.params.id}`)
    employee.value = response.data
  } catch (error) {
    console.error('Error fetching employee:', error)
  } finally {
    loading.value = false
  }
})

function goBack() {
  router.push('/employees')
}
</script>
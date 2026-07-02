<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-600 mb-6">Dashboard</h1>
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div
        class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"
      ></div>
    </div>

    <div class="grid grid-cols-3 gap-6">
      <!-- Card 1 -->
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-sm text-gray-500">Total Employees</p>
        <p class="text-3xl font-bold text-gray-600 mt-2">{{ totalEmployees }}</p>
      </div>

      <!-- Card 2 -->
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-sm text-gray-500">Active Employees</p>
        <p class="text-3xl font-bold text-gray-600 mt-2">{{ activeEmployees }}</p>
      </div>

      <!-- Card 3 -->
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-sm text-gray-500">Inactive Employees</p>
        <p class="text-3xl font-bold text-gray-600 mt-2">{{ inactiveEmployees }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/api/axios'

const employees = ref([])

const totalEmployees = computed(() => employees.value.length)
const activeEmployees = computed(() => employees.value.filter((emp) => emp.is_active).length)
const inactiveEmployees = computed(() => employees.value.filter((emp) => !emp.is_active).length)

const permanentEmployees = computed(
  () => employees.value.filter((emp) => emp.employment_status === 'permanent').length
)

const casualEmployees = computed(
  () => employees.value.filter((emp) => emp.employment_status === 'casual').length
)

onMounted(async () => {
  try {
    const response = await api.get('/employees')
    employees.value = response.data.data
  } catch (error) {
    console.error('Error fetching employees:', error)
  }
})
</script>

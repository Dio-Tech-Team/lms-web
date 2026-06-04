<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

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

onMounted(async () => {
  try {
    const response = await api.get('/employees')
    employees.value = response.data
  } catch (error) {
    console.error('Error fetching employees:', error)
  }
})
</script>

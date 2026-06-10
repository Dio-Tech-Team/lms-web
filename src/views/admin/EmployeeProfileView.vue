<template>
  <div>
    <!-- Back Button -->
    <button
      @click="goBack"
      class="flex items-center gap-1 text-gray-500 text-sm mb-4 hover:text-gray-1200"
    >
      ← Back to Employees
    </button>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <!-- <div
        class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"
      ></div> -->
    </div>
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
                employee.is_active ? 'bg-gray-100 text-gray-700' : 'bg-gray-100 text-gray-700'
              "
              class="px-2 py-1 rounded-full text-xs font-medium mt-2 inline-block"
            >
              {{ employee.is_active ? 'Active' : 'Inactive' }}
            </span>
          </div>
          <!-- Action Buttons -->
          <div class="flex gap-2">
            <button
              @click="showEditModal = true"
              class="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700"
            >
              Edit
            </button>
            <button
              v-if="employee.is_active"
              @click="handleDeactivate"
              class="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700"
            >
              Deactivate
            </button>
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
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-800">Promotion History</h2>
          <button
            @click="openPromotionModal"
            class="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
          >
            Add Promotion
          </button>
        </div>
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
    <div v-else class="text-center py-10 text-gray-500">Employee not found.</div>

    <!-- Edit Employee Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-screen overflow-y-auto">
        <!-- Modal Header -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-800">Edit Employee</h2>
          <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-600 text-xl">
            ✕
          </button>
        </div>

        <!-- Error -->
        <div
          v-if="editError"
          class="bg-gray-50 border border-gray-200 text-gray-600 px-4 py-3 rounded mb-4 text-sm"
        >
          {{ editError }}
        </div>

        <!-- Form -->
        <form @submit.prevent="handleEditEmployee">
          <!-- Personal Info -->
          <h3 class="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
            Personal Information
          </h3>
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                v-model="editForm.first_name"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
              <input
                v-model="editForm.middle_name"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                v-model="editForm.last_name"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Birthdate</label>
              <input
                v-model="editForm.birthdate"
                type="date"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <input
                v-model="editForm.contact_number"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
          </div>

          <!-- Employment Info -->
          <h3 class="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
            Employment Information
          </h3>
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Employment Status</label>
              <select
                v-model="editForm.employment_status"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option value="permanent">Permanent</option>
                <option value="casual">Casual</option>
                <option value="elected">Elected</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                v-model="editForm.department_id"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                  {{ dept.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date Hired</label>
              <input
                v-model="editForm.date_hired"
                type="date"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="showEditModal = false"
              class="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="editLoading"
              class="px-4 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
            >
              {{ editLoading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Promotion Modal -->
    <div
      v-if="showPromotionModal"
      class="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-800">Add Promotion</h2>
          <button
            @click="showPromotionModal = false"
            class="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        <div
          v-if="promotionError"
          class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4 text-sm"
        >
          {{ promotionError }}
        </div>

        <form @submit.prevent="handleAddPromotion">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Previous Position</label>
              <input
                v-model="promotionForm.previous_position"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50"
                readonly
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">New Position</label>
              <input
                v-model="promotionForm.new_position"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Promotion Date</label>
              <input
                v-model="promotionForm.promotion_date"
                type="date"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                required
              />
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button
              type="button"
              @click="showPromotionModal = false"
              class="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="promotionloading"
              class="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {{ promotionloading ? 'Saving...' : 'Save Promotion' }}
            </button>
          </div>
        </form>
      </div>
    </div>
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
const showEditModal = ref(false)
const editLoading = ref(false)
const editError = ref('')
const departments = ref([])
const showPromotionModal = ref(false)
const promotionloading = ref(false)
const promotionError = ref('')

const promotionForm = ref({
  previous_position: '',
  new_position: '',
  promotion_date: '',
})

const editForm = ref({
  first_name: '',
  middle_name: '',
  last_name: '',
  birthdate: '',
  contact_number: '',
  employment_status: '',
  department_id: '',
  date_hired: '',
})

onMounted(async () => {
  try {
    const response = await api.get(`/employees/${route.params.id}`)
    employee.value = response.data

    const deptResponse = await api.get('/departments')
    departments.value = deptResponse.data.data

    // Pre-fill edit form with current data
    editForm.value = {
      first_name: employee.value.first_name,
      middle_name: employee.value.middle_name,
      last_name: employee.value.last_name,
      birthdate: employee.value.birthdate,
      contact_number: employee.value.contact_number,
      employment_status: employee.value.employment_status,
      department_id: employee.value.department_id,
      date_hired: employee.value.date_hired,
    }
  } catch (error) {
    console.error('Error fetching employee:', error)
  } finally {
    loading.value = false
  }
})

async function handleEditEmployee() {
  editLoading.value = true
  editError.value = ''
  try {
    await api.put(`/employees/${route.params.id}`, editForm.value)
    const response = await api.get(`/employees/${route.params.id}`)
    employee.value = response.data
    showEditModal.value = false
  } catch (err) {
    editError.value = err.response?.data?.message || 'Failed to update employee'
  } finally {
    editLoading.value = false
  }
}

async function handleDeactivate() {
  if (confirm('Are you sure you want to deactivate this employee?')) {
    try {
      await api.delete(`/employees/${route.params.id}`)
      const response = await api.get(`/employees/${route.params.id}`)
      employee.value = response.data
    } catch (err) {
      console.error('Failed to deactivate employee', err)
    }
  }
}

async function handleAddPromotion() {
  promotionloading.value = true
  promotionError.value = ''
  try {
    await api.post(`/employees/${route.params.id}/promotions`, promotionForm.value)
    const response = await api.get(`/employees/${route.params.id}`)
    employee.value = response.data
    showPromotionModal.value = false
    promotionForm.value = {
      previous_position: '',
      new_position: '',
      promotion_date: '',
    }
  } catch (err) {
    promotionError.value = err.response?.data?.message || 'Failed to add promotion'
  } finally {
    promotionloading.value = false
  }
}

function openPromotionModal() {
  promotionForm.value.previous_position = employee.value.position
  showPromotionModal.value = true
}

function goBack() {
  router.push('/employees')
}
</script>
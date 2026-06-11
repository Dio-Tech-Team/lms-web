<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Leave Configuration</h1>
      <button
        @click="showAddModal = true"
        class="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700"
      >
        Add Leave Type
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div
        class="w-8 h-8 border-4 border-gray -600 border-t-transparent rounded-full animate-spin"
      ></div>
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Name</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Code</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Applicable To</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Credit Type</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Credits</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Carry Over</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Monetize</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="config in configurations" :key="config.id" class="border-b hover:bg-gray-50">
            <td class="px-4 py-3 font-medium">{{ config.name }}</td>
            <td class="px-4 py-3">
              <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                {{ config.code }}
              </span>
            </td>
            <td class="px-4 py-3 capitalize">{{ config.application_to }}</td>
            <td class="px-4 py-3 capitalize">{{ config.credit_type }}</td>
            <td class="px-4 py-3">
              {{
                config.credit_type === 'monthly'
                  ? config.monthly_credit + '/month'
                  : config.fixed_days + ' days'
              }}
            </td>
            <td class="px-4 py-3">
              <span
                :class="
                  config.can_carry_over ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                "
                class="px-2 py-1 rounded-full text-xs"
              >
                {{ config.can_carry_over ? 'Yes' : 'No' }}
              </span>
            </td>
            <td class="px-4 py-3">
              <span
                :class="
                  config.can_monetize ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                "
                class="px-2 py-1 rounded-full text-xs"
              >
                {{ config.can_monetize ? 'Yes' : 'No' }}
              </span>
            </td>
            <td class="px-4 py-3">
              <button
                @click="openEditModal(config)"
                class="text-gray-600 hover:text-gray-700 text-sm mr-3"
              >
                Edit
              </button>
              <button
                @click="handleDelete(config.id)"
                class="text-red-600 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="configurations.length === 0">
            <td colspan="8" class="px-4 py-8 text-center text-gray-500">
              No leave types configured
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-gray bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-800">Add Leave Type</h2>
          <button @click="showAddModal = false" class="text-gray-400 hover:text-gray-600 text-xl">
            ✕
          </button>
        </div>

        <div
          v-if="formError"
          class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4 text-sm"
        >
          {{ formError }}
        </div>

        <form @submit.prevent="handleAdd">
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                v-model="form.name"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Code</label>
              <input
                v-model="form.code"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Applicable To</label>
              <select
                v-model="form.application_to"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="all">All</option>
                <option value="permanent">Permanent</option>
                <option value="casual">Casual</option>
                <option value="elected">Elected</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Credit Type</label>
              <select
                v-model="form.credit_type"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="monthly">Monthly</option>
                <option value="fixed">Fixed</option>
              </select>
            </div>
            <div v-if="form.credit_type === 'monthly'">
              <label class="block text-sm font-medium text-gray-700 mb-1">Monthly Credit</label>
              <input
                v-model="form.monthly_credit"
                type="number"
                step="0.01"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div v-if="form.credit_type === 'fixed'">
              <label class="block text-sm font-medium text-gray-700 mb-1">Fixed Days</label>
              <input
                v-model="form.fixed_days"
                type="number"
                step="0.01"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div class="flex items-center gap-2">
              <input v-model="form.can_carry_over" type="checkbox" id="carry_over" />
              <label for="carry_over" class="text-sm text-gray-700">Can Carry Over</label>
            </div>
            <div class="flex items-center gap-2">
              <input v-model="form.can_monetize" type="checkbox" id="monetize" />
              <label for="monetize" class="text-sm text-gray-700">Can Monetize</label>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              v-model="form.description"
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              rows="2"
            ></textarea>
          </div>
          <div class="flex justify-end gap-3 mt-4">
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
              {{ formLoading ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-gray bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-800">Edit Leave Type</h2>
          <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-600 text-xl">
            ✕
          </button>
        </div>

        <form @submit.prevent="handleEdit">
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                v-model="editForm.name"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Code</label>
              <input
                v-model="editForm.code"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Applicable To</label>
              <select
                v-model="editForm.application_to"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="all">All</option>
                <option value="permanent">Permanent</option>
                <option value="casual">Casual</option>
                <option value="elected">Elected</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Credit Type</label>
              <select
                v-model="editForm.credit_type"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="monthly">Monthly</option>
                <option value="fixed">Fixed</option>
              </select>
            </div>
            <div v-if="editForm.credit_type === 'monthly'">
              <label class="block text-sm font-medium text-gray-700 mb-1">Monthly Credit</label>
              <input
                v-model="editForm.monthly_credit"
                type="number"
                step="0.01"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div v-if="editForm.credit_type === 'fixed'">
              <label class="block text-sm font-medium text-gray-700 mb-1">Fixed Days</label>
              <input
                v-model="editForm.fixed_days"
                type="number"
                step="0.01"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div class="flex items-center gap-2">
              <input v-model="editForm.can_carry_over" type="checkbox" id="edit_carry_over" />
              <label for="edit_carry_over" class="text-sm text-gray-700">Can Carry Over</label>
            </div>
            <div class="flex items-center gap-2">
              <input v-model="editForm.can_monetize" type="checkbox" id="edit_monetize" />
              <label for="edit_monetize" class="text-sm text-gray-700">Can Monetize</label>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              v-model="editForm.description"
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              rows="2"
            ></textarea>
          </div>
          <div class="flex justify-end gap-3 mt-4">
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

const configurations = ref([])
const loading = ref(true)
const showAddModal = ref(false)
const showEditModal = ref(false)
const formLoading = ref(false)
const editLoading = ref(false)
const formError = ref('')
const selectedId = ref(null)

const form = ref({
  name: '',
  code: '',
  application_to: 'all',
  credit_type: 'monthly',
  monthly_credit: '',
  fixed_days: '',
  can_carry_over: false,
  can_monetize: false,
  description: '',
})

const editForm = ref({
  name: '',
  code: '',
  application_to: 'all',
  credit_type: 'monthly',
  monthly_credit: '',
  fixed_days: '',
  can_carry_over: false,
  can_monetize: false,
  description: '',
})

onMounted(async () => {
  await fetchConfigurations()
})

async function fetchConfigurations() {
  loading.value = true
  try {
    const response = await api.get('/leave-configurations')
    configurations.value = response.data
  } catch (error) {
    console.error('Error fetching configurations:', error)
  } finally {
    loading.value = false
  }
}

async function handleAdd() {
  formLoading.value = true
  formError.value = ''
  try {
    await api.post('/leave-configurations', form.value)
    showAddModal.value = false
    await fetchConfigurations()
    form.value = {
      name: '',
      code: '',
      application_to: 'all',
      credit_type: 'monthly',
      monthly_credit: '',
      fixed_days: '',
      can_carry_over: false,
      can_monetize: false,
      description: '',
    }
  } catch (err) {
    formError.value = err.response?.data?.message || 'Failed to add leave type'
  } finally {
    formLoading.value = false
  }
}

function openEditModal(config) {
  selectedId.value = config.id
  editForm.value = { ...config }
  showEditModal.value = true
}

async function handleEdit() {
  editLoading.value = true
  try {
    await api.put(`/leave-configurations/${selectedId.value}`, editForm.value)
    showEditModal.value = false
    await fetchConfigurations()
  } catch (err) {
    console.error('Failed to update', err)
  } finally {
    editLoading.value = false
  }
}

async function handleDelete(id) {
  if (confirm('Are you sure you want to delete this leave type?')) {
    try {
      await api.delete(`/leave-configurations/${id}`)
      await fetchConfigurations()
    } catch (err) {
      console.error('Failed to delete', err)
    }
  }
}
</script>
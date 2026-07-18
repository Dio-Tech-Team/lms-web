<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <!-- <p class="text-[11px] uppercase tracking-wider text-teal-600 font-bold mb-1">Leave</p> -->
        <h1 class="text-2xl font-bold text-gray-700">Leave Configuration</h1>
      </div>
      <button
        @click="showAddModal = true"
        class="bg-navy text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-navy-deep transition-colors shadow-sm"
      >
        + Add Leave Type
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center gap-3 py-24">
      <div
        class="w-6 h-6 border-[3px] border-teal-600 border-t-transparent rounded-full animate-spin"
      ></div>
      <span class="text-slate-500 text-sm">Loading configurations...</span>
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-2xl border border-sky-100 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-sky/60 border-b border-sky-100">
          <tr>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Name
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Code
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Applicable To
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Credit Type
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Credits
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Carry Over
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Monetize
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="config in configurations"
            :key="config.id"
            class="border-b border-sky-100 last:border-b-0 hover:bg-sky/40 transition-colors"
          >
            <td class="px-4 py-3.5 font-semibold text-navy-deep">{{ config.name }}</td>
            <td class="px-4 py-3.5">
              <span
                class="bg-sky-100 text-navy px-2 py-0.5 rounded-full text-[11px] font-bold font-mono"
              >
                {{ config.code }}
              </span>
            </td>
            <!-- Inside your table <tbody> -->
            <td class="px-4 py-3.5 text-slate-600 capitalize">
              {{
                Array.isArray(config.application_to)
                  ? config.application_to.join(', ')
                  : config.application_to
              }}
            </td>
            <td class="px-4 py-3.5 text-slate-600 capitalize">{{ config.credit_type }}</td>
            <td class="px-4 py-3.5 font-mono text-[13px] text-navy-deep">
              {{
                config.credit_type === 'monthly'
                  ? config.monthly_credit + '/month'
                  : config.fixed_days + ' days'
              }}
            </td>
            <td class="px-4 py-3.5">
              <span
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
                :class="
                  config.can_carry_over
                    ? 'bg-teal-tint text-teal-700'
                    : 'bg-rose-tint text-rose-700'
                "
              >
                <span
                  class="w-1.5 h-1.5 rounded-full"
                  :class="config.can_carry_over ? 'bg-teal-700' : 'bg-rose-700'"
                ></span>
                {{ config.can_carry_over ? 'Yes' : 'No' }}
              </span>
            </td>
            <td class="px-4 py-3.5">
              <span
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
                :class="
                  config.can_monetize ? 'bg-teal-tint text-teal-700' : 'bg-rose-tint text-rose-700'
                "
              >
                <span
                  class="w-1.5 h-1.5 rounded-full"
                  :class="config.can_monetize ? 'bg-teal-700' : 'bg-rose-700'"
                ></span>
                {{ config.can_monetize ? 'Yes' : 'No' }}
              </span>
            </td>
            <td class="px-4 py-3.5">
              <button
                @click="openEditModal(config)"
                class="text-navy hover:text-navy-deep font-semibold text-sm mr-4 transition-colors"
              >
                Edit
              </button>
              <button
                @click="handleDelete(config.id)"
                class="text-rose-600 hover:text-rose-700 font-semibold text-sm transition-colors"
              >
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="configurations.length === 0">
            <td colspan="8" class="px-4 py-12 text-center text-slate-400 text-sm">
              No leave types configured
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-navy-deep/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-3xl shadow-xl w-full max-w-lg p-7">
        <div class="flex items-center justify-between mb-6">
          <h2 class="font-serif text-xl font-semibold text-navy-deep">Add Leave Type</h2>
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

        <form @submit.prevent="handleAdd">
          <div class="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">Name</label>
              <input
                v-model="form.name"
                type="text"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">Code</label>
              <input
                v-model="form.code"
                type="text"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-2">Applicable To</label>
              <div class="grid grid-cols-2 gap-2 text-sm text-slate-600">
                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    v-model="form.application_to"
                    value="all"
                    class="accent-teal-600"
                  />
                  All
                </label>
                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    v-model="form.application_to"
                    value="permanent"
                    class="accent-teal-600"
                  />
                  Permanent
                </label>
                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    v-model="form.application_to"
                    value="casual"
                    class="accent-teal-600"
                  />
                  Casual
                </label>
                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    v-model="form.application_to"
                    value="elected"
                    class="accent-teal-600"
                  />
                  Elected
                </label>
                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    v-model="form.application_to"
                    value="job_order"
                    class="accent-teal-600"
                  />
                  Job Order
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">Credit Type</label>
              <select
                v-model="form.credit_type"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              >
                <option value="monthly">Monthly</option>
                <option value="fixed">Fixed</option>
              </select>
            </div>
            <div v-if="form.credit_type === 'monthly'">
              <label class="block text-sm font-medium text-navy-deep mb-1.5">Monthly Credit</label>
              <input
                v-model="form.monthly_credit"
                type="number"
                step="0.01"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              />
            </div>
            <div v-if="form.credit_type === 'fixed'">
              <label class="block text-sm font-medium text-navy-deep mb-1.5">Fixed Days</label>
              <input
                v-model="form.fixed_days"
                type="number"
                step="0.01"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              />
            </div>
            <div class="flex items-center gap-2.5">
              <input
                v-model="form.can_carry_over"
                type="checkbox"
                id="carry_over"
                class="w-4 h-4 rounded accent-teal-600"
              />
              <label for="carry_over" class="text-sm text-navy-deep">Can Carry Over</label>
            </div>
            <div class="flex items-center gap-2.5">
              <input
                v-model="form.can_monetize"
                type="checkbox"
                id="monetize"
                class="w-4 h-4 rounded accent-teal-600"
              />
              <label for="monetize" class="text-sm text-navy-deep">Can Monetize</label>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">Description</label>
            <textarea
              v-model="form.description"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              rows="2"
            ></textarea>
          </div>
          <div class="flex justify-end gap-3 mt-6">
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
              {{ formLoading ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-navy-deep/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-3xl shadow-xl w-full max-w-lg p-7">
        <div class="flex items-center justify-between mb-6">
          <h2 class="font-serif text-xl font-semibold text-navy-deep">Edit Leave Type</h2>
          <button
            @click="showEditModal = false"
            class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-sky hover:text-navy transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="handleEdit">
          <div class="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">Name</label>
              <input
                v-model="editForm.name"
                type="text"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">Code</label>
              <input
                v-model="editForm.code"
                type="text"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-2">Applicable To</label>
              <div class="grid grid-cols-2 gap-2 text-sm text-slate-600">
                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    v-model="editForm.application_to"
                    value="all"
                    class="accent-teal-600"
                  />
                  All
                </label>
                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    v-model="editForm.application_to"
                    value="permanent"
                    class="accent-teal-600"
                  />
                  Permanent
                </label>
                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    v-model="editForm.application_to"
                    value="casual"
                    class="accent-teal-600"
                  />
                  Casual
                </label>
                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    v-model="editForm.application_to"
                    value="elected"
                    class="accent-teal-600"
                  />
                  Elected
                </label>
                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    v-model="editForm.application_to"
                    value="job_order"
                    class="accent-teal-600"
                  />
                  Job Order
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">Credit Type</label>
              <select
                v-model="editForm.credit_type"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              >
                <option value="monthly">Monthly</option>
                <option value="fixed">Fixed</option>
              </select>
            </div>
            <div v-if="editForm.credit_type === 'monthly'">
              <label class="block text-sm font-medium text-navy-deep mb-1.5">Monthly Credit</label>
              <input
                v-model="editForm.monthly_credit"
                type="number"
                step="0.01"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              />
            </div>
            <div v-if="editForm.credit_type === 'fixed'">
              <label class="block text-sm font-medium text-navy-deep mb-1.5">Fixed Days</label>
              <input
                v-model="editForm.fixed_days"
                type="number"
                step="0.01"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              />
            </div>
            <div class="flex items-center gap-2.5">
              <input
                v-model="editForm.can_carry_over"
                type="checkbox"
                id="edit_carry_over"
                class="w-4 h-4 rounded accent-teal-600"
              />
              <label for="edit_carry_over" class="text-sm text-navy-deep">Can Carry Over</label>
            </div>
            <div class="flex items-center gap-2.5">
              <input
                v-model="editForm.can_monetize"
                type="checkbox"
                id="edit_monetize"
                class="w-4 h-4 rounded accent-teal-600"
              />
              <label for="edit_monetize" class="text-sm text-navy-deep">Can Monetize</label>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">Description</label>
            <textarea
              v-model="editForm.description"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              rows="2"
            ></textarea>
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <button
              type="button"
              @click="showEditModal = false"
              class="px-5 py-2.5 text-sm font-semibold text-navy border border-sky-100 rounded-xl hover:bg-sky transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="editLoading"
              class="px-5 py-2.5 text-sm font-semibold bg-navy text-white rounded-xl hover:bg-navy-deep transition-colors disabled:opacity-50"
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
import { ref, onMounted, watch } from 'vue'
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
  // application_to: 'all',
  application_to: [],
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
  // application_to: 'all',
  application_to: [],
  credit_type: 'monthly',
  monthly_credit: '',
  fixed_days: '',
  can_carry_over: false,
  can_monetize: false,
  description: '',
})
watch(
  () => form.value.application_to,
  (newVal) => {
    if (newVal.includes('all') && newVal.length > 1) {
      form.value.application_to = ['all']
    }
  }
)

watch(
  () => editForm.value.application_to,
  (newVal) => {
    if (newVal.includes('all') && newVal.length > 1) {
      editForm.value.application_to = ['all']
    }
  }
)

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
      application_to: [],
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
  editForm.value = {
    ...config,
    application_to: Array.isArray(config.application_to) ? config.application_to : [],
  }
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
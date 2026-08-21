<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-700">Positions</h1>
      <button
        @click="openAddModal"
        class="bg-navy text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-navy-deep transition-colors shadow-sm"
      >
        + Add Position
      </button>
    </div>

    <!-- Add/Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-navy-deep/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-3xl shadow-xl w-full max-w-md p-7">
        <div class="flex items-center justify-between mb-6">
          <h2 class="font-serif text-xl font-semibold text-navy-deep">
            {{ editingId ? 'Edit Position' : 'Add Position' }}
          </h2>
          <button
            @click="closeModal"
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

        <form @submit.prevent="handleSubmit">
          <div class="mb-6">
            <label class="block text-sm font-medium text-navy-deep mb-1.5">Position Title</label>
            <input
              v-model="form.title"
              type="text"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              required
            />
          </div>

          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="closeModal"
              class="px-5 py-2.5 text-sm font-semibold text-navy border border-sky-100 rounded-xl hover:bg-sky transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="formLoading"
              class="px-5 py-2.5 text-sm font-semibold bg-navy text-white rounded-xl hover:bg-navy-deep transition-colors disabled:opacity-50"
            >
              {{ formLoading ? 'Saving...' : 'Save Position' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Positions List -->
    <div class="bg-white rounded-2xl border border-sky-100 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-sky/60 border-b border-sky-100">
          <tr>
            <th
              class="w-10 text-left px-5 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              No
            </th>
            <th
              class="text-left px-5 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Title
            </th>
            <th
              class="w-24 text-left px-5 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(pos, index) in paginatedPositions"
            :key="pos.id"
            class="border-b border-sky-100 last:border-b-0 hover:bg-sky/40 transition-colors"
          >
            <td class="px-5 py-3.5 text-slate-500">
              {{ (currentPage - 1) * perPage + index + 1 }}
            </td>
            <td class="px-5 py-3.5 font-medium text-navy-deep">{{ pos.title }}</td>
            <td class="px-5 py-3.5">
              <button
                @click="openEditModal(pos)"
                class="text-teal-700 hover:text-teal-800 font-semibold text-sm transition-colors"
              >
                Edit
              </button>
            </td>
          </tr>

          <tr v-if="positions.length === 0">
            <td colspan="3" class="px-5 py-12 text-center text-slate-400 text-sm">
              No positions found
            </td>
          </tr>
        </tbody>
      </table>
      <!-- ADD (new, goes right after </table>, before the wrapper's closing </div>) -->
      <div class="flex items-center justify-between px-5 py-4 border-t border-sky-100 bg-sky/30">
        <p class="text-[12.5px] text-slate-500">
          Page <span class="font-semibold text-navy-deep">{{ currentPage }}</span> of {{ lastPage }}
          <span class="text-slate-400">· {{ positions.length }} total positions</span>
        </p>
        <div class="flex gap-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3.5 py-1.5 text-[12.5px] font-semibold border border-sky-100 rounded-lg bg-white hover:bg-sky text-navy transition-colors disabled:opacity-40 disabled:hover:bg-white"
          >
            ← Previous
          </button>
          <button
            @click="currentPage++"
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
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axios'

const positions = ref([])
const showModal = ref(false)
const editingId = ref(null)
const formError = ref('')
const formLoading = ref(false)

const currentPage = ref(1)
const perPage = 10

const paginatedPositions = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return positions.value.slice(start, start + perPage)
})
const lastPage = computed(() => Math.max(1, Math.ceil(positions.value.length / perPage)))

const form = ref({
  title: '',
})

async function fetchPositions() {
  try {
    const response = await api.get('/positions')
    positions.value = response.data
  } catch (error) {
    console.error('Error fetching positions:', error)
  }
}

function openAddModal() {
  editingId.value = null
  form.value = { title: '' }
  formError.value = ''
  showModal.value = true
}

function openEditModal(pos) {
  editingId.value = pos.id
  form.value = { title: pos.title }
  formError.value = ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function handleSubmit() {
  formLoading.value = true
  formError.value = ''
  try {
    if (editingId.value) {
      await api.put(`/positions/${editingId.value}`, form.value)
    } else {
      await api.post('/positions', form.value)
    }
    showModal.value = false
    await fetchPositions()
  } catch (error) {
    formError.value = error.response?.data?.message || 'Failed to save position.'
  } finally {
    formLoading.value = false
  }
}

onMounted(fetchPositions)
</script>
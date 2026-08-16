<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-700">Holidays</h1>
        <p class="text-sm text-slate-500 mt-1">
          Dates excluded from leave deduction, in addition to the agency's Mon–Thu work week.
        </p>
      </div>
      <button
        @click="openAddModal()"
        class="bg-navy text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-navy-deep transition-colors shadow-sm"
      >
        + Add Holiday
      </button>
    </div>

    <div
      v-if="errorMessage"
      class="bg-rose-tint border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-5 text-sm"
    >
      {{ errorMessage }}
    </div>

    <!-- Add Holiday Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-navy-deep/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-3xl shadow-xl w-full max-w-md p-7">
        <div class="flex items-center justify-between mb-6">
          <!-- <h2 class="font-serif text-xl font-semibold text-navy-deep">Add Holiday</h2> -->
          <h2 class="font-serif text-xl font-semibold text-navy-deep">
            {{ editingId ? 'Edit Holiday' : 'Add Holiday' }}
          </h2>
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

        <form @submit.prevent="handleSaveHoliday">
          <div class="mb-4">
            <label class="block text-sm font-medium text-navy-deep mb-1.5">Date</label>
            <input
              v-model="form.date"
              type="date"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-navy-deep mb-1.5">Name</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="e.g. Local Suspension - Typhoon Ramon"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              required
            />
          </div>
          <div class="mb-6 flex items-center gap-2">
            <input
              id="is_recurring"
              v-model="form.is_recurring"
              type="checkbox"
              class="rounded border-sky-200 text-teal-600 focus:ring-teal-600"
            />
            <label for="is_recurring" class="text-sm text-navy-deep">
              Recurs every year on this month/day (e.g. Christmas, New Year)
            </label>
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
              {{ formLoading ? 'Saving...' : 'Save Holiday' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Holidays Table -->
    <div class="bg-white rounded-2xl border border-sky-100 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-sky/60 border-b border-sky-100">
          <tr>
            <th
              class="text-left px-5 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Date
            </th>
            <th
              class="text-left px-5 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Name
            </th>
            <th
              class="text-left px-5 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Recurring
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
            v-for="holiday in holidays"
            :key="holiday.id"
            class="border-b border-sky-100 last:border-b-0 hover:bg-sky/40 transition-colors"
          >
            <td class="px-5 py-3.5 font-semibold text-navy-deep">
              {{ formatDate(holiday.date) }}
            </td>
            <td class="px-5 py-3.5 text-slate-600">{{ holiday.name }}</td>
            <td class="px-5 py-3.5">
              <span
                v-if="holiday.is_recurring"
                class="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-teal-100 text-teal-700"
              >
                Yearly
              </span>
              <span v-else class="text-slate-300 text-[12px]">One-time</span>
            </td>

            <td class="px-5 py-3.5">
              <button
                @click="openEditModal(holiday)"
                class="text-teal-700 hover:text-teal-800 font-semibold text-sm transition-colors mr-4"
              >
                Edit
              </button>
              <button
                @click="handleDelete(holiday.id)"
                class="text-rose-600 hover:text-rose-700 font-semibold text-sm transition-colors"
              >
                Delete
              </button>
            </td>
          </tr>

          <tr v-if="holidays.length === 0 && !isLoading">
            <td colspan="4" class="px-5 py-12 text-center text-slate-400 text-sm">
              No holidays added yet
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

const holidays = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const showAddModal = ref(false)
const formError = ref('')
const formLoading = ref(false)

const isEditing = ref(false)
const editingId = ref(null)

const form = ref({
  date: '',
  name: '',
  is_recurring: false,
})

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

async function fetchHolidays() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const response = await api.get('/holidays')
    holidays.value = response.data
  } catch (error) {
    errorMessage.value = 'Failed to load holidays.'
    console.error('Error fetching holidays:', error)
  } finally {
    isLoading.value = false
  }
}

async function handleAddHoliday() {
  formLoading.value = true
  formError.value = ''
  try {
    await api.post('/holidays', form.value)
    showAddModal.value = false
    form.value = { date: '', name: '', is_recurring: false }
    await fetchHolidays()
  } catch (error) {
    formError.value = error.response?.data?.message || 'Failed to add holiday.'
  } finally {
    formLoading.value = false
  }
}

function openAddModal() {
  isEditing.value = false
  editingId.value = null
  form.value = { date: '', name: '', is_recurring: false }
  showAddModal.value = true
}

function openEditModal(holiday) {
  isEditing.value = true
  editingId.value = holiday.id
  form.value = {
    date: holiday.date,
    name: holiday.name,
    is_recurring: holiday.is_recurring,
  }
  showAddModal.value = true
}

async function handleSaveHoliday() {
  formLoading.value = true
  formError.value = ''
  try {
    if (isEditing.value) {
      await api.put(`/holidays/${editingId.value}`, form.value)
    } else {
      await api.post('/holidays', form.value)
    }
    showAddModal.value = false
    form.value = { date: '', name: '', is_recurring: false }
    await fetchHolidays()
  } catch (error) {
    formError.value = error.response?.data?.message || 'Failed to save holiday.'
  } finally {
    formLoading.value = false
  }
}

async function handleDelete(id) {
  if (
    !confirm(
      'Delete this holiday? This does not retroactively adjust any already-approved leave applications.'
    )
  ) {
    return
  }
  try {
    await api.delete(`/holidays/${id}`)
    await fetchHolidays()
  } catch (error) {
    errorMessage.value = 'Failed to delete holiday.'
    console.error('Error deleting holiday:', error)
  }
}

onMounted(fetchHolidays)
</script>
<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-serif text-2xl font-semibold text-navy-deep">Holidays</h1>
        <!-- <p class="text-sm text-slate-500 mt-1">
          Dates excluded from leave deduction, in addition to the agency's Mon–Thu work week.
        </p> -->
      </div>
      <button
        @click="openAddModal()"
        class="bg-navy text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-navy-deep transition-colors shadow-sm"
      >
        + Add Holiday
      </button>
    </div>
    <div class="w-48 mb-6">
      <label class="block text-sm font-medium text-navy-deep mb-1.5">Year</label>
      <select
        v-model="selectedYear"
        class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
        @change="onYearChange"
      >
        <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
      </select>
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
              No.
            </th>
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
            v-for="(holiday, index) in paginatedHolidays"
            :key="holiday.id"
            class="border-b border-sky-100 last:border-b-0 hover:bg-sky/40 transition-colors"
          >
            <td class="px-5 py-3.5 text-slate-500">
              {{ (currentPage - 1) * perPage + index + 1 }}
            </td>
            <td class="px-5 py-3.5 font-semibold text-navy-deep">
              {{ holiday.is_recurring ? formatMonthDay(holiday.date) : formatDate(holiday.date) }}
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
            <td colspan="5" class="px-5 py-12 text-center text-slate-400 text-sm">
              No holidays added yet
            </td>
          </tr>
        </tbody>
      </table>

      <!-- ADD -->
      <div class="flex items-center justify-between px-5 py-4 border-t border-sky-100 bg-sky/30">
        <p class="text-[12.5px] text-slate-500">
          Page <span class="font-semibold text-navy-deep">{{ currentPage }}</span> of {{ lastPage }}
          <span class="text-slate-400">· {{ holidays.length }} total holidays</span>
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
import { ref, onMounted, computed } from 'vue'
import { useConfirm } from '@/composables/useConfirm'
import api from '@/api/axios'

const holidays = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const showAddModal = ref(false)
const formError = ref('')
const formLoading = ref(false)
const { confirm } = useConfirm()

// ADD (near your other refs)
const currentPage = ref(1)
const perPage = 10

const currentYear = new Date().getFullYear()
const selectedYear = ref(currentYear)
const availableYears = [currentYear, currentYear + 1, currentYear + 2]

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

// Recurring holidays carry a year in their stored date, but it only records
// when HR entered them — showing it would imply the holiday belongs to that
// year alone.
function formatMonthDay(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-PH', {
    month: 'long',
    day: 'numeric',
  })
}

function onYearChange() {
  currentPage.value = 1
  fetchHolidays()
}

async function fetchHolidays() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const response = await api.get('/holidays', { params: { year: selectedYear.value } })
    holidays.value = response.data
  } catch (error) {
    errorMessage.value = 'Failed to load holidays.'
    console.error('Error fetching holidays:', error)
  } finally {
    isLoading.value = false
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
  const ok = await confirm({
    title: 'Delete holiday?',
    message: 'This does not retroactively adjust any already-approved leave applications.',
  })
  if (!ok) return

  try {
    await api.delete(`/holidays/${id}`)
    await fetchHolidays()
  } catch (error) {
    errorMessage.value = 'Failed to delete holiday.'
    console.error('Error deleting holiday:', error)
  }
}

const paginatedHolidays = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return holidays.value.slice(start, start + perPage)
})
const lastPage = computed(() => Math.max(1, Math.ceil(holidays.value.length / perPage)))

onMounted(fetchHolidays)
</script>
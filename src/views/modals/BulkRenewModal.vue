<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-navy-deep/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  >
    <div class="bg-white rounded-3xl shadow-xl w-full max-w-lg p-7 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-2">
        <h2 class="font-serif text-xl font-semibold text-navy-deep">Renew Appointments</h2>
        <button
          @click="emit('close')"
          class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-sky hover:text-navy transition-colors text-lg"
        >
          ✕
        </button>
      </div>

      <!-- Result after saving -->
      <template v-if="result">
        <div
          class="bg-teal-tint border border-teal-100 text-teal-700 px-4 py-3 rounded-xl my-5 text-sm"
        >
          {{ result }}
        </div>
        <div class="flex justify-end">
          <button
            @click="emit('close')"
            class="px-5 py-2.5 text-sm font-semibold bg-navy text-white rounded-xl hover:bg-navy-deep transition-colors"
          >
            Done
          </button>
        </div>
      </template>

      <template v-else>
        <p class="text-sm text-slate-500 mb-5">
          Tick the employees whose appointment paper has the same effectivity date.
        </p>

        <div
          v-if="error"
          class="bg-rose-tint border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-5 text-sm"
        >
          {{ error }}
        </div>

        <div class="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">
              Effectivity Date <span class="text-rose-600">*</span>
            </label>
            <input
              v-model="form.renewal_date"
              type="date"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">
              New Appointment End <span class="text-rose-600">*</span>
            </label>
            <input
              v-model="form.appointment_end"
              type="date"
              :min="form.renewal_date"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
            />
          </div>
        </div>

        <div v-if="loadingList" class="text-sm text-slate-400 py-6 text-center">Loading...</div>
        <div v-else-if="rows.length === 0" class="text-sm text-slate-400 italic py-6 text-center">
          No casual appointments due.
        </div>
        <div v-else class="border border-sky-100 rounded-xl overflow-hidden mb-5">
          <label
            class="flex items-center gap-3 px-4 py-2.5 bg-sky/60 border-b border-sky-100 text-[11px] uppercase tracking-wider text-slate-500 font-bold cursor-pointer"
          >
            <input type="checkbox" :checked="allChecked" @change="toggleAll" />
            Select all ({{ selected.length }}/{{ rows.length }})
          </label>
          <label
            v-for="r in rows"
            :key="r.id"
            class="flex items-center gap-3 px-4 py-2.5 border-b border-sky-100 last:border-b-0 text-sm cursor-pointer hover:bg-sky/40"
          >
            <input type="checkbox" :value="r.id" v-model="selected" />
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-navy-deep truncate">{{ r.name }}</p>
              <p class="text-xs text-slate-400 truncate">
                {{ r.department }} · ends {{ prettyDate(r.appointment_end) }}
              </p>
            </div>
            <span
              v-if="gapFor(r) > 0"
              class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 whitespace-nowrap"
            >
              {{ gapFor(r) }} day(s) late
            </span>
          </label>
        </div>

        <div class="flex justify-end gap-3">
          <button
            type="button"
            @click="emit('close')"
            class="px-5 py-2.5 text-sm font-semibold text-navy border border-sky-100 rounded-xl hover:bg-sky transition-colors"
          >
            Cancel
          </button>
          <button
            @click="submit"
            :disabled="
              saving || selected.length === 0 || !form.renewal_date || !form.appointment_end
            "
            class="px-5 py-2.5 text-sm font-semibold bg-teal-600 text-white rounded-xl hover:bg-[#256F63] transition-colors disabled:opacity-50"
          >
            {{ saving ? 'Saving...' : `Renew ${selected.length}` }}
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import api from '@/api/axios'

const props = defineProps({ show: Boolean })
const emit = defineEmits(['close', 'updated'])

const rows = ref([])
const selected = ref([])
const form = ref({ renewal_date: '', appointment_end: '' })
const loadingList = ref(false)
const saving = ref(false)
const error = ref('')
const result = ref('')

function toYmd(dt) {
  const p = (n) => String(n).padStart(2, '0')
  return `${dt.getFullYear()}-${p(dt.getMonth() + 1)}-${p(dt.getDate())}`
}
function parseYmd(s) {
  const [y, m, d] = String(s).split('T')[0].split('-').map(Number)
  return new Date(y, m - 1, d)
}
function semesterEnd(ymd) {
  const [y, m] = ymd.split('-').map(Number)
  return m <= 6 ? `${y}-06-30` : `${y}-12-31`
}
function prettyDate(s) {
  return parseYmd(s).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Same count as the backend: day after the old end up to the day before renewal
function gapFor(r) {
  if (!form.value.renewal_date) return 0
  const start = parseYmd(r.appointment_end)
  start.setDate(start.getDate() + 1)
  return Math.max(0, Math.round((parseYmd(form.value.renewal_date) - start) / 86400000))
}

const allChecked = computed(
  () => rows.value.length > 0 && selected.value.length === rows.value.length
)
function toggleAll() {
  selected.value = allChecked.value ? [] : rows.value.map((r) => r.id)
}

watch(
  () => props.show,
  async (open) => {
    if (!open) return
    error.value = ''
    result.value = ''
    selected.value = []
    loadingList.value = true
    try {
      const res = await api.get('/employees/appointments-due')
      rows.value = res.data
      // Default: the day after the earliest end (usually Jan 1 or Jul 1)
      const start = rows.value.length ? parseYmd(rows.value[0].appointment_end) : new Date()
      if (rows.value.length) start.setDate(start.getDate() + 1)
      form.value.renewal_date = toYmd(start)
    } catch (e) {
      error.value = 'Failed to load casual appointments.'
    } finally {
      loadingList.value = false
    }
  }
)

watch(
  () => form.value.renewal_date,
  (v) => {
    if (v) form.value.appointment_end = semesterEnd(v)
  }
)

async function submit() {
  saving.value = true
  error.value = ''
  try {
    const res = await api.post('/employees/renew-bulk', {
      employee_ids: selected.value,
      renewal_date: form.value.renewal_date,
      appointment_end: form.value.appointment_end,
    })
    result.value = res.data.message
    emit('updated')
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to renew appointments.'
  } finally {
    saving.value = false
  }
}
</script>
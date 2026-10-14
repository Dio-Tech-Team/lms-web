<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-navy-deep/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  >
    <div class="bg-white rounded-3xl shadow-xl w-full max-w-md p-7">
      <div class="flex items-center justify-between mb-2">
        <h2 class="font-serif text-xl font-semibold text-navy-deep">Renew Appointment</h2>
        <button
          @click="emit('close')"
          class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-sky hover:text-navy transition-colors text-lg"
        >
          ✕
        </button>
      </div>
      <p class="text-sm text-slate-500 mb-5">
        Current appointment ends
        <strong class="text-navy-deep">{{ currentEndLabel }}</strong
        >.
      </p>

      <div
        v-if="error"
        class="bg-rose-tint border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-5 text-sm"
      >
        {{ error }}
      </div>

      <form @submit.prevent="submit">
        <div class="space-y-4 mb-5">
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">
              Renewal Date <span class="text-rose-600">*</span>
            </label>
            <input
              v-model="form.renewal_date"
              type="date"
              required
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
              required
              :min="form.renewal_date"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
            />
            <p class="text-xs text-slate-400 mt-1">
              Pre-filled to the semester end (Jun 30 or Dec 31); change it to match the appointment
              paper.
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">
              Remarks <span class="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              v-model="form.remarks"
              type="text"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
            />
          </div>
        </div>

        <div
          v-if="gap > 0"
          class="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl mb-5 text-sm"
        >
          Late renewal: <strong>{{ gap }} day(s)</strong> without appointment. That month's VL and
          SL credit will be reduced.
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
            type="submit"
            :disabled="loading"
            class="px-5 py-2.5 text-sm font-semibold bg-teal-600 text-white rounded-xl hover:bg-[#256F63] transition-colors disabled:opacity-50"
          >
            {{ loading ? 'Saving...' : 'Renew' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import api from '@/api/axios'

const props = defineProps({
  show: Boolean,
  employeeId: [String, Number],
  employee: Object,
})
const emit = defineEmits(['close', 'updated'])

const form = ref({ renewal_date: '', appointment_end: '', remarks: '' })
const error = ref('')
const loading = ref(false)

// Local-date helpers, so nothing shifts a day in PH time
function toYmd(dt) {
  const p = (n) => String(n).padStart(2, '0')
  return `${dt.getFullYear()}-${p(dt.getMonth() + 1)}-${p(dt.getDate())}`
}
function parseYmd(s) {
  const [y, m, d] = String(s).split('T')[0].split('-').map(Number)
  return new Date(y, m - 1, d)
}
// Appointments end on Jun 30 or Dec 31 of the semester the renewal falls in,
// so a late renewal (Jan 3, Jul 4) doesn't shift the next period.
function sixMonthsFrom(ymd) {
  const [y, m] = String(ymd).split('-').map(Number)
  return m <= 6 ? `${y}-06-30` : `${y}-12-31`
}
const currentEndLabel = computed(() => {
  const end = props.employee?.appointment_end
  if (!end) return 'not set'
  return parseYmd(end).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
})

// Same count the backend uses: day after the old end up to the day before renewal
const gap = computed(() => {
  const end = props.employee?.appointment_end
  const r = form.value.renewal_date
  if (!end || !r) return 0
  const gapStart = parseYmd(end)
  gapStart.setDate(gapStart.getDate() + 1)
  return Math.max(0, Math.round((parseYmd(r) - gapStart) / 86400000))
})

// Each time it opens: renewal defaults to the day after the current end
watch(
  () => props.show,
  (open) => {
    if (!open) return
    const end = props.employee?.appointment_end
    const start = end ? parseYmd(end) : new Date()
    if (end) start.setDate(start.getDate() + 1)
    const renewal = toYmd(start)
    form.value = { renewal_date: renewal, appointment_end: sixMonthsFrom(renewal), remarks: '' }
    error.value = ''
  }
)

watch(
  () => form.value.renewal_date,
  (v) => {
    if (v) form.value.appointment_end = sixMonthsFrom(v)
  }
)

async function submit() {
  loading.value = true
  error.value = ''
  try {
    const res = await api.post(`/employees/${props.employeeId}/renew`, {
      renewal_date: form.value.renewal_date,
      appointment_end: form.value.appointment_end,
      remarks: form.value.remarks.trim() || null,
    })
    emit('updated', res.data.message)
    emit('close')
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to renew appointment.'
  } finally {
    loading.value = false
  }
}
</script>  
<template>
  <div
    v-if="show && application"
    class="fixed inset-0 z-50 flex items-center justify-center bg-navy-deep/40 px-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
      <h2 class="text-lg font-bold text-navy-deep mb-1">
        {{ preview ? 'Confirm Cancellation' : 'Cancel Approved Leave' }}
      </h2>
      <p class="text-[13px] text-slate-500 mb-5">
        {{ application.first_name }} {{ application.surname }} · {{ application.leave_type_code }}
        <template v-if="!preview">
          · {{ prettyRange(startDate, endDate) }} · {{ fmt(application.days_applied) }} day(s)
        </template>
      </p>

      <div
        v-if="error"
        class="bg-rose-tint text-rose-700 text-[13px] rounded-lg px-3.5 py-2.5 mb-4 font-medium"
      >
        {{ error }}
      </div>

      <!-- ========== Screen 1: form ========== -->
      <template v-if="!preview">
        <div v-if="started" class="mb-4">
          <p
            class="bg-amber-tint text-amber-700 text-[13px] rounded-lg px-3.5 py-3 font-medium leading-relaxed mb-3"
          >
            This leave has already started. Enter the last day the employee was actually on leave.
            The remaining days will be cancelled.
          </p>

          <label class="flex items-center gap-2 text-[13px] text-slate-600 mb-3">
            <input type="checkbox" v-model="noneTaken" />
            No days were taken (cancel the whole leave)
          </label>

          <div v-if="!noneTaken">
            <label class="block text-[12.5px] font-semibold text-slate-600 mb-1.5">
              Last day actually taken
            </label>
            <input
              v-model="lastDay"
              type="date"
              :min="startDate"
              :max="maxLastDay"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            />
          </div>
        </div>

        <p v-else class="text-[13px] text-slate-500 mb-4">The whole leave will be cancelled.</p>

        <div class="mb-5">
          <label class="block text-[12.5px] font-semibold text-slate-600 mb-1.5">
            Reason for cancellation
          </label>
          <select
            v-model="selectedReason"
            class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
          >
            <option value="">Select a reason</option>
            <option v-for="r in CANCELLATION_REASONS" :key="r" :value="r">{{ r }}</option>
            <option :value="OTHER_REASON">Other (please specify)</option>
          </select>
          <textarea
            v-if="selectedReason === OTHER_REASON"
            v-model="otherReason"
            rows="3"
            placeholder="Explain why this leave is being cancelled."
            class="w-full mt-2 border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors resize-none"
          ></textarea>
        </div>

        <div class="flex justify-end gap-3">
          <button
            @click="$emit('close')"
            :disabled="submitting"
            class="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors disabled:opacity-40"
          >
            Close
          </button>
          <button
            @click="runPreview"
            :disabled="submitting"
            class="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-navy hover:bg-navy-deep transition-colors disabled:opacity-50"
          >
            {{ submitting ? 'Checking...' : 'Continue' }}
          </button>
        </div>
      </template>

      <!-- ========== Screen 2: confirm ========== -->
      <template v-else>
        <div class="bg-sky/50 rounded-xl p-4 space-y-2.5 mb-4 text-[13px]">
          <div class="flex justify-between gap-4">
            <span class="text-slate-400">Before</span>
            <span class="text-slate-500 line-through text-right">
              {{ prettyRange(preview.start_date, preview.end_date) }} ·
              {{ fmt(preview.days_applied) }} days
            </span>
          </div>
          <div class="flex justify-between gap-4">
            <span class="text-slate-400">After</span>
            <span class="font-semibold text-navy-deep text-right">
              <template v-if="preview.full_cancel">Cancelled</template>
              <template v-else>
                {{ prettyRange(preview.start_date, preview.new_end_date) }} ·
                {{ fmt(preview.days_used) }} days
              </template>
            </span>
          </div>
          <div class="flex justify-between border-t border-sky-100 pt-2.5">
            <span class="text-slate-400">Days cancelled</span>
            <span class="font-semibold text-navy-deep">{{ fmt(preview.days_cancelled) }}</span>
          </div>
          <div v-if="preview.credits_returned > 0" class="flex justify-between">
            <span class="text-slate-400">Returned to {{ preview.credit_code }}</span>
            <span class="font-semibold text-teal-700">+{{ fmt(preview.credits_returned) }}</span>
          </div>
          <div v-if="preview.lwop_removed > 0" class="flex justify-between">
            <span class="text-slate-400">LWOP days removed</span>
            <span class="font-semibold text-navy-deep">{{ fmt(preview.lwop_removed) }}</span>
          </div>
        </div>

        <div class="text-[12.5px] mb-5">
          <p class="text-slate-400 mb-1">Reason</p>
          <p class="text-navy-deep">
            {{ selectedReason === OTHER_REASON ? otherReason.trim() : selectedReason }}
          </p>
          <p class="text-slate-400 mt-3">
            This cannot be undone. Check the numbers before confirming.
          </p>
        </div>

        <div class="flex justify-end gap-3">
          <button
            @click="preview = null"
            :disabled="submitting"
            class="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors disabled:opacity-40"
          >
            Back
          </button>
          <button
            @click="confirm"
            :disabled="submitting"
            class="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors disabled:opacity-50"
          >
            {{ submitting ? 'Saving...' : 'Confirm Cancellation' }}
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import api from '@/api/axios'
import { CANCELLATION_REASONS, OTHER_REASON, buildReason } from '@/constants/leaveReasons'

const props = defineProps({
  show: Boolean,
  application: { type: Object, default: null },
})

const emit = defineEmits(['close', 'updated'])

const selectedReason = ref('')
const otherReason = ref('')
const noneTaken = ref(false)
const lastDay = ref('')
const submitting = ref(false)
const error = ref('')
const preview = ref(null) // dry-run result; null = still on the form

// Local YYYY-MM-DD — not toISOString(), which shifts a day in PH time
function toYmd(d) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
function addDays(ymd, n) {
  const [y, m, d] = ymd.split('-').map(Number)
  return toYmd(new Date(y, m - 1, d + n))
}
function fmt(n) {
  const v = Number(n)
  return v % 1 === 0 ? v.toFixed(0) : v.toFixed(3)
}

// 'Sep 28 – Oct 8, 2026' style, from YYYY-MM-DD strings
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
function prettyRange(s, e) {
  if (!s || !e) return ''
  const [sy, sm, sd] = s.split('-').map(Number)
  const [ey, em, ed] = e.split('-').map(Number)
  if (sy === ey && sm === em && sd === ed) return `${MONTHS[sm - 1]} ${sd}, ${sy}`
  if (sy === ey && sm === em) return `${MONTHS[sm - 1]} ${sd} – ${ed}, ${sy}`
  if (sy === ey) return `${MONTHS[sm - 1]} ${sd} – ${MONTHS[em - 1]} ${ed}, ${sy}`
  return `${MONTHS[sm - 1]} ${sd}, ${sy} – ${MONTHS[em - 1]} ${ed}, ${ey}`
}

const today = toYmd(new Date())
const startDate = computed(() => props.application?.start_date?.toString().split('T')[0] ?? '')
const endDate = computed(() => props.application?.end_date?.toString().split('T')[0] ?? '')
const started = computed(() => startDate.value && startDate.value <= today)

const maxLastDay = computed(() => {
  const dayBeforeEnd = addDays(endDate.value, -1)
  return today < dayBeforeEnd ? today : dayBeforeEnd
})

// Saved form keeps the "Other:" prefix for records; the screen hides it
const reasonText = computed(() => buildReason(selectedReason.value, otherReason.value))

watch(
  () => props.show,
  (open) => {
    if (!open) return
    selectedReason.value = ''
    otherReason.value = ''
    noneTaken.value = false
    error.value = ''
    submitting.value = false
    preview.value = null

    if (started.value) {
      let d = addDays(today, -1)
      if (d < startDate.value) d = startDate.value
      if (d > maxLastDay.value) d = maxLastDay.value
      lastDay.value = d
    } else {
      lastDay.value = ''
    }
  }
)

function buildBody(dryRun) {
  const body = { reason: reasonText.value, dry_run: dryRun }
  if (started.value) {
    if (noneTaken.value) body.none_taken = true
    else body.last_day_taken = lastDay.value
  }
  return body
}

function validate() {
  if (!selectedReason.value) return 'Select a reason for cancellation.'
  if (selectedReason.value === OTHER_REASON && !otherReason.value.trim())
    return 'Please specify the reason.'
  if (started.value && !noneTaken.value && !lastDay.value)
    return 'Enter the last day actually taken, or tick "No days were taken".'
  return ''
}

// Step 1 → 2: ask the backend what would happen, change nothing
async function runPreview() {
  if (submitting.value) return
  error.value = validate()
  if (error.value) return

  submitting.value = true
  try {
    const res = await api.post(
      `/leave-applications/${props.application.id}/cancel-approved`,
      buildBody(true)
    )
    preview.value = res.data
  } catch (err) {
    error.value = err.response?.data?.message || 'Something went wrong.'
  } finally {
    submitting.value = false
  }
}

// Step 2: actually save, with the exact same inputs
async function confirm() {
  if (submitting.value) return
  submitting.value = true
  error.value = ''
  try {
    const res = await api.post(
      `/leave-applications/${props.application.id}/cancel-approved`,
      buildBody(false)
    )
    emit('updated', res.data.message)
    emit('close')
  } catch (err) {
    error.value = err.response?.data?.message || 'Something went wrong.'
  } finally {
    submitting.value = false
  }
}
</script>
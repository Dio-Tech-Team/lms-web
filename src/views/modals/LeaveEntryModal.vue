<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-navy/20 backdrop-blur-sm p-4"
  >
    <div class="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl border border-sky-100">
      <h2 class="font-serif text-lg font-semibold text-navy-deep mb-4">
        {{ isAdmin ? 'Admin Paper Entry' : 'Apply for Leave' }}
      </h2>

      <form @submit.prevent="submitApplication" class="space-y-4">
        <!-- Employee picker: only when the parent didn't already tell us who -->
        <div v-if="needsPicker" class="relative">
          <label class="block text-[10.5px] uppercase font-bold text-slate-400 mb-1">
            Step 1 — Search Employee
          </label>
          <div
            v-if="selectedEmployee"
            class="flex items-center justify-between border border-sky-100 rounded-lg p-2.5 bg-sky/40"
          >
            <div>
              <p class="text-sm font-semibold text-navy-deep">
                {{ selectedEmployee.first_name }} {{ selectedEmployee.surname }}
              </p>
              <p class="text-[12px] text-slate-400">
                {{ selectedEmployee.department?.name || selectedEmployee.department || '' }}
              </p>
            </div>
            <button
              type="button"
              @click="clearEmployee"
              class="text-xs text-teal-700 hover:text-teal-800 font-semibold"
            >
              Change
            </button>
          </div>

          <template v-else>
            <input
              v-model="employeeQuery"
              type="text"
              placeholder="Search by name or ID number"
              class="w-full border border-sky-100 rounded-lg p-2.5 text-sm"
              autocomplete="off"
            />
            <div
              v-if="employeeQuery.trim().length > 0"
              class="absolute z-10 left-0 right-0 mt-1 bg-white border border-sky-100 rounded-lg shadow-lg max-h-52 overflow-y-auto"
            >
              <p v-if="searchingEmployees" class="px-3 py-2.5 text-[13px] text-slate-400">
                Searching…
              </p>
              <button
                v-for="emp in employeeResults"
                :key="emp.id"
                type="button"
                @click="selectEmployee(emp)"
                class="w-full text-left px-3 py-2 hover:bg-sky/60 border-b border-sky-100 last:border-b-0"
              >
                <p class="text-sm font-semibold text-navy-deep">
                  {{ emp.first_name }} {{ emp.surname }}
                </p>
                <p class="text-[12px] text-slate-400 font-mono">{{ emp.id_number || '—' }}</p>
              </button>
              <p
                v-if="!searchingEmployees && employeeResults.length === 0"
                class="px-3 py-2.5 text-[13px] text-slate-400"
              >
                No employees found.
              </p>
            </div>
          </template>
        </div>

        <!-- Leave Type -->
        <div>
          <label class="block text-[10.5px] uppercase font-bold text-slate-400 mb-1"
            >{{ needsPicker ? 'Step 2' : 'Step 1' }} — Select Leave Type</label
          >
          <select
            v-model="form.leave_configuration_id"
            class="w-full border border-sky-100 rounded-lg p-2.5 text-sm"
            required
          >
            <option value="" disabled>Select Leave Type</option>
            <option v-for="config in resolvedLeaveTypes" :key="config.id" :value="config.id">
              {{ config.name }}
            </option>
          </select>
        </div>

        <!-- Balance for the chosen type, before dates are picked -->
        <p v-if="selectedTypeBalance" class="text-[13px] text-slate-500 -mt-2">
          <span class="font-semibold text-navy-deep">
            {{ selectedTypeBalance.code }} {{ Number(selectedTypeBalance.balance).toFixed(3) }}
          </span>
          day(s) available
          <span v-if="selectedTypeBalance.redirected" class="text-slate-400">
            — Forced Leave draws from Vacation Leave
          </span>
        </p>

        <!-- Date Range -->
        <label class="block text-[10.5px] uppercase font-bold text-slate-400 -mb-1">
          {{ needsPicker ? 'Step 3' : 'Step 2' }} — Choose Dates
        </label>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-[10.5px] uppercase font-bold text-slate-400 mb-1"
              >Start Date</label
            >
            <input
              type="date"
              v-model="form.start_date"
              class="w-full border border-sky-100 rounded-lg p-2 text-sm"
              required
            />
          </div>
          <div>
            <label class="block text-[10.5px] uppercase font-bold text-slate-400 mb-1"
              >End Date</label
            >
            <input
              type="date"
              v-model="form.end_date"
              class="w-full border border-sky-100 rounded-lg p-2 text-sm"
              required
            />
          </div>
        </div>

        <!-- What the backend will actually count -->
        <div
          v-if="preview || previewLoading"
          class="rounded-lg px-3.5 py-2.5 text-[13px]"
          :class="
            preview?.hard_blocked
              ? 'bg-rose-tint text-rose-700'
              : preview?.will_be_lwop
              ? 'bg-amber-tint text-amber-700'
              : 'bg-sky/60 text-navy-deep'
          "
        >
          <span v-if="previewLoading" class="text-slate-400">Calculating…</span>
          <template v-else>
            <p class="font-semibold">
              {{ preview.days_applied }} day(s)
              <span class="font-normal text-slate-500">
                ({{
                  preview.counting === 'working'
                    ? 'excludes weekends and holidays'
                    : 'calendar days'
                }})
              </span>
            </p>
            <p v-if="preview.remaining_balance !== null" class="mt-0.5">
              {{ preview.target_code }} {{ Number(preview.remaining_balance).toFixed(3) }} →
              {{ Number(preview.balance_after).toFixed(3) }}
            </p>
            <p v-else class="mt-0.5">No {{ preview.target_code }} credits for this year.</p>
            <p v-if="preview.hard_blocked" class="mt-1 font-semibold">
              Insufficient balance — this leave type cannot be filed beyond the balance.
            </p>
            <p v-else-if="preview.will_be_lwop" class="mt-1 font-semibold">
              {{ Number(preview.shortfall).toFixed(3) }} day(s) will be Leave Without Pay.
            </p>
          </template>
        </div>

        <!-- Reason -->
        <div>
          <label class="block text-[10.5px] uppercase font-bold text-slate-400 mb-1"
            >{{ needsPicker ? 'Step 4' : 'Step 3' }} — Reason</label
          >
          <textarea
            v-model="form.reason"
            class="w-full border border-sky-100 rounded-lg p-2.5 text-sm"
            rows="3"
            required
          ></textarea>
        </div>

        <!-- Admin Paper Toggle -->
        <div v-if="isAdmin" class="flex items-center gap-2 py-2">
          <input
            type="checkbox"
            v-model="form.is_paper_submission"
            id="paper-check"
            class="rounded text-navy border-sky-100"
          />
          <label for="paper-check" class="text-sm font-semibold text-navy cursor-pointer">
            Mark as Paper-Based Submission
          </label>
        </div>

        <p v-if="formError" class="text-[13px] text-rose-700 font-medium">{{ formError }}</p>

        <div class="flex justify-end gap-2 mt-6">
          <button
            type="button"
            @click="close"
            class="px-4 py-2 text-sm text-slate-500 hover:text-navy"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-4 py-2 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-navy-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{
              isSubmitting
                ? 'Submitting...'
                : form.is_paper_submission
                ? 'Post Paper Entry'
                : 'Submit Application'
            }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import api from '@/api/axios'

const props = defineProps(['show', 'employeeId', 'leaveTypes', 'leaveCredits', 'isAdmin'])
const emit = defineEmits(['close', 'updated'])
const isSubmitting = ref(false)
const formError = ref('')

const form = ref({
  leave_configuration_id: '',
  start_date: '',
  end_date: '',
  reason: '',
  is_paper_submission: false,
})

/* ---------- Employee picker (Dashboard mode only) ---------- */
// The modal shows a search field only when nobody handed it an employee.
// Profile passes employeeId, so nothing changes there.
const needsPicker = computed(() => !props.employeeId)
const employeeQuery = ref('')
const employeeResults = ref([])
const searchingEmployees = ref(false)
const selectedEmployee = ref(null)

const resolvedEmployeeId = computed(() => props.employeeId || selectedEmployee.value?.id || null)

let searchTimer = null
watch(employeeQuery, (q) => {
  clearTimeout(searchTimer)
  const term = q.trim()
  if (term.length < 2) {
    employeeResults.value = []
    searchingEmployees.value = false
    return
  }
  searchingEmployees.value = true
  searchTimer = setTimeout(async () => {
    try {
      const res = await api.get('/employees', { params: { search: term, per_page: 15 } })
      employeeResults.value = res.data.data || res.data || []
    } catch (err) {
      console.error('Employee search failed:', err)
      employeeResults.value = []
    } finally {
      searchingEmployees.value = false
    }
  }, 350)
})

async function selectEmployee(emp) {
  selectedEmployee.value = emp
  employeeQuery.value = ''
  employeeResults.value = []
  await fetchCreditsFor(emp.id)
}

function clearEmployee() {
  selectedEmployee.value = null
  fetchedCredits.value = []
  preview.value = null
}

/* ---------- Leave types & credits ---------- */
// Profile passes both in. Dashboard passes neither, so fetch on open.
const fetchedLeaveTypes = ref([])
const fetchedCredits = ref([])

const resolvedLeaveTypes = computed(() =>
  props.leaveTypes?.length ? props.leaveTypes : fetchedLeaveTypes.value
)
const resolvedCredits = computed(() =>
  props.employeeId ? props.leaveCredits || [] : fetchedCredits.value
)

async function fetchLeaveTypes() {
  try {
    const res = await api.get('/leave-configurations?active_only=true')
    fetchedLeaveTypes.value = res.data.data || res.data || []
  } catch (err) {
    console.error('Failed to load leave types:', err)
  }
}

async function fetchCreditsFor(id) {
  try {
    const res = await api.get(`/employees/${id}/leave-credits`)
    fetchedCredits.value = res.data.credits || res.data.data || res.data || []
  } catch (err) {
    console.error('Failed to load leave credits:', err)
    fetchedCredits.value = []
  }
}

watch(
  () => props.show,
  (open) => {
    if (!open) return
    formError.value = ''
    if (!props.leaveTypes?.length && !fetchedLeaveTypes.value.length) fetchLeaveTypes()
  }
)

/* ---------- Existing logic ---------- */
const daysApplied = computed(() => {
  if (!form.value.start_date || !form.value.end_date) return 0
  const start = new Date(form.value.start_date)
  const end = new Date(form.value.end_date)
  const diffTime = Math.abs(end - start)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
})

const selectedConfig = computed(() =>
  (resolvedLeaveTypes.value || []).find((c) => c.id === form.value.leave_configuration_id)
)
// FL has no credit row of its own, so report the VL balance instead of
// its 0/0/0 placeholder — same resolution the backend uses.
const selectedTypeBalance = computed(() => {
  const config = selectedConfig.value
  if (!config) return null

  const redirected = config.code === 'FL'
  const targetCode = redirected ? 'VL' : config.code

  const year = form.value.start_date
    ? new Date(form.value.start_date).getFullYear()
    : new Date().getFullYear()

  const credit = (resolvedCredits.value || []).find(
    (c) => String(c.code).toUpperCase() === targetCode && Number(c.year) === year
  )
  if (!credit) return null

  return { code: targetCode, balance: credit.remaining_balance, redirected }
})

watch(
  [() => form.value.leave_configuration_id, () => form.value.start_date],
  ([configId, startDate]) => {
    if (!configId || !startDate) return
    if (selectedConfig.value?.grant_type !== 'event_manual') return

    const year = new Date(startDate).getFullYear()
    const credit = (resolvedCredits.value || []).find(
      (c) => c.code === selectedConfig.value?.code && Number(c.year) === year
    )
    if (!credit) return

    const grantedDays = Number(credit.remaining_balance)
    if (!grantedDays || grantedDays <= 0) return

    const start = new Date(startDate)
    const end = new Date(start)
    end.setDate(end.getDate() + (grantedDays - 1))

    form.value.end_date = end.toISOString().split('T')[0]
  }
)

/* ---------- Days / credits preview ---------- */
// The day count comes from the backend, not from daysApplied above, so the
// number shown is the number deducted. Local math would drift the moment
// the working week or holiday rules change.
const preview = ref(null)
const previewLoading = ref(false)
let previewTimer = null

watch(
  [
    () => resolvedEmployeeId.value,
    () => form.value.leave_configuration_id,
    () => form.value.start_date,
    () => form.value.end_date,
  ],
  ([empId, configId, start, end]) => {
    formError.value = ''
    clearTimeout(previewTimer)

    if (!empId || !configId || !start || !end || new Date(end) < new Date(start)) {
      preview.value = null
      previewLoading.value = false
      return
    }

    previewLoading.value = true
    previewTimer = setTimeout(async () => {
      try {
        const res = await api.post('/leave-applications/preview', {
          employee_id: empId,
          leave_configuration_id: configId,
          start_date: start,
          end_date: end,
        })
        preview.value = res.data
      } catch (err) {
        console.error('Preview failed:', err)
        preview.value = null
      } finally {
        previewLoading.value = false
      }
    }, 350)
  }
)

async function submitApplication() {
  if (isSubmitting.value) return

  if (!resolvedEmployeeId.value) {
    formError.value = 'Select an employee first.'
    return
  }

  isSubmitting.value = true
  formError.value = ''
  try {
    await api.post(`/leave-applications`, {
      ...form.value,
      days_applied: daysApplied.value,
      employee_id: resolvedEmployeeId.value,
    })

    emit('updated')
    close()
  } catch (error) {
    console.log('Full Error Object:', error)

    if (error.response) {
      console.log('Server Response Data:', error.response.data)
      const errorMessage =
        error.response.data.message ||
        JSON.stringify(error.response.data.errors) ||
        'Unknown validation error'
      formError.value = 'Failed: ' + errorMessage
    } else {
      formError.value = 'Network error or server unreachable'
    }
  } finally {
    isSubmitting.value = false
  }
}

function close() {
  form.value = {
    leave_configuration_id: '',
    start_date: '',
    end_date: '',
    reason: '',
    is_paper_submission: false,
  }
  selectedEmployee.value = null
  employeeQuery.value = ''
  employeeResults.value = []
  fetchedCredits.value = []
  preview.value = null
  formError.value = ''
  emit('close')
}
</script>
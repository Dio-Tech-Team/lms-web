<template>
  <div>
    <div
      v-if="errorMessage"
      class="bg-rose-tint text-rose-700 text-sm rounded-lg px-3.5 py-2.5 mb-4 font-medium flex items-center justify-between"
    >
      {{ errorMessage }}
      <button @click="errorMessage = ''" class="text-rose-700 font-bold hover:text-rose-800 ml-3">
        ✕
      </button>
    </div>

    <div class="flex items-center justify-between mb-6">
      <h1 class="font-serif text-2xl font-semibold text-navy-deep">Leave Monetization</h1>
      <button
        @click="showModal = true"
        class="px-4 py-2 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-navy-deep transition-colors"
      >
        + File Monetization
      </button>
    </div>
    <!-- Search & Year Filter -->
    <div class="mb-5">
      <input
        v-model="search"
        type="text"
        placeholder="Search employee name..."
        class="w-full max-w-sm border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
        @input="debounceSearch"
      />
      <input
        v-model="selectedYear"
        type="number"
        class="w-32 border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
        @change="fetchMonetizations(1)"
      />
    </div>

    <!-- Filter Tabs -->
    <div class="flex gap-2 mb-5">
      <button
        v-for="tab in ['', 'pending', 'approved', 'rejected', 'cancelled']"
        :key="tab"
        @click="setFilter(tab)"
        :class="
          filterStatus === tab
            ? 'bg-navy text-white border-navy'
            : 'bg-white text-slate-600 border-sky-100 hover:bg-sky'
        "
        class="px-4 py-2 rounded-xl text-sm font-semibold border capitalize transition-colors"
      >
        {{ tab === '' ? 'All' : tab }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center gap-3 py-24">
      <div
        class="w-6 h-6 border-[3px] border-teal-600 border-t-transparent rounded-full animate-spin"
      ></div>
      <span class="text-slate-500 text-sm">Loading requests...</span>
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-2xl border border-sky-100 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-sky/60 border-b border-sky-100">
          <tr>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Employee
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Type
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Days
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Reason
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Filed
            </th>
            <th
              class="text-left px-4 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Status
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
            v-for="m in monetizations"
            :key="m.id"
            class="border-b border-sky-100 last:border-b-0 hover:bg-sky/40 transition-colors"
          >
            <td class="px-4 py-3.5 font-semibold text-navy-deep">
              {{ m.first_name }} {{ m.surname }}
            </td>
            <td class="px-4 py-3.5">
              <span
                class="bg-sky-100 text-navy px-2 py-0.5 rounded-full text-[11px] font-bold font-mono"
              >
                {{ m.leave_type_code }}
              </span>
            </td>
            <td class="px-4 py-3.5 text-slate-600">
              <template
                v-if="m.approved_days && parseFloat(m.approved_days) < parseFloat(m.days_monetized)"
              >
                <span class="line-through text-slate-400">{{ m.days_monetized }}</span>
                <span class="font-semibold text-navy-deep ml-1.5">{{ m.approved_days }}</span>
              </template>
              <template v-else>{{ m.days_monetized }}</template>
            </td>
            <td class="px-4 py-3.5 text-slate-600">{{ m.reason || 'N/A' }}</td>
            <td class="px-4 py-3.5 font-mono text-[12.5px] text-slate-500">
              {{ formatDate(m.applied_at) }}
            </td>
            <td class="px-4 py-3.5">
              <span
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold capitalize"
                :class="{
                  'bg-amber-tint text-amber-700': m.status === 'pending',
                  'bg-teal-tint text-teal-700': m.status === 'approved',
                  'bg-rose-tint text-rose-700': m.status === 'rejected',
                  'bg-slate-100 text-slate-500': m.status === 'cancelled',
                }"
              >
                <span
                  class="w-1.5 h-1.5 rounded-full"
                  :class="{
                    'bg-amber-700': m.status === 'pending',
                    'bg-teal-700': m.status === 'approved',
                    'bg-rose-700': m.status === 'rejected',
                    'bg-slate-400': m.status === 'cancelled',
                  }"
                ></span>
                {{ m.status }}
              </span>
              <p
                v-if="m.status === 'cancelled' && m.cancellation_reason"
                class="text-[11.5px] text-slate-400 mt-1 max-w-[14rem]"
              >
                {{ m.cancellation_reason }}
              </p>
              <p
                v-else-if="m.status === 'rejected' && m.rejection_reason"
                class="text-[11.5px] text-slate-400 mt-1 max-w-[14rem]"
              >
                {{ m.rejection_reason }}
              </p>
            </td>
            <td class="px-4 py-3.5">
              <div v-if="m.status === 'pending'" class="flex gap-3">
                <button
                  @click="openReview(m, 'approve')"
                  class="text-teal-700 hover:text-teal-800 font-semibold text-sm transition-colors"
                >
                  Approve
                </button>
                <button
                  @click="openReview(m, 'reject')"
                  class="text-rose-600 hover:text-rose-700 font-semibold text-sm transition-colors"
                >
                  Reject
                </button>
              </div>
              <button
                v-else-if="m.status === 'approved'"
                @click="openReverse(m)"
                class="text-rose-600 hover:text-rose-700 font-semibold text-sm transition-colors"
              >
                Reverse
              </button>
              <span v-else class="text-slate-400 text-sm">—</span>
            </td>
          </tr>
          <tr v-if="monetizations.length === 0">
            <td colspan="7" class="px-4 py-12 text-center text-slate-400 text-sm">
              No requests found
            </td>
          </tr>
        </tbody>
      </table>

      <div class="flex items-center justify-between px-5 py-4 border-t border-sky-100 bg-sky/30">
        <p class="text-[12.5px] text-slate-500">
          Page <span class="font-semibold text-navy-deep">{{ currentPage }}</span> of {{ lastPage }}
          <span class="text-slate-400">· {{ total }} total requests</span>
        </p>
        <div class="flex gap-2">
          <button
            @click="fetchMonetizations(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3.5 py-1.5 text-[12.5px] font-semibold border border-sky-100 rounded-lg bg-white hover:bg-sky text-navy transition-colors disabled:opacity-40 disabled:hover:bg-white"
          >
            ← Previous
          </button>
          <button
            @click="fetchMonetizations(currentPage + 1)"
            :disabled="currentPage === lastPage"
            class="px-3.5 py-1.5 text-[12.5px] font-semibold border border-sky-100 rounded-lg bg-white hover:bg-sky text-navy transition-colors disabled:opacity-40 disabled:hover:bg-white"
          >
            Next →
          </button>
        </div>
      </div>
    </div>

    <!-- Reverse approved monetization -->
    <div
      v-if="reverseModal.show"
      class="fixed inset-0 bg-navy-deep/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-3xl shadow-xl w-full max-w-md p-7">
        <h2 class="font-serif text-xl font-semibold text-navy-deep mb-1">Reverse monetization?</h2>
        <p class="text-[13px] text-slate-500 mb-5">
          {{ reverseModal.days }} day(s) of {{ reverseModal.type }} will be returned to
          {{ reverseModal.employeeName }}'s balance.
        </p>

        <div
          v-if="reverseModal.error"
          class="bg-rose-tint border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-4 text-sm"
        >
          {{ reverseModal.error }}
        </div>
        <label class="block text-sm font-medium text-navy-deep mb-1.5">
          Reason <span class="font-normal text-slate-400">(optional)</span>
        </label>
        <select
          v-model="reverseModal.selectedReason"
          class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
        >
          <option value="">No reason given</option>
          <option v-for="r in MONETIZATION_CANCELLATION_REASONS" :key="r" :value="r">
            {{ r }}
          </option>
          <option :value="OTHER_REASON">Other (please specify)</option>
        </select>
        <textarea
          v-if="reverseModal.selectedReason === OTHER_REASON"
          v-model="reverseModal.otherReason"
          rows="3"
          maxlength="1000"
          class="w-full mt-2 border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors resize-none"
        ></textarea>
        <div class="mb-6"></div>

        <div class="flex justify-end gap-3">
          <button
            @click="reverseModal.show = false"
            :disabled="reverseModal.saving"
            class="px-5 py-2.5 text-sm font-semibold text-navy border border-sky-100 rounded-xl hover:bg-sky transition-colors"
          >
            Cancel
          </button>
          <button
            @click="submitReverse"
            :disabled="reverseModal.saving"
            class="px-5 py-2.5 text-sm font-semibold bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors disabled:opacity-50"
          >
            {{ reverseModal.saving ? 'Reversing...' : 'Reverse' }}
          </button>
        </div>
      </div>
    </div>

    <LeaveMonetizationModal
      :show="showModal"
      @close="showModal = false"
      @updated="fetchMonetizations(currentPage)"
    />
    <ReviewMonetizationModal
      :show="reviewModal.show"
      :mode="reviewModal.mode"
      :monetization-id="reviewModal.id"
      :requested-days="reviewModal.requestedDays"
      :remaining-balance="reviewModal.remainingBalance"
      :employee-name="reviewModal.employeeName"
      @close="reviewModal.show = false"
      @updated="fetchMonetizations(currentPage)"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
import LeaveMonetizationModal from '../../views/modals/LeaveMonetizationModal.vue'
import ReviewMonetizationModal from '../../views/modals/ReviewMonetizationModal.vue'
import {
  MONETIZATION_CANCELLATION_REASONS,
  OTHER_REASON,
  buildReason,
} from '@/constants/leaveReasons'

const monetizations = ref([])
const loading = ref(true)
const filterStatus = ref('')
const showModal = ref(false)
const currentPage = ref(1)
const lastPage = ref(1)
const total = ref(0)

const search = ref('')
const selectedYear = ref(new Date().getFullYear())
const errorMessage = ref('')
let searchTimeout = null

const reviewModal = ref({
  show: false,
  mode: 'approve',
  id: null,
  requestedDays: 0,
  remainingBalance: null,
  employeeName: '',
})

const reverseModal = ref({
  show: false,
  id: null,
  days: 0,
  type: '',
  employeeName: '',
  selectedReason: '',
  otherReason: '',
  error: '',
  saving: false,
})

function openReverse(m) {
  reverseModal.value = {
    show: true,
    id: m.id,
    days: m.approved_days ?? m.days_monetized,
    type: m.leave_type_code,
    employeeName: `${m.first_name} ${m.surname}`,
    selectedReason: '',
    otherReason: '',
    error: '',
    saving: false,
  }
}

async function submitReverse() {
  reverseModal.value.saving = true
  reverseModal.value.error = ''
  try {
    await api.post(`/leave-monetizations/${reverseModal.value.id}/cancel-approved`, {
      cancellation_reason: buildReason(
        reverseModal.value.selectedReason,
        reverseModal.value.otherReason
      ),
    })
    reverseModal.value.show = false
    await fetchMonetizations(currentPage.value)
  } catch (err) {
    reverseModal.value.error = err.response?.data?.message || 'Failed to reverse monetization.'
  } finally {
    reverseModal.value.saving = false
  }
}

function openReview(m, mode) {
  reviewModal.value = {
    show: true,
    mode,
    id: m.id,
    requestedDays: parseFloat(m.days_monetized),
    remainingBalance: m.remaining_balance,
    employeeName: `${m.first_name} ${m.surname}`,
  }
}

async function fetchMonetizations(page = 1) {
  loading.value = true
  try {
    const params = new URLSearchParams({ page })
    if (filterStatus.value) params.append('status', filterStatus.value)
    if (search.value) params.append('search', search.value)
    if (selectedYear.value) params.append('year', selectedYear.value)

    const response = await api.get(`/leave-monetizations?${params}`)
    monetizations.value = response.data.data
    currentPage.value = response.data.current_page
    lastPage.value = response.data.last_page
    total.value = response.data.total
  } catch (error) {
    console.error('Error fetching monetizations:', error)
    monetizations.value = []
  } finally {
    loading.value = false
  }
}

function setFilter(status) {
  filterStatus.value = status
  fetchMonetizations(1)
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  return dateString.toString().split('T')[0]
}
function debounceSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => fetchMonetizations(1), 500)
}
onMounted(() => {
  fetchMonetizations()
})
</script>
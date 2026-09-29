<template>
  <div>
    <h1 class="font-serif text-2xl font-semibold text-navy-deep mb-2">Initialize Leave Credits</h1>
    <p class="text-sm text-slate-500 mb-6 max-w-xl">
      Creates credits for all active employees for the selected year. Unused Forced Leave from the
      previous year is deducted from Vacation Leave. Employees who already have credits are skipped.
    </p>

    <p
      v-if="message"
      class="text-sm mb-4"
      :class="message.type === 'success' ? 'text-teal-700' : 'text-rose-700'"
    >
      {{ message.text }}
    </p>

    <div class="bg-white rounded-2xl border border-sky-100 p-6 max-w-xl flex items-center gap-3">
      <select
        v-model="selectedYear"
        class="border border-sky-200 rounded-lg px-3 py-2 text-sm font-semibold"
      >
        <option v-for="year in [currentYear + 1, currentYear]" :key="year" :value="year">
          {{ year }}
        </option>
      </select>
      <button
        @click="initialize"
        :disabled="initializing"
        class="text-sm font-semibold text-white bg-navy rounded-lg px-4 py-2 hover:bg-navy-deep disabled:opacity-50"
      >
        {{ initializing ? 'Initializing…' : 'Initialize Credits' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useConfirm } from '@/composables/useConfirm'
import api from '@/api/axios'

const { confirm } = useConfirm()
const currentYear = new Date().getFullYear()
const selectedYear = ref(currentYear)
const initializing = ref(false)
const message = ref(null)

async function initialize() {
  const ok = await confirm({
    title: 'Initialize Leave Credits',
    message: `Initialize credits for all active employees for ${selectedYear.value}? Employees who already have credits are skipped.`,
  })
  if (!ok) return

  initializing.value = true
  message.value = null
  try {
    const res = await api.post('/employees/leave-credits/initialize-all', {
      year: selectedYear.value,
    })
    message.value = { type: 'success', text: res.data.message }
  } catch (e) {
    message.value = { type: 'error', text: e.response?.data?.message || 'Failed to initialize.' }
  } finally {
    initializing.value = false
  }
}
</script>
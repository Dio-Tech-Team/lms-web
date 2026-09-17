<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

const signatories = ref([])
const loading = ref(false)
const savingId = ref(null)
const message = ref('')

const labels = {
  hr_officer: 'HR Officer (Section 7.A)',
  approving_authority: 'Approving Authority (bottom of form)',
}

async function fetchSignatories() {
  loading.value = true
  try {
    const { data } = await api.get('/personnel')
    signatories.value = data
  } catch (e) {
    message.value = 'Failed to load signatories.'
  } finally {
    loading.value = false
  }
}

async function save(row) {
  savingId.value = row.id
  message.value = ''
  try {
    await api.put(`/personnel/${row.id}`, {
      name: row.name,
      position: row.position,
    })
    message.value = 'Saved.'
  } catch (e) {
    message.value = e.response?.data?.message ?? 'Save failed.'
  } finally {
    savingId.value = null
  }
}

onMounted(fetchSignatories)
</script>
<template>
  <div v-if="loading" class="flex items-center justify-center gap-3 py-24">
    <div
      class="w-6 h-6 border-[3px] border-teal-600 border-t-transparent rounded-full animate-spin"
    ></div>
    <span class="text-slate-500 text-sm">Loading...</span>
  </div>

  <div v-else class="bg-white rounded-2xl border border-sky-100 p-7">
    <div class="flex items-baseline justify-between mb-1">
      <h2 class="font-serif text-xl font-semibold text-navy-deep">Leave Form Signatories</h2>
      <span v-if="message" class="text-sm text-slate-500">{{ message }}</span>
    </div>
    <p class="text-sm text-slate-500 mb-5">
      These names print on the CS Form No. 6 generated for every leave application.
    </p>

    <div class="space-y-5">
      <div v-for="row in signatories" :key="row.id" class="border border-sky-100 rounded-xl p-4">
        <p class="text-sm font-semibold text-navy-deep mb-3">
          {{ labels[row.role] ?? row.role }}
        </p>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">Name</label>
            <input
              v-model="row.name"
              type="text"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">Position</label>
            <input
              v-model="row.position"
              type="text"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            />
          </div>
        </div>

        <div class="flex justify-end mt-4">
          <button
            :disabled="savingId === row.id || !row.name?.trim() || !row.position?.trim()"
            @click="save(row)"
            class="px-5 py-2.5 text-sm font-semibold bg-navy text-white rounded-xl hover:bg-navy-deep transition-colors disabled:opacity-50"
          >
            {{ savingId === row.id ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
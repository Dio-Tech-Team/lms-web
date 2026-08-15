<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-navy-deep/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  >
    <!-- <div class="bg-white rounded-3xl shadow-xl w-full max-w-5xl p-7 max-h-[90vh] overflow-y-auto"> -->
    <div class="bg-white rounded-3xl shadow-xl w-full max-w-7xl p-8 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-2">
        <div>
          <h2 class="font-serif text-xl font-semibold text-navy-deep">Employee's Leave Card</h2>
        </div>
        <button
          @click="$emit('close')"
          class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-sky hover:text-navy transition-colors text-lg"
        >
          ✕
        </button>
      </div>

      <div v-if="loading" class="flex items-center justify-center gap-3 py-16">
        <div
          class="w-6 h-6 border-[3px] border-teal-600 border-t-transparent rounded-full animate-spin"
        ></div>
        <span class="text-slate-500 text-sm">Loading leave card...</span>
      </div>

      <template v-else-if="cardData">
        <div class="grid grid-cols-2 gap-5">
          <!-- Vacation Leave -->
          <div>
            <h3 class="font-serif text-base font-semibold text-navy-deep mb-3">Vacation Leave</h3>
            <div class="border border-sky-100 rounded-xl overflow-hidden">
              <table class="w-full text-sm">
                <thead class="bg-sky/60 border-b border-sky-100">
                  <tr>
                    <th
                      class="text-left px-2.5 py-2.5 text-[11px] uppercase tracking-wider text-slate-400 font-bold"
                    >
                      Period
                    </th>
                    <th
                      class="text-left px-2.5 py-2.5 text-[11px] uppercase tracking-wider text-slate-400 font-bold"
                    >
                      Particulars
                    </th>
                    <th
                      class="text-right px-2 py-2.5 text-[11px] uppercase tracking-wider text-slate-400 font-bold"
                    >
                      Earned
                    </th>
                    <th
                      class="text-right px-2 py-2.5 text-[11px] uppercase tracking-wider text-slate-400 font-bold"
                      title="Absence/Undertime With Pay"
                    >
                      W/P
                    </th>
                    <th
                      class="text-right px-2 py-2.5 text-[11px] uppercase tracking-wider text-slate-400 font-bold"
                      title="Absence/Undertime Without Pay"
                    >
                      WOP
                    </th>
                    <th
                      class="text-right px-2 py-2.5 text-[11px] uppercase tracking-wider text-slate-400 font-bold"
                    >
                      Used
                    </th>
                    <th
                      class="text-right px-2.5 py-2.5 text-[11px] uppercase tracking-wider text-slate-400 font-bold"
                    >
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, i) in cardData.vacation_leave"
                    :key="'vl-' + i"
                    class="border-b border-sky-100 last:border-b-0"
                  >
                    <td class="px-2.5 py-2 font-mono text-[10.5px] text-slate-500">
                      {{ row.period }}
                    </td>
                    <td class="px-2.5 py-2 text-slate-600">{{ row.particulars }}</td>
                    <td class="px-2 py-2 text-right font-mono text-navy">
                      {{ row.earned > 0 ? row.earned.toFixed(3) : '' }}
                    </td>
                    <td class="px-2 py-2 text-right font-mono text-amber-700">
                      {{ row.abs_wp > 0 ? row.abs_wp.toFixed(3) : '' }}
                    </td>
                    <td class="px-2 py-2 text-right font-mono text-rose-600">
                      {{ row.abs_wop > 0 ? row.abs_wop.toFixed(3) : '' }}
                    </td>
                    <td class="px-2 py-2 text-right font-mono text-rose-600">
                      {{ row.used > 0 ? row.used.toFixed(3) : '' }}
                    </td>
                    <td class="px-2.5 py-2 text-right font-mono font-bold text-navy-deep">
                      {{ row.balance.toFixed(3) }}
                    </td>
                  </tr>
                  <tr v-if="!cardData.vacation_leave || cardData.vacation_leave.length === 0">
                    <td colspan="7" class="px-3 py-8 text-center text-slate-400 text-xs">
                      No VL history yet
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Sick Leave -->
          <div>
            <h3 class="font-serif text-base font-semibold text-navy-deep mb-3">Sick Leave</h3>
            <div class="border border-sky-100 rounded-xl overflow-hidden">
              <table class="w-full text-sm">
                <thead class="bg-sky/60 border-b border-sky-100">
                  <tr>
                    <th
                      class="text-left px-2.5 py-2.5 text-[11px] uppercase tracking-wider text-slate-400 font-bold"
                    >
                      Period
                    </th>
                    <th
                      class="text-left px-2.5 py-2.5 text-[11px] uppercase tracking-wider text-slate-400 font-bold"
                    >
                      Particulars
                    </th>
                    <th
                      class="text-right px-2 py-2.5 text-[11px] uppercase tracking-wider text-slate-400 font-bold"
                    >
                      Earned
                    </th>
                    <th
                      class="text-right px-2 py-2.5 text-[11px] uppercase tracking-wider text-slate-400 font-bold"
                      title="Absence/Undertime With Pay"
                    >
                      W/P
                    </th>
                    <th
                      class="text-right px-2 py-2.5 text-[11px] uppercase tracking-wider text-slate-400 font-bold"
                      title="Absence/Undertime Without Pay"
                    >
                      WOP
                    </th>
                    <th
                      class="text-right px-2 py-2.5 text-[11px] uppercase tracking-wider text-slate-400 font-bold"
                    >
                      Used
                    </th>
                    <th
                      class="text-right px-2.5 py-2.5 text-[11px] uppercase tracking-wider text-slate-400 font-bold"
                    >
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, i) in cardData.sick_leave"
                    :key="'sl-' + i"
                    class="border-b border-sky-100 last:border-b-0"
                  >
                    <td class="px-2.5 py-2 font-mono text-[10.5px] text-slate-500">
                      {{ row.period }}
                    </td>
                    <td class="px-2.5 py-2 text-slate-600">{{ row.particulars }}</td>
                    <td class="px-2 py-2 text-right font-mono text-teal-700">
                      {{ row.earned > 0 ? row.earned.toFixed(3) : '' }}
                    </td>
                    <td class="px-2 py-2 text-right font-mono text-amber-700">
                      {{ row.abs_wp > 0 ? row.abs_wp.toFixed(3) : '' }}
                    </td>
                    <td class="px-2 py-2 text-right font-mono text-rose-600">
                      {{ row.abs_wop > 0 ? row.abs_wop.toFixed(3) : '' }}
                    </td>
                    <td class="px-2 py-2 text-right font-mono text-rose-600">
                      {{ row.used > 0 ? row.used.toFixed(3) : '' }}
                    </td>
                    <td class="px-2.5 py-2 text-right font-mono font-bold text-navy-deep">
                      {{ row.balance.toFixed(3) }}
                    </td>
                  </tr>
                  <tr v-if="!cardData.sick_leave || cardData.sick_leave.length === 0">
                    <td colspan="7" class="px-3 py-8 text-center text-slate-400 text-xs">
                      No SL history yet
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </template>

      <p v-else class="text-center text-slate-400 text-sm py-16">Failed to load leave card.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import api from '@/api/axios'

const props = defineProps({
  show: { type: Boolean, default: false },
  employeeId: { type: [String, Number], required: true },
})

defineEmits(['close'])

const loading = ref(false)
const cardData = ref(null)

// Fetch the leave card data each time the modal is opened
watch(
  () => props.show,
  async (visible) => {
    if (!visible) return
    loading.value = true
    try {
      const response = await api.get(`/employees/${props.employeeId}/leave-card`)
      cardData.value = response.data
    } catch (error) {
      console.error('Failed to load leave card', error)
      cardData.value = null
    } finally {
      loading.value = false
    }
  }
)
</script>
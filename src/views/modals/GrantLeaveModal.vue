<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-navy/20 backdrop-blur-sm p-4"
  >
    <div class="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl border border-sky-100">
      <h2 class="font-serif text-lg font-semibold text-navy-deep mb-1">Grant Special Leave</h2>
      <!-- <p class="text-xs text-slate-500 mb-4">
        Manually grant a statutory leave credit (e.g. Maternity, Paternity) for a qualifying event.
        This is separate from the annual leave initialization.
      </p> -->

      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="block text-[10.5px] uppercase font-bold text-slate-400 mb-1">
            Leave Type
          </label>
          <select
            v-model="selectedConfigId"
            class="w-full border border-sky-100 rounded-lg p-2.5 text-sm"
            required
          >
            <option disabled value="">Select a leave type</option>
            <option v-for="type in eventManualTypes" :key="type.id" :value="type.id">
              {{ type.name }} ({{ type.code }})
            </option>
          </select>
        </div>

        <div>
          <label class="block text-[10.5px] uppercase font-bold text-slate-400 mb-1">
            Days Granted
          </label>
          <input
            v-model.number="days"
            type="number"
            step="0.001"
            min="0.5"
            class="w-full border border-sky-100 rounded-lg p-2.5 text-sm font-mono"
            required
          />
          <p v-if="selectedConfig?.fixed_days" class="text-[11px] text-slate-400 mt-1">
            Default for {{ selectedConfig.code }}: {{ selectedConfig.fixed_days }} days
          </p>
        </div>

        <div>
          <label class="block text-[10.5px] uppercase font-bold text-slate-400 mb-1"> Year </label>
          <input
            v-model.number="year"
            type="number"
            class="w-full border border-sky-100 rounded-lg p-2.5 text-sm font-mono"
            required
          />
        </div>

        <div>
          <label class="block text-[10.5px] uppercase font-bold text-slate-400 mb-1">
            Remarks (optional)
          </label>
          <textarea
            v-model="remarks"
            rows="2"
            class="w-full border border-sky-100 rounded-lg p-2.5 text-sm"
          ></textarea>
        </div>

        <p v-if="errorMessage" class="text-xs text-rose-600">{{ errorMessage }}</p>

        <div class="flex justify-end gap-2 mt-6">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm text-slate-500 hover:text-navy"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-navy-deep transition-colors"
          >
            Grant Leave
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import api from '@/api/axios'
import { useConfirm } from '@/composables/useConfirm'

const props = defineProps(['show', 'employeeId', 'leaveTypes'])
const emit = defineEmits(['close', 'updated'])

const { confirm } = useConfirm()

const selectedConfigId = ref('')
const days = ref(null)
const year = ref(new Date().getFullYear())
const remarks = ref('')
const errorMessage = ref('')

const eventManualTypes = computed(() =>
  (props.leaveTypes || []).filter((t) => t.grant_type === 'event_manual')
)

const selectedConfig = computed(() =>
  eventManualTypes.value.find((t) => t.id === selectedConfigId.value)
)

watch(selectedConfigId, (newId) => {
  const config = eventManualTypes.value.find((t) => t.id === newId)
  days.value = config?.fixed_days ? Number(config.fixed_days) : null
})

watch(
  () => props.show,
  (val) => {
    if (val) {
      selectedConfigId.value = ''
      days.value = null
      year.value = new Date().getFullYear()
      remarks.value = ''
      errorMessage.value = ''
    }
  }
)

async function submit() {
  errorMessage.value = ''

  const ok = await confirm({
    title: 'Grant Leave',
    message: `Grant ${days.value} day(s) of ${selectedConfig.value?.name} for ${year.value}?`,
  })
  if (!ok) return

  try {
    await api.post('/leave-credits/grant', {
      employee_id: props.employeeId,
      leave_configuration_id: selectedConfigId.value,
      year: year.value,
      days: days.value,
      remarks: remarks.value || null,
    })
    emit('updated')
    emit('close')
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Failed to grant leave.'
  }
}
</script>
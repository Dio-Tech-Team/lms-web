<script>
// Module-level caches — shared by every instance, so reopening the modal
// does not re-hit psgc.cloud (it is rate limited).
const provinceCache = { data: null }
const localityCache = new Map()
const barangayCache = new Map()

// Note: psgc.cloud documents /api/v1/ routes that are not actually deployed —
// they return a 404 HTML page. Everything lives under /api/ with full-length
// PSGC codes (Isabela is 0203100000, used verbatim).
const PSGC = 'https://psgc.cloud/api'

async function getJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`PSGC responded ${res.status}`)
  const json = await res.json()
  return Array.isArray(json) ? json : json.data ?? []
}

function byName(a, b) {
  return a.name.localeCompare(b.name)
}
</script>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import SearchSelect from './SearchSelect.vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: 'Address' },
  withBarangay: { type: Boolean, default: false },
  withStreet: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const provinces = ref([])
const localities = ref([])
const barangays = ref([])

const province = ref(null)
const locality = ref(null)
const barangay = ref(null)
const street = ref('')

const loadingProvinces = ref(false)
const loadingLocalities = ref(false)
const loadingBarangays = ref(false)

const apiFailed = ref(false)
const lookupError = ref('')
const manual = ref(false)
const manualText = ref('')

// An already-saved address is a plain string with no PSGC codes, so it cannot
// be mapped back onto the dropdowns. Show it as-is until the user opts to change.
const locked = ref(false)

const composed = computed(() => {
  const parts = []
  if (props.withStreet && street.value.trim()) parts.push(street.value.trim())
  if (props.withBarangay && barangay.value) parts.push(`Brgy. ${barangay.value.name}`)
  if (locality.value) parts.push(locality.value.name)
  if (province.value) parts.push(province.value.name)
  return parts.join(', ')
})

onMounted(() => {
  if (props.modelValue && props.modelValue.trim()) locked.value = true
  loadProvinces()
})

async function loadProvinces() {
  if (provinceCache.data) {
    provinces.value = provinceCache.data
    return
  }
  loadingProvinces.value = true
  try {
    const list = await getJson(`${PSGC}/provinces`)
    provinceCache.data = list.map((p) => ({ code: p.code, name: p.name })).sort(byName)
    provinces.value = provinceCache.data
  } catch (e) {
    console.warn('[AddressPicker] province lookup failed:', e)
    apiFailed.value = true
    manual.value = true
    manualText.value = props.modelValue ?? ''
  } finally {
    loadingProvinces.value = false
  }
}

watch(province, async (value) => {
  locality.value = null
  barangay.value = null
  localities.value = []
  barangays.value = []
  lookupError.value = ''
  if (!value) return

  if (localityCache.has(value.code)) {
    localities.value = localityCache.get(value.code)
    return
  }
  loadingLocalities.value = true
  try {
    const list = await getJson(`${PSGC}/provinces/${value.code}/cities-municipalities`)
    const mapped = list.map((l) => ({ code: l.code, name: l.name })).sort(byName)
    localityCache.set(value.code, mapped)
    localities.value = mapped
  } catch (e) {
    console.warn('[AddressPicker] locality lookup failed for', value.code, e)
    lookupError.value = 'Could not load cities and municipalities.'
  } finally {
    loadingLocalities.value = false
  }
})

watch(locality, async (value) => {
  barangay.value = null
  barangays.value = []
  if (!value || !props.withBarangay) return

  if (barangayCache.has(value.code)) {
    barangays.value = barangayCache.get(value.code)
    return
  }
  loadingBarangays.value = true
  try {
    const list = await getJson(`${PSGC}/cities-municipalities/${value.code}/barangays`)
    const mapped = list.map((b) => ({ code: b.code, name: b.name })).sort(byName)
    barangayCache.set(value.code, mapped)
    barangays.value = mapped
  } catch (e) {
    console.warn('[AddressPicker] barangay lookup failed for', value.code, e)
    lookupError.value = 'Could not load barangays.'
  } finally {
    loadingBarangays.value = false
  }
})

// Emit only a non-empty value, so clicking "Change" by accident cannot wipe
// an existing address before a replacement is picked.
watch(composed, (value) => {
  if (manual.value) return
  if (value) emit('update:modelValue', value)
})

watch(manualText, (value) => {
  if (manual.value) emit('update:modelValue', value)
})

function toggleManual() {
  manual.value = !manual.value
  locked.value = false
  if (manual.value) manualText.value = props.modelValue ?? ''
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-1.5">
      <label class="block text-sm font-medium text-navy-deep">{{ label }}</label>
      <button
        type="button"
        class="text-[11px] text-slate-400 hover:text-teal-600 transition-colors"
        @click="toggleManual"
      >
        {{ manual ? 'Use dropdowns' : 'Enter manually' }}
      </button>
    </div>

    <!-- Already-saved value -->
    <div
      v-if="locked"
      class="flex items-start justify-between gap-3 border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5"
    >
      <span class="text-sm text-navy-deep">{{ modelValue }}</span>
      <button
        type="button"
        class="shrink-0 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
        @click="locked = false"
      >
        Change
      </button>
    </div>

    <!-- Manual entry -->
    <div v-else-if="manual">
      <input
        v-model="manualText"
        type="text"
        placeholder="Type the full address"
        class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
      />
      <p v-if="apiFailed" class="mt-1 text-[11px] text-amber-600">
        Address service unavailable — entering manually.
      </p>
    </div>

    <!-- Picker -->
    <div v-else>
      <div class="grid grid-cols-2 gap-4">
        <SearchSelect
          v-model="province"
          :options="provinces"
          :loading="loadingProvinces"
          placeholder="Select Province"
          search-placeholder="Search province..."
        />
        <SearchSelect
          v-model="locality"
          :options="localities"
          :loading="loadingLocalities"
          :disabled="!province"
          placeholder="Select City / Municipality"
          search-placeholder="Search city or municipality..."
        />
        <SearchSelect
          v-if="withBarangay"
          v-model="barangay"
          :options="barangays"
          :loading="loadingBarangays"
          :disabled="!locality"
          placeholder="Select Barangay"
          search-placeholder="Search barangay..."
        />
        <!-- <input
          v-if="withStreet"
          v-model="street"
          type="text"
          placeholder="House No. / Street / Subdivision"
          class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
        /> -->
      </div>

      <p v-if="lookupError" class="mt-1.5 text-[11px] text-amber-600">{{ lookupError }}</p>
      <!-- <p v-else-if="composed" class="mt-1.5 text-[11px] text-slate-500">
        Saves as: <span class="font-medium text-navy-deep">{{ composed }}</span>
      </p> -->
    </div>
  </div>
</template>
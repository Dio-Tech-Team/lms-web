<template>
  <div class="relative" ref="root">
    <button
      type="button"
      :disabled="disabled || loading"
      @click="toggle"
      class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm text-left focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors flex justify-between items-center disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span :class="modelValue ? 'text-navy-deep' : 'text-slate-400'">
        {{ loading ? 'Loading...' : modelValue?.name || placeholder }}
      </span>
      <span class="text-slate-400 text-xs transition-transform" :class="{ 'rotate-180': isOpen }"
        >▾</span
      >
    </button>

    <div
      v-if="isOpen"
      class="absolute z-20 mt-1 w-full bg-white border border-sky-100 rounded-xl shadow-lg overflow-hidden"
    >
      <div class="p-2 border-b border-sky-100">
        <input
          v-model="search"
          ref="searchInput"
          type="text"
          :placeholder="searchPlaceholder"
          class="w-full border border-sky-100 bg-sky/40 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
          @click.stop
        />
      </div>
      <ul class="max-h-48 overflow-y-auto py-1">
        <li
          v-for="option in filtered"
          :key="option.code"
          @click="select(option)"
          class="px-3.5 py-2 text-sm cursor-pointer hover:bg-sky transition-colors"
          :class="{ 'bg-sky/60 font-medium text-navy-deep': modelValue?.code === option.code }"
        >
          {{ option.name }}
        </li>
        <li v-if="filtered.length === 0" class="px-3.5 py-2 text-sm text-slate-400 italic">
          No matching result
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: { type: Object, default: null },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Select' },
  searchPlaceholder: { type: String, default: 'Search...' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const root = ref(null)
const isOpen = ref(false)
const search = ref('')
const searchInput = ref(null)

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return props.options
  return props.options.filter((o) => o.name.toLowerCase().includes(q))
})

function toggle() {
  if (props.disabled || props.loading) return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    search.value = ''
    nextTick(() => searchInput.value?.focus())
  }
}

function select(option) {
  emit('update:modelValue', option)
  isOpen.value = false
}

function handleClickOutside(e) {
  if (isOpen.value && root.value && !root.value.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

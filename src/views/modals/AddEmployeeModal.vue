<template>
  <div>
    <!-- Add Employee Modal -->
    <div
      v-if="show"
      class="fixed inset-0 bg-navy-deep/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-3xl shadow-xl w-full max-w-2xl p-7 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="font-serif text-xl font-semibold text-navy-deep">Add New Employee</h2>
          <button
            @click="closeAddModal"
            class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-sky hover:text-navy transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        <div
          v-if="formError"
          class="bg-rose-tint border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-5 text-sm"
        >
          {{ formError }}
        </div>

        <form @submit.prevent="handleAddEmployee">
          <h3 class="text-[11px] font-bold text-teal-600 mb-3 uppercase tracking-wider">
            Personal Information
          </h3>
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5"
                >First Name <span class="text-rose-500">*</span></label
              >
              <input
                v-model="form.first_name"
                type="text"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5"
                >Middle Name<span class="text-rose-500">*</span></label
              >
              <input
                v-model="form.middle_name"
                type="text"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5"
                >Surname<span class="text-rose-500">*</span></label
              >
              <input
                v-model="form.surname"
                type="text"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5"
                >ID Number<span class="text-rose-500">*</span></label
              >
              <input
                v-model="form.id_number"
                type="text"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5"
                >Birthdate <span class="text-rose-500">*</span></label
              >
              <input
                v-model="form.birthdate"
                type="date"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              />
            </div>
            <!-- <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">Place of Birth</label>
              <input
                v-model="form.place_of_birth"
                type="text"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              />
            </div> -->
            <div class="col-span-2">
              <AddressPicker v-model="form.place_of_birth" label="Place of Birth" />
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5"
                >Sex <span class="text-rose-500">*</span></label
              >
              <select
                v-model="form.sex"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                required
              >
                <option value="">Select Sex</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">Civil Status</label>
              <select
                v-model="form.civil_status"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                required
              >
                <option value="">Select Civil Status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="widowed">Widowed</option>
                <option value="separated">Separated</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">Height</label>
              <input
                v-model="form.height"
                type="text"
                placeholder="cm"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">Weight</label>
              <input
                v-model="form.weight"
                type="text"
                placeholder="kg"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">Blood Type</label>
              <input
                v-model="form.bloodtype"
                type="text"
                placeholder="e.g. O+"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5"
                >Highest Educational Attainment</label
              >
              <select
                v-model="form.highest_educational_attainment"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                required
              >
                <option value="">Select</option>
                <option value="elementary">Elementary</option>
                <option value="secondary">Secondary</option>
                <option value="vocational">Vocational</option>
                <option value="college">College</option>
                <option value="graduate">Graduate</option>
              </select>
            </div>
          </div>

          <h3 class="text-[11px] font-bold text-teal-600 mb-3 uppercase tracking-wider">
            Employment Information
          </h3>
          <div class="grid grid-cols-2 gap-4 mb-7">
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5"
                >Position<span class="text-rose-500">*</span></label
              >
              <div class="relative position-dropdown">
                <button
                  type="button"
                  @click="togglePositionDropdown"
                  class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm text-left focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors flex justify-between items-center"
                >
                  <span :class="form.position ? 'text-navy-deep' : 'text-slate-400'">
                    {{ form.position || 'Select Position' }}
                  </span>
                  <span
                    class="text-slate-400 text-xs transition-transform"
                    :class="{ 'rotate-180': isPositionOpen }"
                    >▾</span
                  >
                </button>

                <div
                  v-if="isPositionOpen"
                  class="absolute z-10 mt-1 w-full bg-white border border-sky-100 rounded-xl shadow-lg overflow-hidden"
                >
                  <div class="p-2 border-b border-sky-100">
                    <input
                      v-model="positionSearch"
                      ref="positionSearchInput"
                      type="text"
                      placeholder="Search position..."
                      class="w-full border border-sky-100 bg-sky/40 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                      @click.stop
                    />
                  </div>
                  <ul class="max-h-48 overflow-y-auto py-1">
                    <li
                      v-for="pos in filteredPositions"
                      :key="pos.id"
                      @click="selectPosition(pos.title)"
                      class="px-3.5 py-2 text-sm cursor-pointer hover:bg-sky transition-colors"
                      :class="{
                        'bg-sky/60 font-medium text-navy-deep': form.position === pos.title,
                      }"
                    >
                      {{ pos.title }}
                    </li>
                    <li
                      v-if="filteredPositions.length === 0"
                      class="px-3.5 py-2 text-sm text-slate-400 italic"
                    >
                      No matching position
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">Department</label>
              <div class="relative department-dropdown">
                <button
                  type="button"
                  @click="toggleDepartmentDropdown"
                  class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm text-left focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors flex justify-between items-center"
                >
                  <span :class="selectedDepartmentName ? 'text-navy-deep' : 'text-slate-400'">
                    {{ selectedDepartmentName || 'Select Department' }}
                  </span>
                  <span
                    class="text-slate-400 text-xs transition-transform"
                    :class="{ 'rotate-180': isDepartmentOpen }"
                    >▾</span
                  >
                </button>

                <div
                  v-if="isDepartmentOpen"
                  class="absolute z-10 mt-1 w-full bg-white border border-sky-100 rounded-xl shadow-lg overflow-hidden"
                >
                  <div class="p-2 border-b border-sky-100">
                    <input
                      v-model="departmentSearch"
                      ref="departmentSearchInput"
                      type="text"
                      placeholder="Search department..."
                      class="w-full border border-sky-100 bg-sky/40 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                      @click.stop
                    />
                  </div>
                  <ul class="max-h-48 overflow-y-auto py-1">
                    <li
                      v-for="dept in filteredDepartments"
                      :key="dept.id"
                      @click="selectDepartment(dept)"
                      class="px-3.5 py-2 text-sm cursor-pointer hover:bg-sky transition-colors"
                      :class="{
                        'bg-sky/60 font-medium text-navy-deep': form.department_id === dept.id,
                      }"
                    >
                      {{ dept.name }}
                    </li>
                    <li
                      v-if="filteredDepartments.length === 0"
                      class="px-3.5 py-2 text-sm text-slate-400 italic"
                    >
                      No matching department
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5"
                >Employment Status<span class="text-rose-500">*</span></label
              >
              <select
                v-model="form.employment_status"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                required
              >
                <option value="">Select Status</option>
                <option value="permanent">Permanent</option>
                <option value="casual">Casual</option>
                <option value="elected">Elected</option>
                <option value="job_order">Job Order</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5"
                >Date Hired<span class="text-rose-500">*</span></label
              >
              <input
                v-model="form.date_hired"
                type="date"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                required
              />
            </div>
          </div>

          <h3 class="text-[11px] font-bold text-teal-600 mb-3 uppercase tracking-wider">
            Contact & Address
          </h3>
          <div class="grid grid-cols-2 gap-4 mb-6">
            <!-- <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5"
                >Residential Address</label
              >
              <input
                v-model="form.residential_address"
                type="text"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              />
            </div> -->
            <div class="col-span-2">
              <AddressPicker
                v-model="form.residential_address"
                label="Residential Address"
                :with-barangay="true"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">Contact Number</label>
              <input
                v-model="form.contact_number"
                type="text"
                maxlength="11"
                @input="form.contact_number = form.contact_number.replace(/\D/g, '')"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <h3 class="text-[11px] font-bold text-teal-600 mb-3 uppercase tracking-wider">
            Government IDs
          </h3>
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">UMID</label>
              <input
                v-model="form.umid_id"
                type="text"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">Pag-IBIG ID</label>
              <input
                v-model="form.pagibig_id"
                type="text"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5"
                >PhilHealth Number</label
              >
              <input
                v-model="form.philhealth_number"
                type="text"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">PSN Number</label>
              <input
                v-model="form.psn_number"
                type="text"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">TIN Number</label>
              <input
                v-model="form.tin_number"
                type="text"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <h3 class="text-[11px] font-bold text-teal-600 mb-3 uppercase tracking-wider">
            Account Information
          </h3>
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">Username</label>
              <input
                v-model="form.username"
                type="text"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">Email</label>
              <input
                v-model="form.email"
                type="email"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="closeAddModal"
              class="px-5 py-2.5 text-sm font-semibold text-navy border border-sky-100 rounded-xl hover:bg-sky transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="formLoading"
              class="px-5 py-2.5 text-sm font-semibold bg-navy text-white rounded-xl hover:bg-navy-deep transition-colors disabled:opacity-50"
            >
              {{ formLoading ? 'Saving...' : 'Save Employee' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Credentials Confirmation Modal -->
    <div
      v-if="createdCredentials"
      class="fixed inset-0 bg-navy-deep/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-3xl shadow-xl w-full max-w-md p-7">
        <h2 class="font-serif text-xl font-semibold text-navy-deep mb-1">Employee Registered</h2>
        <p class="text-[13px] text-slate-500 mb-5">
          Share these credentials with the employee. They'll be required to change the password on
          first login.
        </p>

        <div class="bg-sky/50 rounded-xl p-4 space-y-2.5 mb-6 font-mono text-[13px]">
          <div class="flex justify-between">
            <span class="text-slate-400">Username</span>
            <span class="text-navy-deep font-semibold">{{ createdCredentials.username }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Email</span>
            <span class="text-navy-deep font-semibold">{{
              createdCredentials.email || 'Not provided'
            }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Default Password</span>
            <span class="text-navy-deep font-semibold">{{
              createdCredentials.default_password
            }}</span>
          </div>
        </div>

        <button
          @click="createdCredentials = null"
          class="w-full bg-navy text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-navy-deep transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useConfirm } from '@/composables/useConfirm'
import api from '@/api/axios'
import AddressPicker from '@/components/AddressPicker.vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  departments: { type: Array, default: () => [] },
  positions: { type: Array, default: () => [] },
})

const emit = defineEmits(['close', 'created'])

const { confirm } = useConfirm()

const formError = ref(null)
const formLoading = ref(false)
const createdCredentials = ref(null)

const isPositionOpen = ref(false)
const positionSearch = ref('')
const positionSearchInput = ref(null)

const isDepartmentOpen = ref(false)
const departmentSearch = ref('')
const departmentSearchInput = ref(null)

const emptyForm = () => ({
  username: '',
  email: '',
  first_name: '',
  middle_name: '',
  surname: '',
  birthdate: '',
  place_of_birth: '',
  sex: '',
  civil_status: '',
  height: '',
  weight: '',
  bloodtype: '',
  highest_educational_attainment: '',
  residential_address: '',
  contact_number: '',
  id_number: '',
  position: '',
  department_id: '',
  employment_status: '',
  date_hired: '',
  umid_id: '',
  pagibig_id: '',
  philhealth_number: '',
  psn_number: '',
  tin_number: '',
})

const form = ref(emptyForm())

function hasUnsavedData() {
  return Object.values(form.value).some((v) => v !== '' && v !== null)
}

const selectedDepartmentName = computed(() => {
  const match = props.departments.find((d) => d.id === form.value.department_id)
  return match ? match.name : ''
})

const filteredDepartments = computed(() => {
  if (!departmentSearch.value.trim()) return props.departments
  const q = departmentSearch.value.toLowerCase()
  return props.departments.filter((d) => d.name.toLowerCase().includes(q))
})

const filteredPositions = computed(() => {
  if (!positionSearch.value.trim()) return props.positions
  const q = positionSearch.value.toLowerCase()
  return props.positions.filter((p) => p.title.toLowerCase().includes(q))
})

function selectPosition(title) {
  form.value.position = title
  isPositionOpen.value = false
}

function togglePositionDropdown() {
  isPositionOpen.value = !isPositionOpen.value
  if (isPositionOpen.value) {
    positionSearch.value = ''
    nextTick(() => positionSearchInput.value?.focus())
  }
}

function selectDepartment(dept) {
  form.value.department_id = dept.id
  isDepartmentOpen.value = false
}

function toggleDepartmentDropdown() {
  isDepartmentOpen.value = !isDepartmentOpen.value
  if (isDepartmentOpen.value) {
    departmentSearch.value = ''
    nextTick(() => departmentSearchInput.value?.focus())
  }
}

function handleClickOutside(e) {
  if (isPositionOpen.value && !e.target.closest('.position-dropdown')) {
    isPositionOpen.value = false
  }
  if (isDepartmentOpen.value && !e.target.closest('.department-dropdown')) {
    isDepartmentOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))

async function handleAddEmployee() {
  formLoading.value = true
  formError.value = ''
  try {
    const response = await api.post('employees', form.value)
    createdCredentials.value = {
      username: response.data.user.username,
      email: response.data.user.email,
      default_password: response.data.default_password,
    }
    form.value = emptyForm()
    emit('created')
    emit('close')
  } catch (error) {
    formError.value =
      error.response?.data?.message || 'Failed to register employee. Please try again.'
  } finally {
    formLoading.value = false
  }
}

async function closeAddModal() {
  if (hasUnsavedData()) {
    const ok = await confirm({
      title: 'Discard changes?',
      message: 'You have unsaved employee information. Close this form anyway?',
    })
    if (!ok) return
  }
  form.value = emptyForm()
  emit('close')
}

// Reset form state whenever the modal is reopened
watch(
  () => props.show,
  (visible) => {
    if (visible) {
      form.value = emptyForm()
      formError.value = ''
    }
  }
)
</script>
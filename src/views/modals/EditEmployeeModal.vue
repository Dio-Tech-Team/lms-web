<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-navy-deep/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  >
    <div class="bg-white rounded-3xl shadow-xl w-full max-w-2xl p-7 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h2 class="font-serif text-xl font-semibold text-navy-deep">Edit Employee Profile</h2>
        <button
          @click="$emit('close')"
          class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-sky hover:text-navy transition-colors text-lg"
        >
          ✕
        </button>
      </div>

      <div
        v-if="editError"
        class="bg-rose-tint border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-5 text-sm"
      >
        {{ editError }}
      </div>

      <form @submit.prevent="handleSubmit">
        <h3 class="text-[11px] font-bold text-teal-600 mb-3 uppercase tracking-wider">
          Personal Information
        </h3>
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">ID Number</label>
            <input
              v-model="form.id_number"
              type="text"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">First Name</label>
            <input
              v-model="form.first_name"
              type="text"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">Middle Name</label>
            <input
              v-model="form.middle_name"
              type="text"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">Surname</label>
            <input
              v-model="form.surname"
              type="text"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">Sex</label>
            <select
              v-model="form.sex"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">Civil Status</label>
            <select
              v-model="form.civil_status"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            >
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="widowed">Widowed</option>
              <option value="separated">Separated</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">Birthdate</label>
            <input
              v-model="form.birthdate"
              type="date"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            />
          </div>

          <!-- <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">Email</label>
            <input
              v-model="form.email"
              type="email"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              placeholder="employee@example.com"
            />
          </div> -->
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">Contact Number</label>
            <input
              v-model="form.contact_number"
              type="text"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">Height (cm)</label>
            <input
              v-model="form.height"
              type="text"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">Weight (kg)</label>
            <input
              v-model="form.weight"
              type="text"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">Blood Type</label>
            <input
              v-model="form.bloodtype"
              type="text"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">Education</label>
            <input
              v-model="form.highest_educational_attainment"
              type="text"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">Place of Birth</label>
            <input
              v-model="form.place_of_birth"
              type="text"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5"
              >Residential Address</label
            >
            <input
              v-model="form.residential_address"
              type="text"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            />
          </div>
        </div>

        <h3
          class="text-[11px] font-bold text-teal-600 mb-3 uppercase tracking-wider border-t border-sky-100 pt-5"
        >
          Government Identifications
        </h3>
        <div class="grid grid-cols-5 gap-2.5 mb-6">
          <div>
            <label class="block text-xs font-medium text-navy-deep mb-1.5">TIN</label>
            <input
              v-model="form.tin_number"
              type="text"
              class="w-full border border-sky-100 bg-sky/40 rounded-lg px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-navy-deep mb-1.5">UMID</label>
            <input
              v-model="form.umid_id"
              type="text"
              class="w-full border border-sky-100 bg-sky/40 rounded-lg px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-navy-deep mb-1.5">Pag-IBIG</label>
            <input
              v-model="form.pagibig_id"
              type="text"
              class="w-full border border-sky-100 bg-sky/40 rounded-lg px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-navy-deep mb-1.5">PhilHealth</label>
            <input
              v-model="form.philhealth_number"
              type="text"
              class="w-full border border-sky-100 bg-sky/40 rounded-lg px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-navy-deep mb-1.5">PSN</label>
            <input
              v-model="form.psn_number"
              type="text"
              class="w-full border border-sky-100 bg-sky/40 rounded-lg px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            />
          </div>
        </div>

        <h3
          class="text-[11px] font-bold text-teal-600 mb-3 uppercase tracking-wider border-t border-sky-100 pt-5"
        >
          Employment Information
        </h3>
        <div class="grid grid-cols-2 gap-4 mb-7">
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">Department</label>
            <select
              v-model="form.department_id"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            >
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">Position</label>
            <select
              v-model="form.position"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            >
              <option v-for="pos in positions" :key="pos.id" :value="pos.title">
                {{ pos.title }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-navy-deep mb-1.5">Date Hired</label>
            <input
              v-model="form.date_hired"
              type="date"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
            />
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <button
            type="button"
            @click="$emit('close')"
            class="px-5 py-2.5 text-sm font-semibold text-navy border border-sky-100 rounded-xl hover:bg-sky transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="editLoading"
            class="px-5 py-2.5 text-sm font-semibold bg-navy text-white rounded-xl hover:bg-navy-deep transition-colors disabled:opacity-50"
          >
            {{ editLoading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import api from '@/api/axios'

const props = defineProps({
  show: { type: Boolean, default: false },
  employeeId: { type: [String, Number], required: true },
  employee: { type: Object, default: null },
  departments: { type: Array, default: () => [] },
  positions: { type: Array, default: () => [] },
})

const emit = defineEmits(['close', 'updated'])

const editLoading = ref(false)
const editError = ref('')

const form = ref({
  id_number: '',
  first_name: '',
  middle_name: '',
  surname: '',
  // email: '',
  sex: '',
  civil_status: '',
  birthdate: '',
  place_of_birth: '',
  height: '',
  weight: '',
  bloodtype: '',
  highest_educational_attainment: '',
  residential_address: '',
  contact_number: '',
  umid_id: '',
  pagibig_id: '',
  philhealth_number: '',
  psn_number: '',
  tin_number: '',
  position: '',
  department_id: '',
  date_hired: '',
})

watch(
  () => props.show,
  (visible) => {
    if (visible && props.employee) {
      form.value = {
        id_number: props.employee.id_number,
        first_name: props.employee.first_name,
        middle_name: props.employee.middle_name,
        surname: props.employee.surname,
        // email: props.employee.email,
        sex: props.employee.sex,
        civil_status: props.employee.civil_status,
        birthdate: props.employee.birthdate,
        place_of_birth: props.employee.place_of_birth,
        height: props.employee.height,
        weight: props.employee.weight,
        bloodtype: props.employee.bloodtype,
        highest_educational_attainment: props.employee.highest_educational_attainment,
        residential_address: props.employee.residential_address,
        contact_number: props.employee.contact_number,
        umid_id: props.employee.umid_id,
        pagibig_id: props.employee.pagibig_id,
        philhealth_number: props.employee.philhealth_number,
        psn_number: props.employee.psn_number,
        tin_number: props.employee.tin_number,
        position: props.employee.position, // add
        department_id: props.employee.department_id,
        date_hired: props.employee.date_hired,
      }
      editError.value = ''
    }
  }
)

async function handleSubmit() {
  editLoading.value = true
  editError.value = ''
  try {
    // const payload = {
    //   ...form.value,
    //   email: form.value.email || null, // empty string → null, so backend's nullable check works correctly
    // }
    await api.put(`/employees/${props.employeeId}`, form.value)
    emit('updated')
    emit('close')
  } catch (err) {
    editError.value = err.response?.data?.message || 'Failed to update employee metrics'
  } finally {
    editLoading.value = false
  }
}
</script>
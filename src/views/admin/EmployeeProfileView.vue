<template>
  <div>
    <!-- Back Button -->
    <button
      @click="goBack"
      class="flex items-center gap-1 text-gray-500 text-sm mb-4 hover:text-gray-700"
    >
      ← Back to Employees
    </button>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <span class="text-gray-500 text-sm">Loading employee record...</span>
      <div
        class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"
      ></div>
    </div>

    <!-- Profile Content -->
    <div v-else-if="employee">
      <!-- Profile Header -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">
              {{ employee.first_name }} {{ employee.middle_name }} {{ employee.surname }}
            </h1>
            <p class="text-gray-500 text-sm mt-1">{{ employee.position }}</p>

            <!-- <div class="flex gap-2 mt-2">
              <span
                :class="
                  employee.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                "
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ employee.is_active ? 'Active' : 'Inactive' }}
              </span>
              <span
                class="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize"
              >
                {{ employee.employment_status }}
              </span>
            </div> -->
          </div>
          <div class="flex gap-2">
            <button
              @click="showEditModal = true"
              class="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700"
            >
              Edit
            </button>
            <button
              v-if="employee.is_active"
              @click="handleDeactivate"
              class="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700"
            >
              Deactivate
            </button>
          </div>
        </div>
      </div>

      <!-- Personal & Employment Info -->
      <div class="grid grid-cols-2 gap-6 mb-6">
        <!-- Personal Information -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Personal Information</h2>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p class="text-xs text-gray-500">ID Number</p>
              <p class="font-medium">{{ employee.id_number || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Email</p>
              <p class="font-medium">{{ employee.email || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Contact Number</p>
              <p class="font-medium">{{ employee.contact_number || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Sex / Civil Status</p>
              <p class="font-medium capitalize">
                {{ employee.sex || 'N/A' }} / {{ employee.civil_status || 'N/A' }}
              </p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Birthdate</p>
              <p class="font-medium">{{ employee.birthdate || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Place of Birth</p>
              <p class="font-medium">{{ employee.place_of_birth || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Height / Weight</p>
              <p class="font-medium">
                {{ employee.height ? employee.height + 'cm' : 'N/A' }} /
                {{ employee.weight ? employee.weight + 'kg' : 'N/A' }}
              </p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Blood Type</p>
              <p class="font-medium">{{ employee.bloodtype || 'N/A' }}</p>
            </div>
            <div class="col-span-2">
              <p class="text-xs text-gray-500">Educational Attainment</p>
              <p class="font-medium capitalize">
                {{ employee.highest_educational_attainment || 'N/A' }}
              </p>
            </div>
            <div class="col-span-2">
              <p class="text-xs text-gray-500">Residential Address</p>
              <p class="font-medium">{{ employee.residential_address || 'N/A' }}</p>
            </div>
          </div>
        </div>

        <!-- Right column: Employment + Government IDs stacked -->
        <div class="flex flex-col gap-6">
          <!-- Employment Information -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Employment Information</h2>
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p class="text-xs text-gray-500">Department</p>
                <p class="font-medium">
                  {{ employee.department?.name || employee.department || 'N/A' }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Employment Status</p>
                <p class="font-medium capitalize">{{ employee.employment_status }}</p>
              </div>
              <div class="col-span-2">
                <p class="text-xs text-gray-500">Date Hired</p>
                <p class="font-medium">{{ employee.date_hired || 'N/A' }}</p>
              </div>
            </div>
          </div>

          <!-- Statutory Identifications -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Statutory Identifications</h2>
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p class="text-xs text-gray-500">TIN</p>
                <p class="font-medium">{{ employee.tin_number || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">UMID</p>
                <p class="font-medium">{{ employee.umid_id || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Pag-IBIG</p>
                <p class="font-medium">{{ employee.pagibig_id || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">PhilHealth</p>
                <p class="font-medium">{{ employee.philhealth_number || 'N/A' }}</p>
              </div>
              <div class="col-span-2">
                <p class="text-xs text-gray-500">PSN</p>
                <p class="font-medium">{{ employee.psn_number || 'N/A' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Career Milestones -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Career Progression</h2>
        <div class="grid grid-cols-3 gap-4">
          <!-- Step Increment -->
          <!-- <div class="border rounded-lg p-4">
            <p class="text-xs text-gray-500 mb-1">Step Increment</p>
            <p
              v-if="employee.step_increment?.current_step"
              class="text-2xl font-bold text-gray-800"
            >
              Step {{ employee.step_increment.current_step }}
            </p>
            <p v-else class="text-sm text-gray-400 italic">
              {{ employee.step_increment?.message || 'N/A' }}
            </p>
            <p v-if="employee.step_increment?.next_step_date" class="text-xs text-gray-500 mt-2">
              Next step: {{ employee.step_increment.next_step_date }}
            </p>


            <div
              v-if="employee.step_increment?.history?.length > 0"
              class="mt-3 pt-3 border-t text-xs text-gray-500 space-y-1"
            >
              <div v-for="h in employee.step_increment.history" :key="h.step">
                Step {{ h.step }} — {{ h.date_reached }}
              </div>
            </div> 
          </div> -->
          <!-- Step Increment -->
          <!-- <div class="border rounded-lg p-4">
            <p class="text-xs text-gray-500 mb-1">Step Increment</p>
            <p
              v-if="employee.step_increment?.current_step"
              class="text-2xl font-bold text-gray-800"
            >
              Step {{ employee.step_increment.current_step }}
            </p>
            <p v-else class="text-sm text-gray-400 italic">
              {{ employee.step_increment?.message || 'N/A' }}
            </p>
            
            <div
              v-if="employee.step_increment?.all_steps?.length > 0"
              class="mt-3 pt-3 border-t space-y-1"
            >
              <div
                v-for="s in employee.step_increment.all_steps"
                :key="s.step"
                class="flex justify-between text-xs"
                :class="{
                  'text-gray-400': s.status === 'reached',
                  'text-gray-900 font-semibold': s.status === 'current',
                  'text-gray-300': s.status === 'upcoming',
                }"
              >
                <span>Step {{ s.step }}</span>
                <span>{{ s.date }}</span>
              </div>
            </div>
          </div> -->
          <!-- Step Increment -->
          <div class="border rounded-lg p-4">
            <p class="text-xs text-gray-500 mb-1">Step Increment</p>
            <p
              v-if="employee.step_increment?.current_step"
              class="text-2xl font-bold text-gray-800"
            >
              Step {{ employee.step_increment.current_step }}
            </p>
            <p v-else class="text-sm text-gray-400 italic">
              {{ employee.step_increment?.message || 'N/A' }}
            </p>
            <p v-if="employee.step_increment?.next_step_date" class="text-xs text-gray-500 mt-2">
              Next step: {{ employee.step_increment.next_step_date }}
            </p>

            <!-- Toggle Button -->
            <button
              v-if="employee.step_increment?.all_steps?.length > 0"
              @click="showAllSteps = !showAllSteps"
              class="text-xs text-blue-600 hover:text-blue-700 mt-2"
            >
              {{ showAllSteps ? 'Hide all steps' : 'View all steps' }}
            </button>

            <!-- All 8 Steps (toggleable) -->
            <div
              v-if="showAllSteps && employee.step_increment?.all_steps?.length > 0"
              class="mt-3 pt-3 border-t space-y-1"
            >
              <div
                v-for="s in employee.step_increment.all_steps"
                :key="s.step"
                class="flex justify-between text-xs"
                :class="{
                  'text-gray-700  ': s.status === 'reached',
                  'text-gray-1000 font-semibold': s.status === 'current',
                  'text-gray-700': s.status === 'upcoming',
                }"
              >
                <span>Step {{ s.step }}</span>
                <span>{{ s.date }}</span>
              </div>
            </div>
          </div>

          <!-- Loyalty Pay -->
          <div class="border rounded-lg p-4">
            <p class="text-xs text-gray-500 mb-1">Loyalty Pay</p>
            <p class="text-2xl font-bold text-gray-800">
              {{ employee.loyalty_pay?.years_served?.toFixed(0) ?? 0 }} yrs
            </p>
            <p v-if="employee.loyalty_pay?.eligible" class="text-xs text-green-600 mt-2">
              {{ employee.loyalty_pay.milestones_received }} Loyalty Pay received
            </p>
            <p class="text-xs text-gray-500 mt-1">
              Next: {{ employee.loyalty_pay?.next_milestone }} yrs ({{
                employee.loyalty_pay?.years_until_next?.toFixed(1)
              }}
              yrs to go)
            </p>
          </div>

          <!-- Retirement -->
          <div class="border rounded-lg p-4">
            <p class="text-xs text-gray-500 mb-1">Retirement</p>
            <p class="text-2xl font-bold text-gray-800">
              {{ employee.retirement?.current_age ?? 'N/A' }} yrs old
            </p>
            <p
              v-if="employee.retirement?.eligible_now"
              class="text-xs text-red-600 mt-2 font-medium"
            >
              Eligible for retirement
            </p>
            <p v-else class="text-xs text-gray-500 mt-2">
              Retirement date: {{ employee.retirement?.retirement_date }}
            </p>
          </div>
        </div>
      </div>

      <!-- Employment History -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-800">Employment History</h2>
          <button
            @click="openPromotionModal"
            class="bg-gray-600 text-white px-3 py-1.5 rounded text-sm hover:bg-gray-700"
          >
            Update Employment Status
          </button>
        </div>

        <div v-if="employee.employment_history && employee.employment_history.length > 0">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b">
              <tr>
                <th class="text-left px-4 py-3 text-gray-600">Previous Position</th>
                <th class="text-left px-4 py-3 text-gray-600">New Position</th>
                <th class="text-left px-4 py-3 text-gray-600">Employment Status</th>
                <th class="text-left px-4 py-3 text-gray-600">Effective Date</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="employment in employee.employment_history"
                :key="employment.id"
                class="border-b hover:bg-gray-50"
              >
                <td class="px-4 py-3 text-gray-700">{{ employment.previous_position || 'N/A' }}</td>
                <td class="px-4 py-3 font-medium text-gray-900">{{ employment.new_position }}</td>
                <td class="px-4 py-3 text-gray-700 capitalize">
                  {{ employment.new_employment_status }}
                </td>
                <td class="px-4 py-3 text-gray-500">{{ employment.effective_date }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-gray-500 text-sm italic py-4">
          No employment history recorded yet.
        </div>
      </div>

      <!-- Leave Balance -->
      <div class="bg-white rounded-lg shadow p-6 mt-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Leave Balance</h2>

        <div v-if="leaveCredits.length > 0">
          <div class="grid grid-cols-2 gap-4">
            <div v-for="credit in leaveCredits" :key="credit.id" class="border rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="font-medium text-gray-800">{{ credit.leave_type }}</span>
                <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                  {{ credit.code }}
                </span>
              </div>
              <div class="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p class="text-xs text-gray-500">Total</p>
                  <p class="text-lg font-bold text-gray-800">
                    {{ Number(credit.total_credits).toFixed(3) }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Used</p>
                  <p class="text-lg font-bold text-red-600">
                    {{ Number(credit.used_credits).toFixed(3) }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Remaining</p>
                  <p class="text-lg font-bold text-green-600">
                    {{ Number(credit.remaining_balance).toFixed(3) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-gray-500 text-sm">
          No leave credits found.
          <button @click="initializeCredits" class="text-blue-600 hover:underline ml-1">
            Initialize Credits
          </button>
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="text-center py-10 text-gray-500">Employee not found.</div>
    <!-- Error -->
    <!-- <div v-else class="text-center py-10 text-gray-500">
      Employee not found.
    </div> -->

    <!-- Edit Employee Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-screen overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-800">Edit Employee Profile</h2>
          <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-600 text-xl">
            ✕
          </button>
        </div>

        <div
          v-if="editError"
          class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4 text-sm"
        >
          {{ editError }}
        </div>

        <form @submit.prevent="handleEditEmployee">
          <h3 class="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
            Personal Information
          </h3>
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
              <input
                v-model="editForm.id_number"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                v-model="editForm.first_name"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
              <input
                v-model="editForm.middle_name"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Surname</label>
              <input
                v-model="editForm.surname"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Sex</label>
              <select
                v-model="editForm.sex"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Civil Status</label>
              <select
                v-model="editForm.civil_status"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="widowed">Widowed</option>
                <option value="separated">Separated</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Birthdate</label>
              <input
                v-model="editForm.birthdate"
                type="date"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <input
                v-model="editForm.contact_number"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div class="grid grid-cols-4 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
              <input
                v-model="editForm.height"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
              <input
                v-model="editForm.weight"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
              <input
                v-model="editForm.bloodtype"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Education</label>
              <input
                v-model="editForm.highest_educational_attainment"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Place of Birth</label>
              <input
                v-model="editForm.place_of_birth"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Residential Address</label
              >
              <input
                v-model="editForm.residential_address"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          <h3
            class="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide border-t pt-4"
          >
            Government Identifications
          </h3>
          <div class="grid grid-cols-5 gap-2 mb-4">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">TIN</label>
              <input
                v-model="editForm.tin_number"
                type="text"
                class="w-full border border-gray-300 rounded px-2 py-1 text-xs"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">UMID</label>
              <input
                v-model="editForm.umid_id"
                type="text"
                class="w-full border border-gray-300 rounded px-2 py-1 text-xs"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Pag-IBIG</label>
              <input
                v-model="editForm.pagibig_id"
                type="text"
                class="w-full border border-gray-300 rounded px-2 py-1 text-xs"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">PhilHealth</label>
              <input
                v-model="editForm.philhealth_number"
                type="text"
                class="w-full border border-gray-300 rounded px-2 py-1 text-xs"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">PSN</label>
              <input
                v-model="editForm.psn_number"
                type="text"
                class="w-full border border-gray-300 rounded px-2 py-1 text-xs"
              />
            </div>
          </div>

          <h3
            class="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide border-t pt-4"
          >
            Employment Information
          </h3>
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Employment Status</label>
              <select
                v-model="editForm.employment_status"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="permanent">Permanent</option>
                <option value="casual">Casual</option>
                <option value="elected">Elected</option>
                <option value="job_order">Job Order</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                v-model="editForm.department_id"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                  {{ dept.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date Hired</label>
              <input
                v-model="editForm.date_hired"
                type="date"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="showEditModal = false"
              class="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="editLoading"
              class="px-4 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
            >
              {{ editLoading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Status Update Modal -->
    <div
      v-if="showPromotionModal"
      class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-800">Update Employment Status</h2>
          <button
            @click="showPromotionModal = false"
            class="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        <div
          v-if="promotionError"
          class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4 text-sm"
        >
          {{ promotionError }}
        </div>

        <form @submit.prevent="handleAddPromotion">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Previous Position</label>
              <input
                v-model="promotionForm.previous_position"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                readonly
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">New Position</label>
              <input
                v-model="promotionForm.new_position"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >New Employment Status</label
              >
              <select
                v-model="promotionForm.new_employment_status"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                required
              >
                <option value="permanent">Permanent</option>
                <option value="casual">Casual</option>
                <option value="elected">Elected</option>
                <option value="job_order">Job Order</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
              <input
                v-model="promotionForm.effective_date"
                type="date"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                required
              />
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button
              type="button"
              @click="showPromotionModal = false"
              class="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="promotionloading"
              class="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {{ promotionloading ? 'Saving...' : 'Save History Record' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/api/axios'

const router = useRouter()
const route = useRoute()

const employee = ref(null)
const loading = ref(true)
const showEditModal = ref(false)
const editLoading = ref(false)
const editError = ref('')
const departments = ref([])
const showPromotionModal = ref(false)
const promotionloading = ref(false)
const promotionError = ref('')
const showAllSteps = ref(false)
const leaveCredits = ref([])

const promotionForm = ref({
  previous_position: '',
  new_position: '',
  previous_employment_status: '',
  new_employment_status: '',
  effective_date: '',
})

const editForm = ref({
  id_number: '',
  first_name: '',
  middle_name: '',
  surname: '',
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
  employment_status: '',
  department_id: '',
  date_hired: '',
})

onMounted(async () => {
  try {
    // FIXED: Fire all requests in parallel at the same time
    const [empResponse, deptResponse, creditsResponse] = await Promise.all([
      api.get(`/employees/${route.params.id}`),
      api.get('/departments'),
      api.get(`/employees/${route.params.id}/leave-credits`),
    ])

    employee.value = empResponse.data
    departments.value = deptResponse.data.data
    leaveCredits.value = creditsResponse.data.credits

    // FIXED: Eliminated the duplicate execution row. Only initialize if empty.
    if (!leaveCredits.value || leaveCredits.value.length === 0) {
      await initializeCredits()
    }

    // Setup edit state
    syncEditForm()
  } catch (error) {
    console.error('Error fetching profiling attributes:', error)
  } finally {
    loading.value = false
  }
})

function syncEditForm() {
  if (!employee.value) return
  editForm.value = {
    id_number: employee.value.id_number,
    first_name: employee.value.first_name,
    middle_name: employee.value.middle_name,
    surname: employee.value.surname,
    sex: employee.value.sex,
    civil_status: employee.value.civil_status,
    birthdate: employee.value.birthdate,
    place_of_birth: employee.value.place_of_birth,
    height: employee.value.height,
    weight: employee.value.weight,
    bloodtype: employee.value.bloodtype,
    highest_educational_attainment: employee.value.highest_educational_attainment,
    residential_address: employee.value.residential_address,
    contact_number: employee.value.contact_number,
    umid_id: employee.value.umid_id,
    pagibig_id: employee.value.pagibig_id,
    philhealth_number: employee.value.philhealth_number,
    psn_number: employee.value.psn_number,
    tin_number: employee.value.tin_number,
    employment_status: employee.value.employment_status,
    department_id: employee.value.department_id,
    date_hired: employee.value.date_hired,
  }
}

async function handleEditEmployee() {
  editLoading.value = true
  editError.value = ''
  try {
    await api.put(`/employees/${route.params.id}`, editForm.value)
    const response = await api.get(`/employees/${route.params.id}`)
    employee.value = response.data
    showEditModal.value = false
  } catch (err) {
    editError.value = err.response?.data?.message || 'Failed to update employee metrics'
  } finally {
    editLoading.value = false
  }
}

async function handleDeactivate() {
  if (confirm('Are you sure you want to deactivate this employee?')) {
    try {
      await api.delete(`/employees/${route.params.id}`)
      const response = await api.get(`/employees/${route.params.id}`)
      employee.value = response.data
    } catch (err) {
      console.error('Failed to update system state on record deactivation', err)
    }
  }
}

async function handleAddPromotion() {
  promotionloading.value = true
  promotionError.value = ''
  try {
    await api.post(`/employees/${route.params.id}/promotions`, promotionForm.value)
    const response = await api.get(`/employees/${route.params.id}`)
    employee.value = response.data
    showPromotionModal.value = false

    // Reset values cleanly
    promotionForm.value = {
      previous_position: '',
      new_position: '',
      previous_employment_status: '',
      new_employment_status: '',
      effective_date: '',
    }
    syncEditForm()
  } catch (err) {
    promotionError.value =
      err.response?.data?.message || 'Failed to capture entry in history relation'
  } finally {
    promotionloading.value = false
  }
}

async function initializeCredits() {
  try {
    await api.get(`/employees/${route.params.id}/leave-credits/initialize`)
    const creditsResponse = await api.get(`/employees/${route.params.id}/leave-credits`)
    leaveCredits.value = creditsResponse.data.credits
  } catch (error) {
    console.error('Failed to initialize credits', error)
  }
}

function openPromotionModal() {
  if (!employee.value) return
  promotionForm.value.previous_position = employee.value.position
  promotionForm.value.previous_employment_status = employee.value.employment_status

  // Set defaults for upcoming shifts
  promotionForm.value.new_position = employee.value.position
  promotionForm.value.new_employment_status = employee.value.employment_status

  showPromotionModal.value = true
}

function goBack() {
  router.push('/employees')
}
</script>
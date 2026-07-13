<template>
  <div>
    <button
      @click="goBack"
      class="flex items-center gap-1.5 text-slate-500 text-sm mb-5 hover:text-navy transition-colors font-medium"
    >
      ← Back to Employees
    </button>

    <div v-if="loading" class="flex items-center justify-center gap-3 py-24">
      <div
        class="w-6 h-6 border-[3px] border-teal-600 border-t-transparent rounded-full animate-spin"
      ></div>
      <span class="text-slate-500 text-sm">Loading employee record...</span>
    </div>

    <!-- Profile Content -->
    <div v-else-if="employee">
      <!-- Profile Header -->
      <div class="bg-white rounded-2xl border border-sky-100 p-7 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[11px] uppercase tracking-wider text-teal-600 font-bold mb-1.5">
              {{ employee.department?.name || employee.department || 'LGU Echague' }}
            </p>
            <h1 class="font-serif text-2xl font-semibold text-navy-deep">
              {{ employee.first_name }} {{ employee.middle_name }} {{ employee.surname }}
            </h1>
            <p class="text-slate-500 text-sm mt-1">{{ employee.position }}</p>
            <div class="flex gap-2 mt-3">
              <span
                class="px-2.5 py-1 rounded-full text-[11px] font-bold"
                :class="
                  employee.is_active ? 'bg-teal-tint text-teal-700' : 'bg-gray-100 text-slate-500'
                "
              >
                {{ employee.is_active ? 'Active' : 'Inactive' }}
              </span>
              <span
                class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-100 text-navy capitalize"
              >
                {{ employee.employment_status?.replace('_', ' ') }}
              </span>
            </div>
          </div>
          <div class="flex gap-2">
            <button
              @click="showEditModal = true"
              class="bg-white border border-sky-100 text-navy px-4 py-2 rounded-xl text-sm font-semibold hover:bg-sky transition-colors"
            >
              Edit
            </button>
            <button
              v-if="employee.is_active"
              @click="handleDeactivate"
              class="bg-navy text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-navy-deep transition-colors"
            >
              Deactivate
            </button>
          </div>
        </div>
      </div>

      <!-- Personal & Employment Info -->
      <div class="grid grid-cols-2 gap-5 mb-6">
        <!-- Personal Information -->
        <div class="bg-white rounded-2xl border border-sky-100 p-6">
          <h2 class="font-serif text-lg font-semibold text-navy-deep mb-4">Personal Information</h2>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                ID Number
              </p>
              <p class="font-mono text-[13px] text-navy-deep">{{ employee.id_number || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                Email
              </p>
              <p class="font-medium text-ink">{{ employee.email || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                Contact Number
              </p>
              <p class="font-mono text-[13px] text-navy-deep">
                {{ employee.contact_number || 'N/A' }}
              </p>
            </div>
            <div>
              <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                Sex / Civil Status
              </p>
              <p class="font-medium text-ink capitalize">
                {{ employee.sex || 'N/A' }} / {{ employee.civil_status || 'N/A' }}
              </p>
            </div>
            <div>
              <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                Birthdate
              </p>
              <p class="font-mono text-[13px] text-navy-deep">{{ employee.birthdate || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                Place of Birth
              </p>
              <p class="font-medium text-ink">{{ employee.place_of_birth || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                Height / Weight
              </p>
              <p class="font-medium text-ink">
                {{ employee.height ? employee.height + 'cm' : 'N/A' }} /
                {{ employee.weight ? employee.weight + 'kg' : 'N/A' }}
              </p>
            </div>
            <div>
              <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                Blood Type
              </p>
              <p class="font-medium text-ink">{{ employee.bloodtype || 'N/A' }}</p>
            </div>
            <div class="col-span-2">
              <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                Educational Attainment
              </p>
              <p class="font-medium text-ink capitalize">
                {{ employee.highest_educational_attainment || 'N/A' }}
              </p>
            </div>
            <div class="col-span-2">
              <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                Residential Address
              </p>
              <p class="font-medium text-ink">{{ employee.residential_address || 'N/A' }}</p>
            </div>
          </div>
        </div>

        <!-- Right column: Employment + Government IDs stacked -->
        <div class="flex flex-col gap-5">
          <!-- Employment Information -->
          <div class="bg-white rounded-2xl border border-sky-100 p-6">
            <h2 class="font-serif text-lg font-semibold text-navy-deep mb-4">
              Employment Information
            </h2>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                  Department
                </p>
                <p class="font-medium text-ink">
                  {{ employee.department?.name || employee.department || 'N/A' }}
                </p>
              </div>
              <div>
                <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                  Employment Status
                </p>
                <p class="font-medium text-ink capitalize">
                  {{ employee.employment_status?.replace('_', ' ') }}
                </p>
              </div>
              <div class="col-span-2">
                <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                  Date Hired
                </p>
                <p class="font-mono text-[13px] text-navy-deep">
                  {{ employee.date_hired || 'N/A' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Statutory Identifications -->
          <div class="bg-white rounded-2xl border border-sky-100 p-6">
            <h2 class="font-serif text-lg font-semibold text-navy-deep mb-4">
              Statutory Identifications
            </h2>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                  TIN
                </p>
                <p class="font-mono text-[13px] text-navy-deep">
                  {{ employee.tin_number || 'N/A' }}
                </p>
              </div>
              <div>
                <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                  UMID
                </p>
                <p class="font-mono text-[13px] text-navy-deep">{{ employee.umid_id || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                  Pag-IBIG
                </p>
                <p class="font-mono text-[13px] text-navy-deep">
                  {{ employee.pagibig_id || 'N/A' }}
                </p>
              </div>
              <div>
                <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                  PhilHealth
                </p>
                <p class="font-mono text-[13px] text-navy-deep">
                  {{ employee.philhealth_number || 'N/A' }}
                </p>
              </div>
              <div class="col-span-2">
                <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                  PSN
                </p>
                <p class="font-mono text-[13px] text-navy-deep">
                  {{ employee.psn_number || 'N/A' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Career Milestones -->
      <div class="bg-white rounded-2xl border border-sky-100 p-6 mb-6">
        <h2 class="font-serif text-lg font-semibold text-navy-deep mb-4">Career Progression</h2>
        <div class="grid grid-cols-3 gap-4">
          <!-- Step Increment -->
          <div class="border border-sky-100 rounded-xl p-4 bg-sky/30">
            <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
              Step Increment
            </p>
            <p
              v-if="employee.step_increment?.current_step"
              class="font-serif text-2xl font-semibold text-navy-deep"
            >
              Step {{ employee.step_increment.current_step }}
            </p>
            <p v-else class="text-sm text-slate-400 italic">
              {{ employee.step_increment?.message || 'N/A' }}
            </p>
            <p
              v-if="employee.step_increment?.next_step_date"
              class="text-xs text-slate-500 mt-2 font-mono"
            >
              Next step: {{ employee.step_increment.next_step_date }}
            </p>

            <!-- Toggle Button -->
            <button
              v-if="employee.step_increment?.all_steps?.length > 0"
              @click="showAllSteps = !showAllSteps"
              class="text-xs text-teal-700 hover:text-teal-800 font-semibold mt-2.5"
            >
              {{ showAllSteps ? 'Hide all steps' : 'View all steps' }}
            </button>

            <!-- All 8 Steps (toggleable) -->
            <div
              v-if="showAllSteps && employee.step_increment?.all_steps?.length > 0"
              class="mt-3 pt-3 border-t border-sky-100 space-y-1.5"
            >
              <div
                v-for="s in employee.step_increment.all_steps"
                :key="s.step"
                class="flex justify-between text-xs"
                :class="{
                  'text-slate-400': s.status === 'reached',
                  'text-navy-deep font-bold': s.status === 'current',
                  'text-slate-300': s.status === 'upcoming',
                }"
              >
                <span>Step {{ s.step }}</span>
                <span class="font-mono">{{ s.date }}</span>
              </div>
            </div>
          </div>

          <!-- Loyalty Pay -->
          <div class="border border-sky-100 rounded-xl p-4 bg-sky/30">
            <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
              Loyalty Pay
            </p>
            <p class="font-serif text-2xl font-semibold text-navy-deep">
              {{ employee.loyalty_pay?.years_served?.toFixed(0) ?? 0 }} yrs
            </p>
            <p
              v-if="employee.loyalty_pay?.eligible"
              class="text-xs text-teal-700 font-semibold mt-2"
            >
              {{ employee.loyalty_pay.milestones_received }} Loyalty Pay received
            </p>
            <p class="text-xs text-slate-500 mt-1">
              Next: {{ employee.loyalty_pay?.next_milestone }} yrs ({{
                employee.loyalty_pay?.years_until_next?.toFixed(1)
              }}
              yrs to go)
            </p>
          </div>

          <!-- Retirement -->
          <div class="border border-sky-100 rounded-xl p-4 bg-sky/30">
            <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
              Retirement
            </p>
            <p class="font-serif text-2xl font-semibold text-navy-deep">
              {{ employee.retirement?.current_age ?? 'N/A' }} yrs old
            </p>
            <p
              v-if="employee.retirement?.eligible_now"
              class="text-xs text-rose-600 mt-2 font-semibold"
            >
              Eligible for retirement
            </p>
            <p v-else class="text-xs text-slate-500 mt-2 font-mono">
              Retirement date: {{ employee.retirement?.retirement_date }}
            </p>
          </div>
        </div>
      </div>

      <!-- Employment History -->
      <!-- <div class="bg-white rounded-2xl border border-sky-100 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-serif text-lg font-semibold text-navy-deep">Employment History</h2>
          <button
            @click="openPromotionModal"
            class="bg-navy text-white px-3.5 py-2 rounded-xl text-sm font-semibold hover:bg-navy-deep transition-colors"
          >
            Update Employment Status
          </button>
        </div>

        <div v-if="employee.employment_history && employee.employment_history.length > 0">
          <table class="w-full text-sm">
            <thead class="bg-sky/60 border-b border-sky-100">
              <tr>
                <th
                  class="text-left px-4 py-3 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
                >
                  Previous Position
                </th>
                <th
                  class="text-left px-4 py-3 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
                >
                  New Position
                </th>
                <th
                  class="text-left px-4 py-3 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
                >
                  Employment Status
                </th>
                <th
                  class="text-left px-4 py-3 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
                >
                  Effective Date
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="employment in employee.employment_history"
                :key="employment.id"
                class="border-b border-sky-100 last:border-b-0 hover:bg-sky/40 transition-colors"
              >
                <td class="px-4 py-3 text-slate-600">
                  {{ employment.previous_position || '' }}
                </td>
                <td class="px-4 py-3 font-semibold text-navy-deep">
                  {{ employment.new_position }}
                </td>
                <td class="px-4 py-3 text-slate-600 capitalize">
                  {{ employment.new_employment_status?.replace('_', ' ') }}
                </td>
                <td class="px-4 py-3 text-slate-500 font-mono text-[12.5px]">
                  {{ employment.effective_date }}
                </td>
              </tr>
            </tbody>
          </table>
          
        </div>
        <div v-else class="text-slate-400 text-sm italic py-4">
          No employment history recorded yet.
        </div>
      </div> -->
      <!-- Employment History -->
      <div class="bg-white rounded-2xl border border-sky-100 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-serif text-lg font-semibold text-navy-deep">Employment History</h2>
          <button
            @click="openPromotionModal"
            class="bg-navy text-white px-3.5 py-2 rounded-xl text-sm font-semibold hover:bg-navy-deep transition-colors"
          >
            Update Employment Status
          </button>
        </div>

        <div v-if="employee.employment_history && employee.employment_history.length > 0">
          <table class="w-full text-sm">
            <thead class="bg-sky/60 border-b border-sky-100">
              <tr>
                <th
                  class="text-left px-4 py-3 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
                >
                  Previous Position
                </th>
                <th
                  class="text-left px-4 py-3 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
                >
                  New Position
                </th>
                <th
                  class="text-left px-4 py-3 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
                >
                  Employment Status
                </th>
                <th
                  class="text-left px-4 py-3 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
                >
                  Effective Date
                </th>
              </tr>
            </thead>
            <tbody>
              <!-- Uses a slice to conditionally show only the first row or all rows -->
              <tr
                v-for="employment in showAllHistory
                  ? employee.employment_history
                  : employee.employment_history.slice(0, 1)"
                :key="employment.id"
                class="border-b border-sky-100 last:border-b-0 hover:bg-sky/40 transition-colors"
              >
                <td class="px-4 py-3 text-slate-600">
                  {{ employment.previous_position || '' }}
                </td>
                <td class="px-4 py-3 font-semibold text-navy-deep">
                  {{ employment.new_position }}
                </td>
                <td class="px-4 py-3 text-slate-600 capitalize">
                  {{ employment.new_employment_status?.replace('_', ' ') }}
                </td>
                <td class="px-4 py-3 text-slate-500 font-mono text-[12.5px]">
                  {{ employment.effective_date }}
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Toggle Button (Only displays if there is more than 1 history item) -->
          <div v-if="employee.employment_history.length > 1" class="mt-3 flex justify-start">
            <button
              @click="showAllHistory = !showAllHistory"
              type="button"
              class="text-xs text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1 transition-colors"
            >
              {{
                showAllHistory
                  ? 'Hide historical records'
                  : `View all history (${employee.employment_history.length} records)`
              }}
              <span>{{ showAllHistory ? '▲' : '▼' }}</span>
            </button>
          </div>
        </div>
        <div v-else class="text-slate-400 text-sm italic py-4">
          No employment history recorded yet.
        </div>
      </div>

      <!-- Leave Balance -->
      <div class="bg-white rounded-2xl border border-sky-100 p-6 mt-6">
        <div class="flex items-center justify-between mb-5">
          <h2 class="font-serif text-lg font-semibold text-navy-deep">Leave Balance</h2>
          <button
            @click="openLeaveCard"
            class="text-[12.5px] font-semibold text-navy border border-sky-100 rounded-xl px-3.5 py-1.5 hover:bg-sky transition-colors"
          >
            View Leave Card
          </button>
          <!-- <span class="font-mono text-[10.5px] text-slate-400">CS FORM 6</span> -->
        </div>

        <div v-if="leaveCredits.length > 0" class="grid grid-cols-2 gap-4">
          <div
            v-for="credit in leaveCredits"
            :key="credit.id"
            class="border border-dashed border-sky-100 rounded-xl p-4"
          >
            <div class="flex items-center justify-between mb-3">
              <span class="font-semibold text-navy-deep">{{ credit.leave_type }}</span>
              <span
                class="bg-sky-100 text-navy px-2 py-0.5 rounded-full text-[11px] font-bold font-mono"
              >
                {{ credit.code }}
              </span>
            </div>
            <div class="grid grid-cols-3 gap-2 text-center">
              <div>
                <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                  Total
                </p>
                <p class="font-serif text-lg font-semibold text-navy-deep">
                  {{ Number(credit.total_credits).toFixed(3) }}
                </p>
              </div>
              <div>
                <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                  Used
                </p>
                <p class="font-serif text-lg font-semibold text-rose-600">
                  {{ Number(credit.used_credits).toFixed(3) }}
                </p>
              </div>
              <div>
                <p class="text-[10.5px] uppercase tracking-wide text-slate-400 font-bold mb-1">
                  Remaining
                </p>
                <p class="font-serif text-lg font-semibold text-teal-700">
                  {{ Number(credit.remaining_balance).toFixed(3) }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-slate-500 text-sm">
          No leave credits found.
          <button
            @click="initializeCredits"
            class="text-teal-700 hover:text-teal-800 font-semibold ml-1"
          >
            Initialize Credits
          </button>
        </div>
      </div>
      <!-- Leave Card Modal (stays INSIDE v-else-if="employee" so the
           v-if/v-else-if/v-else chain with "Not Found" below stays intact) -->
      <div
        v-if="showLeaveCard"
        class="fixed inset-0 bg-navy-deep/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <div
          class="bg-white rounded-3xl shadow-xl w-full max-w-5xl p-7 max-h-[90vh] overflow-y-auto"
        >
          <div class="flex items-center justify-between mb-2">
            <div>
              <!-- <p class="text-[11px] uppercase tracking-wider text-teal-600 font-bold mb-1">
                Local Government Unit · Echague, Isabela
              </p> -->
              <h2 class="font-serif text-xl font-semibold text-navy-deep">Employee's Leave Card</h2>
            </div>
            <button
              @click="showLeaveCard = false"
              class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-sky hover:text-navy transition-colors text-lg"
            >
              ✕
            </button>
          </div>

          <div v-if="leaveCardLoading" class="flex items-center justify-center gap-3 py-16">
            <div
              class="w-6 h-6 border-[3px] border-teal-600 border-t-transparent rounded-full animate-spin"
            ></div>
            <span class="text-slate-500 text-sm">Loading leave card...</span>
          </div>

          <template v-else-if="leaveCardData">
            <!-- <p class="text-sm text-slate-500 mb-6">
              <span class="font-semibold text-navy-deep">{{ leaveCardData.employee?.name }}</span>
              <span class="text-slate-400"> · {{ leaveCardData.employee?.position }}</span>
            </p> -->

            <div class="grid grid-cols-2 gap-5">
              <!-- Vacation Leave -->
              <!-- Vacation Leave -->
              <div>
                <h3 class="font-serif text-base font-semibold text-navy-deep mb-3">
                  Vacation Leave
                </h3>
                <div class="border border-sky-100 rounded-xl overflow-hidden">
                  <table class="w-full text-xs">
                    <thead class="bg-sky/60 border-b border-sky-100">
                      <tr>
                        <th
                          class="text-left px-2.5 py-2.5 text-[9px] uppercase tracking-wider text-slate-400 font-bold"
                        >
                          Period
                        </th>
                        <th
                          class="text-left px-2.5 py-2.5 text-[9px] uppercase tracking-wider text-slate-400 font-bold"
                        >
                          Particulars
                        </th>
                        <th
                          class="text-right px-2 py-2.5 text-[9px] uppercase tracking-wider text-slate-400 font-bold"
                        >
                          Earned
                        </th>
                        <th
                          class="text-right px-2 py-2.5 text-[9px] uppercase tracking-wider text-slate-400 font-bold"
                          title="Absence/Undertime With Pay"
                        >
                          W/P
                        </th>
                        <th
                          class="text-right px-2 py-2.5 text-[9px] uppercase tracking-wider text-slate-400 font-bold"
                          title="Absence/Undertime Without Pay"
                        >
                          WOP
                        </th>
                        <th
                          class="text-right px-2 py-2.5 text-[9px] uppercase tracking-wider text-slate-400 font-bold"
                        >
                          Used
                        </th>
                        <th
                          class="text-right px-2.5 py-2.5 text-[9px] uppercase tracking-wider text-slate-400 font-bold"
                        >
                          Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(row, i) in leaveCardData.vacation_leave"
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
                      <tr
                        v-if="
                          !leaveCardData.vacation_leave || leaveCardData.vacation_leave.length === 0
                        "
                      >
                        <td colspan="7" class="px-3 py-8 text-center text-slate-400 text-xs">
                          No VL history yet
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <!-- Sick Leave -->
              <!-- Sick Leave -->
              <div>
                <h3 class="font-serif text-base font-semibold text-navy-deep mb-3">Sick Leave</h3>
                <div class="border border-sky-100 rounded-xl overflow-hidden">
                  <table class="w-full text-xs">
                    <thead class="bg-sky/60 border-b border-sky-100">
                      <tr>
                        <th
                          class="text-left px-2.5 py-2.5 text-[9px] uppercase tracking-wider text-slate-400 font-bold"
                        >
                          Period
                        </th>
                        <th
                          class="text-left px-2.5 py-2.5 text-[9px] uppercase tracking-wider text-slate-400 font-bold"
                        >
                          Particulars
                        </th>
                        <th
                          class="text-right px-2 py-2.5 text-[9px] uppercase tracking-wider text-slate-400 font-bold"
                        >
                          Earned
                        </th>
                        <th
                          class="text-right px-2 py-2.5 text-[9px] uppercase tracking-wider text-slate-400 font-bold"
                          title="Absence/Undertime With Pay"
                        >
                          W/P
                        </th>
                        <th
                          class="text-right px-2 py-2.5 text-[9px] uppercase tracking-wider text-slate-400 font-bold"
                          title="Absence/Undertime Without Pay"
                        >
                          WOP
                        </th>
                        <th
                          class="text-right px-2 py-2.5 text-[9px] uppercase tracking-wider text-slate-400 font-bold"
                        >
                          Used
                        </th>
                        <th
                          class="text-right px-2.5 py-2.5 text-[9px] uppercase tracking-wider text-slate-400 font-bold"
                        >
                          Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(row, i) in leaveCardData.sick_leave"
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
                      <tr v-if="!leaveCardData.sick_leave || leaveCardData.sick_leave.length === 0">
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
    </div>

    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-navy-deep/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-3xl shadow-xl w-full max-w-2xl p-7 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="font-serif text-xl font-semibold text-navy-deep">Edit Employee Profile</h2>
          <button
            @click="showEditModal = false"
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

        <form @submit.prevent="handleEditEmployee">
          <h3 class="text-[11px] font-bold text-teal-600 mb-3 uppercase tracking-wider">
            Personal Information
          </h3>
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">ID Number</label>
              <input
                v-model="editForm.id_number"
                type="text"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">First Name</label>
              <input
                v-model="editForm.first_name"
                type="text"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">Middle Name</label>
              <input
                v-model="editForm.middle_name"
                type="text"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">Surname</label>
              <input
                v-model="editForm.surname"
                type="text"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">Sex</label>
              <select
                v-model="editForm.sex"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">Civil Status</label>
              <select
                v-model="editForm.civil_status"
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
                v-model="editForm.birthdate"
                type="date"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">Contact Number</label>
              <input
                v-model="editForm.contact_number"
                type="text"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div class="grid grid-cols-4 gap-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">Height (cm)</label>
              <input
                v-model="editForm.height"
                type="text"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">Weight (kg)</label>
              <input
                v-model="editForm.weight"
                type="text"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">Blood Type</label>
              <input
                v-model="editForm.bloodtype"
                type="text"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">Education</label>
              <input
                v-model="editForm.highest_educational_attainment"
                type="text"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">Place of Birth</label>
              <input
                v-model="editForm.place_of_birth"
                type="text"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5"
                >Residential Address</label
              >
              <input
                v-model="editForm.residential_address"
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
                v-model="editForm.tin_number"
                type="text"
                class="w-full border border-sky-100 bg-sky/40 rounded-lg px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-navy-deep mb-1.5">UMID</label>
              <input
                v-model="editForm.umid_id"
                type="text"
                class="w-full border border-sky-100 bg-sky/40 rounded-lg px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-navy-deep mb-1.5">Pag-IBIG</label>
              <input
                v-model="editForm.pagibig_id"
                type="text"
                class="w-full border border-sky-100 bg-sky/40 rounded-lg px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-navy-deep mb-1.5">PhilHealth</label>
              <input
                v-model="editForm.philhealth_number"
                type="text"
                class="w-full border border-sky-100 bg-sky/40 rounded-lg px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-navy-deep mb-1.5">PSN</label>
              <input
                v-model="editForm.psn_number"
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
              <label class="block text-sm font-medium text-navy-deep mb-1.5"
                >Employment Status</label
              >
              <select
                v-model="editForm.employment_status"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              >
                <option value="permanent">Permanent</option>
                <option value="casual">Casual</option>
                <option value="elected">Elected</option>
                <option value="job_order">Job Order</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">Department</label>
              <select
                v-model="editForm.department_id"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              >
                <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                  {{ dept.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">Date Hired</label>
              <input
                v-model="editForm.date_hired"
                type="date"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="showEditModal = false"
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

    <!-- Status Update Modal -->
    <div
      v-if="showPromotionModal"
      class="fixed inset-0 bg-navy-deep/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-3xl shadow-xl w-full max-w-md p-7">
        <div class="flex items-center justify-between mb-6">
          <h2 class="font-serif text-xl font-semibold text-navy-deep">Update Employment Status</h2>
          <button
            @click="showPromotionModal = false"
            class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-sky hover:text-navy transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        <div
          v-if="promotionError"
          class="bg-rose-tint border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-5 text-sm"
        >
          {{ promotionError }}
        </div>

        <form @submit.prevent="handleAddPromotion">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5"
                >Previous Position</label
              >
              <input
                v-model="promotionForm.previous_position"
                type="text"
                class="w-full border border-sky-100 bg-sky rounded-xl px-3.5 py-2.5 text-sm text-slate-500 cursor-not-allowed"
                readonly
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">New Position</label>
              <input
                v-model="promotionForm.new_position"
                type="text"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5"
                >New Employment Status</label
              >
              <select
                v-model="promotionForm.new_employment_status"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                required
              >
                <option value="permanent">Permanent</option>
                <option value="casual">Casual</option>
                <option value="elected">Elected</option>
                <option value="job_order">Job Order</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">Effective Date</label>
              <input
                v-model="promotionForm.effective_date"
                type="date"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                required
              />
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-7">
            <button
              type="button"
              @click="showPromotionModal = false"
              class="px-5 py-2.5 text-sm font-semibold text-navy border border-sky-100 rounded-xl hover:bg-sky transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="promotionloading"
              class="px-5 py-2.5 text-sm font-semibold bg-teal-600 text-white rounded-xl hover:bg-[#256F63] transition-colors disabled:opacity-50"
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

const showLeaveCard = ref(false)
const leaveCardLoading = ref(false)
const leaveCardData = ref(null)

const showAllHistory = ref(false)

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
    const [empResponse, deptResponse, creditsResponse] = await Promise.all([
      api.get(`/employees/${route.params.id}`),
      api.get('/departments'),
      api.get(`/employees/${route.params.id}/leave-credits`),
    ])

    employee.value = empResponse.data
    departments.value = deptResponse.data.data
    leaveCredits.value = creditsResponse.data.credits

    if (!leaveCredits.value || leaveCredits.value.length === 0) {
      await initializeCredits()
    }
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
    await api.post(`/employees/${route.params.id}/leave-credits/initialize`)
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

  promotionForm.value.new_position = employee.value.position
  promotionForm.value.new_employment_status = employee.value.employment_status

  showPromotionModal.value = true
}

async function openLeaveCard() {
  showLeaveCard.value = true
  leaveCardLoading.value = true
  try {
    const response = await api.get(`/employees/${route.params.id}/leave-card`)
    leaveCardData.value = response.data
  } catch (error) {
    console.error('Failed to load leave card', error)
    leaveCardData.value = null
  } finally {
    leaveCardLoading.value = false
  }
}

function goBack() {
  router.push('/employees')
}
</script>
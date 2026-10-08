<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <h1 class="font-serif text-2xl font-semibold text-navy-deep">Manage Accounts</h1>
      <button
        @click="showAddModal = true"
        class="bg-navy text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-navy-deep transition-colors shadow-sm"
      >
        + Add Account
      </button>
    </div>

    <!-- Add Account Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-navy-deep/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-3xl shadow-xl w-full max-w-md p-7">
        <div class="flex items-center justify-between mb-6">
          <h2 class="font-serif text-xl font-semibold text-navy-deep">Add New Account</h2>
          <button
            @click="showAddModal = false"
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

        <form @submit.prevent="handleAddAccount">
          <div class="space-y-4 mb-6">
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
              <label class="block text-sm font-medium text-navy-deep mb-1.5">
                Email <span class="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                v-model="form.email"
                type="email"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">Password</label>
              <div class="relative">
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                  required
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                >
                  <!-- eye -->
                  <svg
                    v-if="!showPassword"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="1.8"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2.04 12.32a1 1 0 010-.64C3.42 7.51 7.36 4.5 12 4.5c4.64 0 8.58 3.01 9.96 7.18a1 1 0 010 .64C20.58 16.49 16.64 19.5 12 19.5c-4.64 0-8.58-3.01-9.96-7.18z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <!-- eye-off -->
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="1.8"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3.98 8.22A10.48 10.48 0 002.04 12.32C3.42 16.49 7.36 19.5 12 19.5c.99 0 1.95-.14 2.86-.4M6.23 6.23A10.45 10.45 0 0112 4.5c4.64 0 8.58 3.01 9.96 7.18a10.52 10.52 0 01-4.29 5.55M6.23 6.23L3 3m3.23 3.23l3.65 3.65m7.89 7.89L21 21m-3.23-3.23l-3.65-3.65m0 0a3 3 0 10-4.24-4.24m4.24 4.24L9.88 9.88"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">Role</label>
              <select
                v-model="form.role"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                required
              >
                <option value="">Select Role</option>
                <option value="hr_admin">HR Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="showAddModal = false"
              class="px-5 py-2.5 text-sm font-semibold text-navy border border-sky-100 rounded-xl hover:bg-sky transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="formLoading"
              class="px-5 py-2.5 text-sm font-semibold bg-navy text-white rounded-xl hover:bg-navy-deep transition-colors disabled:opacity-50"
            >
              {{ formLoading ? 'Saving...' : 'Save Account' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Password Reset Result Modal -->
    <div
      v-if="resetResult"
      class="fixed inset-0 bg-navy-deep/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-3xl shadow-xl w-full max-w-md p-7">
        <h2 class="font-serif text-xl font-semibold text-navy-deep mb-1">Password Reset</h2>
        <p class="text-[13px] text-slate-500 mb-5">
          Share this temporary password with the user. They'll be required to change it on login.
        </p>
        <div class="bg-sky/50 rounded-xl p-4 space-y-2.5 mb-6 font-mono text-[13px]">
          <div class="flex justify-between">
            <span class="text-slate-400">Username</span>
            <span class="text-navy-deep font-semibold">{{ resetResult.username }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Temporary Password</span>
            <span class="text-navy-deep font-semibold">{{ resetResult.temporary_password }}</span>
          </div>
        </div>
        <button
          @click="resetResult = null"
          class="w-full bg-navy text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-navy-deep transition-colors"
        >
          Done
        </button>
      </div>
    </div>

    <!-- Accounts Table -->
    <div class="flex items-center gap-3 mb-4">
      <input
        v-model="search"
        @input="debounceSearch"
        type="text"
        placeholder="Search username or email..."
        class="w-72 border border-sky-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
      />
      <select
        v-model="selectedRole"
        @change="fetchAccounts(1)"
        class="border border-sky-200 rounded-lg px-3 py-1.5 text-sm text-navy-deep font-semibold bg-white"
      >
        <option value="">All Roles</option>
        <option value="super_admin">Super Admin</option>
        <option value="hr_admin">HR Admin</option>
        <option value="employee">Employee</option>
      </select>
    </div>
    <div class="bg-white rounded-2xl border border-sky-100 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-sky/60 border-b border-sky-100">
          <tr>
            <th
              class="w-10 text-left px-5 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              No
            </th>
            <th
              class="text-left px-5 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Username
            </th>
            <th
              class="text-left px-5 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Email
            </th>
            <th
              class="text-left px-5 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Role
            </th>
            <th
              class="text-left px-5 py-3.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-bold"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(acct, index) in accounts"
            :key="acct.id"
            class="border-b border-sky-100 last:border-b-0 hover:bg-sky/40 transition-colors"
          >
            <td class="px-5 py-3.5 text-slate-500">{{ (currentPage - 1) * 20 + index + 1 }}</td>
            <td class="px-5 py-3.5 font-semibold text-navy-deep">{{ acct.username }}</td>
            <td class="px-5 py-3.5 text-slate-600">{{ acct.email || '—' }}</td>
            <td class="px-5 py-3.5 text-slate-600 capitalize">
              {{ acct.role?.replace('_', ' ') }}
            </td>
            <td class="px-5 py-3.5">
              <div class="flex gap-4">
                <button
                  v-if="acct.id !== authStore.user?.id"
                  @click="handleResetPassword(acct)"
                  class="text-teal-700 hover:text-teal-800 font-semibold text-sm transition-colors"
                >
                  Reset Password
                </button>
                <button
                  v-if="acct.id !== authStore.user?.id"
                  @click="handleDelete(acct.id)"
                  class="text-rose-600 hover:text-rose-700 font-semibold text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="accounts.length === 0">
            <td colspan="5" class="px-5 py-12 text-center text-slate-400 text-sm">
              No accounts found
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex items-center justify-between px-5 py-4 border-t border-sky-100 bg-sky/30">
        <p class="text-[12.5px] text-slate-500">
          Page <span class="font-semibold text-navy-deep">{{ currentPage }}</span> of {{ lastPage }}
        </p>
        <div class="flex gap-2">
          <button
            @click="fetchAccounts(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3.5 py-1.5 text-[12.5px] font-semibold border border-sky-100 rounded-lg bg-white hover:bg-sky text-navy transition-colors disabled:opacity-40 disabled:hover:bg-white"
          >
            ← Previous
          </button>
          <button
            @click="fetchAccounts(currentPage + 1)"
            :disabled="currentPage === lastPage"
            class="px-3.5 py-1.5 text-[12.5px] font-semibold border border-sky-100 rounded-lg bg-white hover:bg-sky text-navy transition-colors disabled:opacity-40 disabled:hover:bg-white"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import api from '@/api/axios'
import { useConfirm } from '@/composables/useConfirm'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const accounts = ref([])
const showAddModal = ref(false)
const formError = ref(null)
const formLoading = ref(false)
const resetResult = ref(null)

const currentPage = ref(1)
const lastPage = ref(1)
const selectedRole = ref('')

const showPassword = ref(false)

const { confirm } = useConfirm()

const form = ref({
  username: '',
  email: '',
  password: '',
  role: '',
})

const search = ref('')
let searchTimer = null

function debounceSearch() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => fetchAccounts(1), 400)
}

async function fetchAccounts(page = 1) {
  try {
    const response = await api.get('/users', {
      params: { page, role: selectedRole.value || undefined, search: search.value || undefined },
    })
    accounts.value = response.data.data
    currentPage.value = response.data.current_page
    lastPage.value = response.data.last_page
  } catch (error) {
    console.error('Error fetching accounts:', error)
  }
}

async function handleAddAccount() {
  formLoading.value = true
  formError.value = ''
  try {
    await api.post('/users', {
      ...form.value,
      email: form.value.email.trim() || null,
    })
    showAddModal.value = false
    Object.keys(form.value).forEach((key) => (form.value[key] = ''))
    await fetchAccounts(currentPage.value)
  } catch (error) {
    formError.value = error.response?.data?.message || 'Failed to create account. Please try again.'
  } finally {
    formLoading.value = false
  }
}

async function handleDelete(id) {
  const ok = await confirm({
    title: 'Delete account?',
    message: 'This cannot be undone.',
  })
  if (!ok) return

  try {
    await api.delete(`/users/${id}`)
    await fetchAccounts(currentPage.value)
  } catch (error) {
    alert(error.response?.data?.message || 'Failed to delete account.')
  }
}

async function handleResetPassword(acct) {
  const ok = await confirm({
    title: 'Reset password?',
    message: `${acct.username} will be logged out and must set a new password on next login.`,
  })
  if (!ok) return

  try {
    const res = await api.post(`/users/${acct.id}/reset-password`)
    resetResult.value = res.data
  } catch (error) {
    alert(error.response?.data?.message || 'Failed to reset password.')
  }
}
watch(showAddModal, (open) => {
  if (!open) showPassword.value = false
})

onMounted(() => fetchAccounts())
</script>
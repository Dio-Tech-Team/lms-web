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
              <label class="block text-sm font-medium text-navy-deep mb-1.5">Email</label>
              <input
                v-model="form.email"
                type="email"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-navy-deep mb-1.5">Password</label>
              <input
                v-model="form.password"
                type="password"
                class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
                required
              />
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

    <!-- Accounts Table -->

    <div class="flex items-center justify-between mb-4">
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
            <td class="px-5 py-3.5 text-slate-500">{{ (currentPage - 1) * 15 + index + 1 }}</td>
            <td class="px-5 py-3.5 font-semibold text-navy-deep">{{ acct.username }}</td>
            <td class="px-5 py-3.5 text-slate-600">{{ acct.email }}</td>
            <td class="px-5 py-3.5 text-slate-600 capitalize">
              {{ acct.role?.replace('_', ' ') }}
            </td>
            <td class="px-5 py-3.5">
              <button
                @click="handleDelete(acct.id)"
                class="text-rose-600 hover:text-rose-700 font-semibold text-sm transition-colors"
              >
                Delete
              </button>
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
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
import { useConfirm } from '@/composables/useConfirm'

const accounts = ref([])
const showAddModal = ref(false)
const formError = ref(null)
const formLoading = ref(false)

const currentPage = ref(1)
const lastPage = ref(1)
const selectedRole = ref('')

const { confirm } = useConfirm()

const form = ref({
  username: '',
  email: '',
  password: '',
  role: '',
})

async function fetchAccounts(page = 1) {
  try {
    const response = await api.get('/users', {
      params: { page, role: selectedRole.value || undefined },
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
    await api.post('/users', form.value)
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

onMounted(() => fetchAccounts())
</script>
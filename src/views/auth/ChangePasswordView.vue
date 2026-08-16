<template>
  <div class="min-h-screen flex items-center justify-center bg-sky px-6">
    <div class="w-full max-w-[440px] bg-white rounded-[32px] shadow-xl p-11">
      <div class="flex items-center gap-3 mb-1.5">
        <div
          class="w-9 h-9 rounded-xl bg-teal-600/10 flex items-center justify-center flex-shrink-0"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0d9488"
            stroke-width="2"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <p class="text-[11px] uppercase tracking-wider text-teal-600 font-bold">Security Step</p>
      </div>
      <h1 class="font-serif text-[26px] font-semibold text-navy-deep mb-7">Change Your Password</h1>

      <div
        v-if="error"
        class="bg-rose-tint border border-rose-200 text-rose-700 px-3.5 py-2.5 rounded-xl mb-4 text-[13px]"
      >
        {{ error }}
      </div>

      <form @submit.prevent="handleChangePassword" class="space-y-4">
        <div>
          <label class="text-[12.5px] font-medium text-navy-deep mb-1.5 block"
            >Current Password</label
          >
          <div class="relative">
            <input
              v-model="currentPassword"
              :type="showCurrent ? 'text' : 'password'"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              required
            />
            <button
              type="button"
              @click="showCurrent = !showCurrent"
              class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy transition-colors"
              tabindex="-1"
            >
              <svg
                v-if="!showCurrent"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <svg
                v-else
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.7 18.7 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            </button>
          </div>
        </div>

        <div class="pt-1 border-t border-sky-100"></div>

        <div>
          <label class="text-[12.5px] font-medium text-navy-deep mb-1.5 block">New Password</label>
          <div class="relative">
            <input
              v-model="newPassword"
              :type="showNew ? 'text' : 'password'"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              required
            />
            <button
              type="button"
              @click="showNew = !showNew"
              class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy transition-colors"
              tabindex="-1"
            >
              <svg
                v-if="!showNew"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <svg
                v-else
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.7 18.7 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            </button>
          </div>
          <p class="text-[11px] text-slate-400 mt-1.5">
            Min 8 characters, upper &amp; lowercase, a number, and a symbol.
          </p>
        </div>

        <div>
          <label class="text-[12.5px] font-medium text-navy-deep mb-1.5 block"
            >Confirm New Password</label
          >
          <div class="relative">
            <input
              v-model="newPasswordConfirmation"
              :type="showConfirm ? 'text' : 'password'"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl px-3.5 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
              required
            />
            <button
              type="button"
              @click="showConfirm = !showConfirm"
              class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy transition-colors"
              tabindex="-1"
            >
              <svg
                v-if="!showConfirm"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <svg
                v-else
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.7 18.7 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            </button>
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-navy text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-navy-deep transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
        >
          <span
            v-if="loading"
            class="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"
          ></span>
          {{ loading ? 'Updating...' : 'Update Password' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/axios'

const router = useRouter()
const authStore = useAuthStore()

const currentPassword = ref('')
const newPassword = ref('')
const newPasswordConfirmation = ref('')
const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)
const loading = ref(false)
const error = ref('')

async function handleChangePassword() {
  loading.value = true
  error.value = ''

  try {
    await api.post('/change-password', {
      current_password: currentPassword.value,
      password: newPassword.value,
      password_confirmation: newPasswordConfirmation.value,
    })

    authStore.clearMustChangePassword()
    router.push('/')
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      Object.values(err.response?.data?.errors || {})[0]?.[0] ||
      'Failed to update password'
  } finally {
    loading.value = false
  }
}
</script>
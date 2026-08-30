<template>
  <div class="min-h-screen flex items-center justify-center bg-sky px-6 py-10">
    <div
      class="w-full max-w-[820px] min-h-[480px] bg-white rounded-[32px] shadow-xl flex overflow-hidden relative"
    >
      <!-- Left Panel: curved brand side -->
      <div class="relative w-[42%] flex-shrink-0">
        <div
          class="absolute inset-0 bg-gradient-to-br from-navy-deep to-navy"
          style="border-radius: 0 120px 120px 0"
        ></div>
        <div
          class="absolute inset-0 opacity-[0.06]"
          style="
            background-image: radial-gradient(circle, white 1px, transparent 1px);
            background-size: 20px 20px;
            border-radius: 0 120px 120px 0;
          "
        ></div>

        <div class="relative h-full flex flex-col justify-between p-9">
          <div class="flex items-center gap-2.5">
            <div
              class="w-10 h-10 rounded-full bg-white overflow-hidden flex items-center justify-center flex-shrink-0 p-1"
            >
              <img
                :src="lguLogo"
                alt="Seal of the Local Government Unit of Echague, Isabela"
                class="w-full h-full object-contain"
              />
            </div>
            <span class="font-serif text-[15px] font-semibold text-white">LeaveSync</span>
          </div>

          <div>
            <h2 class="font-serif text-2xl leading-snug text-white mb-2">Set your password</h2>
            <p class="text-sky-300/70 text-[13px] leading-relaxed">
              Choose a password only you know before continuing.
            </p>
          </div>

          <p class="font-mono text-[10.5px] text-sky-300/50"></p>
        </div>
      </div>

      <!-- Right Panel: form -->
      <div class="flex-1 flex flex-col justify-center px-11 py-10">
        <p class="text-[11px] uppercase tracking-wider text-teal-600 font-bold mb-1.5">
          Security Step
        </p>
        <h1 class="font-serif text-[26px] font-semibold text-navy-deep mb-7">
          Change Your Password
        </h1>

        <div
          v-if="error"
          class="bg-rose-tint border border-rose-200 text-rose-700 px-3.5 py-2.5 rounded-xl mb-4 text-[13px]"
        >
          {{ error }}
        </div>

        <form @submit.prevent="handleChangePassword" class="space-y-4">
          <div class="relative">
            <svg
              class="absolute left-3.5 top-1/2 -translate-y-1/2"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8B98A6"
              stroke-width="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              v-model="currentPassword"
              :type="showCurrent ? 'text' : 'password'"
              placeholder="Current Password"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
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

          <div class="border-t border-sky-100 pt-2"></div>

          <div class="relative">
            <svg
              class="absolute left-3.5 top-1/2 -translate-y-1/2"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8B98A6"
              stroke-width="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              v-model="newPassword"
              :type="showNew ? 'text' : 'password'"
              placeholder="New Password"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
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

          <div class="relative">
            <svg
              class="absolute left-3.5 top-1/2 -translate-y-1/2"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8B98A6"
              stroke-width="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              v-model="newPasswordConfirmation"
              :type="showConfirm ? 'text' : 'password'"
              placeholder="Confirm New Password"
              class="w-full border border-sky-100 bg-sky/40 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-colors"
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

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-navy text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-navy-deep transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-1"
          >
            <span
              v-if="loading"
              class="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"
            ></span>
            {{ loading ? 'Updating...' : 'Update Password' }}
          </button>
        </form>

        <p class="text-[11.5px] text-slate-400 mt-6">
          Min 8 characters, upper &amp; lowercase, a number, and a symbol.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/axios'
import lguLogo from '@/assets/lgu.png'

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
<template>
  <div class="min-h-screen bg-sky flex">
    <!-- Loading Bar -->
    <div
      v-if="isLoading"
      class="fixed top-0 left-0 w-full h-1 bg-teal-600 z-50 animate-pulse"
    ></div>

    <!-- Sidebar -->
    <aside
      class="w-64 bg-gradient-to-b from-navy-deep to-navy text-sky-100 flex flex-col sticky top-0 h-screen overflow-y-auto"
    >
      <!-- Logo -->
      <div class="px-5 pt-7 pb-6 mb-2 border-b border-white/10 flex items-center gap-3">
        <div class="w-9 h-9 rounded-2xl bg-teal-600 flex items-center justify-center flex-shrink-0">
          <span class="font-serif font-bold text-white text-lg">L</span>
        </div>
        <div>
          <h1 class="font-serif text-lg font-semibold text-white leading-tight">LeaveSync</h1>
          <p class="text-[10px] uppercase tracking-wider text-sky-300/70">LGU Echague, Isabela</p>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 pb-4">
        <div class="mb-5">
          <p class="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-sky-300/60">
            Overview
          </p>
          <ul class="space-y-0.5">
            <li>
              <RouterLink
                to="/"
                class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-sky-100/80 hover:bg-white/5 transition-colors"
                active-class="!bg-white/10 !text-white font-semibold"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                Dashboard
              </RouterLink>
            </li>
          </ul>
        </div>

        <div class="mb-5">
          <p class="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-sky-300/60">
            Records
          </p>
          <ul class="space-y-0.5">
            <li>
              <RouterLink
                to="/employees"
                class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-sky-100/80 hover:bg-white/5 transition-colors"
                active-class="!bg-white/10 !text-white font-semibold"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                Employees
              </RouterLink>
            </li>
          </ul>
        </div>

        <div class="mb-5">
          <p class="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-sky-300/60">
            Leave
          </p>
          <ul class="space-y-0.5">
            <li>
              <RouterLink
                to="/leave-applications"
                class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-sky-100/80 hover:bg-white/5 transition-colors"
                active-class="!bg-white/10 !text-white font-semibold"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                Applications
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/leave-records"
                class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-sky-100/80 hover:bg-white/5 transition-colors"
                active-class="!bg-white/10 !text-white font-semibold"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                Records
              </RouterLink>
            </li>

            <li>
              <RouterLink
                to="/leave-monetizations"
                class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-sky-100/80 hover:bg-white/5 transition-colors"
                active-class="!bg-white/10 !text-white font-semibold"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                Monetization
              </RouterLink>
            </li>

            <li>
              <RouterLink
                to="/leave-credit-computation"
                class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-sky-100/80 hover:bg-white/5 transition-colors"
                active-class="!bg-white/10 !text-white font-semibold"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                Credit Computation
              </RouterLink>
            </li>

            <li v-if="authStore.isSuperAdmin">
              <RouterLink
                to="/leave-configurations"
                class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-sky-100/80 hover:bg-white/5 transition-colors"
                active-class="!bg-white/10 !text-white font-semibold"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                Configuration
              </RouterLink>
            </li>
          </ul>
        </div>

        <div class="mb-2">
          <p class="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-sky-300/60">
            System
          </p>
          <ul class="space-y-0.5">
            <li v-if="authStore.isSuperAdmin">
              <RouterLink
                to="/accounts"
                class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-sky-100/80 hover:bg-white/5 transition-colors"
                active-class="!bg-white/10 !text-white font-semibold"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                Manage Accounts
              </RouterLink>
            </li>

            <li v-if="authStore.isSuperAdmin">
              <RouterLink
                to="/holidays"
                class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-sky-100/80 hover:bg-white/5 transition-colors"
                active-class="!bg-white/10 !text-white font-semibold"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                Holidays
              </RouterLink>
            </li>
            <li v-if="authStore.isSuperAdmin">
              <RouterLink
                to="/positions"
                class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-sky-100/80 hover:bg-white/5 transition-colors"
                active-class="!bg-white/10 !text-white font-semibold"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                Positions
              </RouterLink>
            </li>
            <li v-if="authStore.isSuperAdmin">
              <RouterLink
                to="/activity-logs"
                class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-sky-100/80 hover:bg-white/5 transition-colors"
                active-class="!bg-white/10 !text-white font-semibold"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                Activity Logs
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/leave-setting"
                class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-sky-100/80 hover:bg-white/5 transition-colors"
                active-class="!bg-white/10 !text-white font-semibold"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                Settings
              </RouterLink>
            </li>
          </ul>
        </div>
      </nav>

      <!-- User Info + Logout -->
      <div class="p-4 border-t border-white/10">
        <div class="flex items-center gap-3 mb-3">
          <div
            class="w-9 h-9 rounded-xl bg-gray-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
          >
            {{ authStore.user?.username?.charAt(0).toUpperCase() }}
          </div>
          <div class="min-w-0">
            <p class="text-sm font-semibold text-white truncate">{{ authStore.user?.username }}</p>
            <p class="text-xs text-sky-300/60 capitalize truncate">
              {{ authStore.user?.role?.replace('_', ' ') }}
            </p>
          </div>
        </div>
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-rose-200 hover:bg-rose-500/10 hover:text-rose-100 transition-colors"
        >
          <span>→</span>
          Logout
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-8">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const isLoading = ref(false)

router.beforeEach(() => {
  isLoading.value = true
})

router.afterEach(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 300)
})

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
/* aside {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

aside::-webkit-scrollbar {
  display: none;
} */

aside {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
}

aside::-webkit-scrollbar {
  width: 6px;
}

aside::-webkit-scrollbar-track {
  background: transparent;
}

aside::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 9999px;
}

aside::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.25);
}
</style>
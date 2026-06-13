<template>
  <div class="min-h-screen bg-gray-100 flex">
    <!-- Loading Bar -->
    <div
      v-if="isLoading"
      class="fixed top-0 left-0 w-full h-1 bg-blue-500 z-50 animate-pulse"
    ></div>

    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-md flex flex-col sticky top-0 h-screen overflow-y-auto">
      <!-- Logo -->
      <div class="p-6 border-b">
        <h1 class="text-xl font-bold text-gray-600">LeaveSync</h1>
        <p class="text-xs text-gray-500">LGU Echague, Isabela</p>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4">
        <ul class="space-y-1">
          <li>
            <RouterLink
              to="/"
              class="flex items-center gap-3 px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-600"
              active-class="bg-gray-50 text-gray-600 font-medium"
            >
              Dashboard
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/employees"
              class="flex items-center gap-3 px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-600"
              active-class="bg-gray-50 text-gray-600 font-medium"
            >
              Employees
            </RouterLink>
          </li>

          <li>
            <RouterLink
              to="/leave-configurations"
              class="flex items-center gap-3 px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-600"
              active-class="bg-gray-50 text-gray-600 font-medium"
            >
              Leave Configurations
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/leave-records"
              class="flex items-center gap-3 px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-600"
              active-class="bg-gray-50 text-gray-600 font-medium"
            >
              Leave Records
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/leave-applications"
              class="flex items-center gap-3 px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-600"
              active-class="bg-gray-50 text-gray-600 font-medium"
            >
              Leave Applications
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/leave-applications"
              class="flex items-center gap-3 px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-600"
              active-class="bg-gray-50 text-gray-600 font-medium"
            >
              Settings
            </RouterLink>
          </li>
        </ul>
      </nav>

      <!-- User Info + Logout -->
      <div class="p-4 border-t border-gray-200">
        <div class="flex items-center gap-3 mb-3">
          <div
            class="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm font-bold"
          >
            {{ authStore.user?.username?.charAt(0).toUpperCase() }}
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-800">{{ authStore.user?.username }}</p>
            <p class="text-xs text-gray-400 capitalize">
              {{ authStore.user?.role?.replace('_', ' ') }}
            </p>
          </div>
        </div>
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <span>→</span>
          Logout
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6">
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
</script>>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
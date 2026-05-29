<template>
  <div class="min-h-screen bg-gray-100 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-md flex flex-col">
      <!-- Logo -->
      <div class="p-6 border-b">
        <h1 class="text-xl font-bold text-blue-600">LeaveSync</h1>
        <p class="text-xs text-gray-500">LGU Echague, Isabela</p>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4">
        <ul class="space-y-1">
          <li>
            <RouterLink
              to="/"
              class="flex items-center gap-3 px-3 py-2 rounded text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              active-class="bg-blue-50 text-blue-600 font-medium"
            >
              Dashboard
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/employees"
              class="flex items-center gap-3 px-3 py-2 rounded text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              active-class="bg-blue-50 text-blue-600 font-medium"
            >
              Employees
            </RouterLink>
          </li>
        </ul>
      </nav>

      <!-- User Info + Logout -->
      <div class="p-4 border-t">
        <p class="text-sm font-medium text-gray-700">{{ authStore.user?.username }}</p>
        <p class="text-xs text-gray-500 mb-3">{{ authStore.user?.role }}</p>
        <button
          @click="handleLogout"
          class="w-full text-sm text-red-600 hover:text-red-700 text-left"
        >
          Logout
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true, role: 'hr_admin' },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/admin/DashboardView.vue'),
        },
        {
          path: 'employees',
          name: 'employees',
          component: () => import('@/views/admin/EmployeeListView.vue'),
        },
        {
          path: 'employees/:id',
          name: 'employee-profile',
          component: () => import('@/views/admin/EmployeeProfileView.vue'),
        },
        {
          path: 'leave-configurations',
          name: 'leave-configurations',
          component: () => import('@/views/admin/LeaveConfigurationView.vue'),
        },
        {
          path: 'leave-records',
          name: 'leave-records',
          component: () => import('@/views/admin/LeaveRecordsView.vue'),
        },
        {
          path: 'leave-applications',
          name: 'leave-applications',
          component: () => import('@/views/admin/LeaveApplicationView.vue'),
        },
      ],
    },
  ],
})

// Navigation guard
// New way
router.beforeEach((to, from) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return '/login'
  } else if (to.meta.guestOnly && authStore.isAuthenticated) {
    return '/'
  }
})

export default router

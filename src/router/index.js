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
      path: '/change-password',
      name: 'change-password',
      component: () => import('@/views/auth/ChangePasswordView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true, roles: ['hr_admin', 'super_admin'] },
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
          meta: { roles: ['super_admin'] }, // ← overrides parent, super_admin only
        },
        {
          path: '/holidays',
          name: 'holidays',
          component: () => import('@/views/admin/HolidaysView.vue'),
          meta: { requiresAuth: true, roles: ['super_admin'] }, // match whatever meta your other protected routes use
        },
        {
          path: '/positions',
          name: 'positions',
          component: () => import('@/views/admin/PositionView.vue'),
          meta: { requiresAuth: true, roles: ['super_admin'] },
        },
        {
          path: 'leave-records',
          name: 'leave-records',
          component: () => import('@/views/admin/LeaveRecordsView.vue'),
        },
        {
          path: 'reports',
          name: 'reports',
          component: () => import('@/views/admin/ReportsView.vue'),
        },
        {
          path: 'leave-applications',
          name: 'leave-applications',
          component: () => import('@/views/admin/LeaveApplicationView.vue'),
        },
        {
          path: 'leave-credit-computation',
          name: 'leave-credit-computation',
          component: () => import('@/views/admin/LeaveCreditComputationView.vue'),
        },

        {
          path: 'leave-monetizations',
          name: 'leave-monetizations',
          component: () => import('@/views/admin/LeaveMonetizationView.vue'),
        },
        {
          path: 'accounts',
          name: 'accounts',
          component: () => import('@/views/admin/AccountManagementView.vue'),
          meta: { roles: ['super_admin'] }, // ← new page for UserController
        },

        {
          path: 'activity-logs',
          name: 'activity-logs',
          component: () => import('@/views/admin/ActivityLogView.vue'),
          meta: { roles: ['super_admin'] },
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

  // Force password change before accessing anything else
  if (
    authStore.isAuthenticated &&
    authStore.user?.must_change_password &&
    to.name !== 'change-password'
  ) {
    return '/change-password'
  }

  // Once changed, don't let them linger on the change-password screen
  if (
    authStore.isAuthenticated &&
    !authStore.user?.must_change_password &&
    to.name === 'change-password'
  ) {
    return '/'
  }

  const requiredRoles = to.matched
    .slice()
    .reverse()
    .find((record) => record.meta.roles)?.meta.roles

  if (requiredRoles && !requiredRoles.includes(authStore.user?.role)) {
    return '/login' // or a dedicated /unauthorized page
  }
})

export default router

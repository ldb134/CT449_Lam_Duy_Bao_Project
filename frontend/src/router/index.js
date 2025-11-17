import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store' 

import Login from '@/views/auth/Login.vue'
import StaffLogin from '@/views/auth/StaffLogin.vue'
import Register from '@/views/auth/Register.vue'
import ReaderHome from '@/views/reader/ReaderHome.vue'
import StaffDashboard from '@/views/staff/StaffDashboard.vue'
import BorrowHistory from '@/views/reader/BorrowHistory.vue'
import BookManage from '@/views/staff/BookManage.vue'
import PublisherManage from '@/views/staff/PublisherManage.vue'

const routes = [
  {
    path: '/',
    name: 'reader-home',
    component: ReaderHome,
    meta: { layout: 'reader' } 
  },
  {
    path: '/history',
    name: 'borrow-history',
    component: BorrowHistory,
    meta: { layout: 'reader', requiresAuth: true } 
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { layout: 'reader' }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: { layout: 'reader' }
  },

  {
    path: '/staff/login',
    name: 'staff-login',
    component: StaffLogin,
    meta: { layout: 'blank' }
  },
  {
    path: '/staff',
    name: 'staff-dashboard',
    component: StaffDashboard,
    meta: { 
      layout: 'staff',
      requiresAuth: true, 
      isStaff: true       
    }
  },
  {
    path: '/staff/books',
    name: 'book-manage',
    component: BookManage,
    meta: { layout: 'staff', requiresAuth: true, isStaff: true }
  },
  {
    path: '/staff/publishers',
    name: 'publisher-manage',
    component: PublisherManage,
    meta: { layout: 'staff', requiresAuth: true, isStaff: true }
  },
  {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFound.vue'),
      meta: { layout: 'reader' }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth) {
    if (!authStore.isLoggedIn) {
      next(to.meta.isStaff ? '/staff/login' : '/login');
    } else if (to.meta.isStaff && !authStore.isStaff) {
      next('/');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router
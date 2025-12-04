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
import BookDetail from '@/views/reader/BookDetail.vue'
import ReaderManage from '@/views/staff/ReaderManage.vue'
import StaffManage from '@/views/staff/StaffManage.vue'
import ChangePassword from '@/views/staff/ChangePassword.vue'
import ReaderProfile from '@/views/reader/ReaderProfile.vue'
import LibraryRules from '@/views/reader/LibraryRules.vue';
import BorrowingManage from '@/views/staff/BorrowingManage.vue'

const routes = [
  {
    path: '/',
    name: 'reader-home',
    component: ReaderHome,
    meta: { layout: 'reader' } 
  },
  {
    path: '/library',
    name: 'library-page',
    component: () => import('@/views/reader/Library.vue'),
    meta: { layout: 'reader' }
  },
  {
    path: '/rules',
    name: 'library-rules',
    component: LibraryRules,
    meta: { layout: 'reader' } 
  },
  {
    path: '/about',
    name: 'about-page',
    component: () => import('@/views/reader/About.vue'),
    meta: { layout: 'reader' }
  },
  {
    path: '/books/:id', 
    name: 'book-detail',
    component: BookDetail,
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
    path: '/profile',
    name: 'reader-profile',
    component: ReaderProfile,
    meta: { layout: 'reader', requiresAuth: true }
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
    path: '/staff/readers',
    name: 'reader-manage',
    component: ReaderManage,
    meta: { layout: 'staff', requiresAuth: true, isStaff: true }
  },
  {
    path: '/staff/accounts',
    name: 'staff-manage',
    component: StaffManage,
    meta: { layout: 'staff', requiresAuth: true, isStaff: true }
  },
  {
    path: '/staff/profile',
    name: 'staff-profile',
    component: ChangePassword,
    meta: { layout: 'staff', requiresAuth: true, isStaff: true }
  },
  {
    path: '/staff/publishers',
    name: 'publisher-manage',
    component: PublisherManage,
    meta: { layout: 'staff', requiresAuth: true, isStaff: true }
  },
  {
    path: '/staff/borrowings',
    name: 'borrowing-manage',
    component: BorrowingManage,
    meta: { layout: 'staff', requiresAuth: true, isStaff: true }
  },
  {
    path: '/staff/transactions',
    name: 'transaction-log',
    component: () => import('@/views/staff/TransactionLog.vue'), 
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

const STAFF_LOGIN_SECRET = "B2205854"; 

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // Nếu đích đến là trang 404 (not-found) -> Cho qua luôn, không kiểm tra gì nữa
  if (to.name === 'not-found') {
      return next();
  }

  const isStaffZone = to.path.startsWith('/staff');

  // STAFF ZONE
  if (isStaffZone) {
      if (to.name === 'staff-login') {
          if (to.query.key !== STAFF_LOGIN_SECRET) {
              return next({ name: 'not-found', params: { pathMatch: to.path.substring(1).split('/') } });
          }
          return next();
      }

      if (!authStore.isLoggedIn || !authStore.isStaff) {
          return next({ name: 'not-found', params: { pathMatch: to.path.substring(1).split('/') } });
      }
      
      return next();
  } 
  
  // READER ZONE
  else {
      if (authStore.isLoggedIn && authStore.isStaff) {
          return next('/staff');
      }

      if (to.meta.requiresAuth && !authStore.isLoggedIn) {
          return next('/login');
      }

      return next();
  }
});

export default router
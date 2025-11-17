<template>
    <div class="d-flex" style="min-height: 100vh;">
        <div class="bg-dark text-white p-3 d-flex flex-column" style="width: 260px;">
            <div class="text-center py-3 border-bottom border-secondary">
                <h4 class="mb-0">Quản Lý Thư Viện</h4>
                <small class="text-info">
                    <font-awesome-icon icon="user-shield" />
                    Chào, {{ authStore.user?.hoTenNV }}
                </small>
            </div>
            
            <ul class="nav flex-column mt-3">
                <li class="nav-item mb-2">
                    <router-link to="/staff" class="nav-link text-white">
                        <font-awesome-icon icon="chart-line" class="me-2" /> Tổng Quan
                    </router-link>
                </li>
                <li class="nav-item mb-2">
                    <router-link to="/staff/books" class="nav-link text-white">
                      <font-awesome-icon icon="book" class="me-2" /> Quản Lý Sách
                    </router-link>
                </li>
                
                <li class="nav-item mt-auto">
                     <button @click="logout" class="btn btn-danger w-100 mt-4">
                        <font-awesome-icon icon="sign-out-alt" class="me-2" /> Đăng Xuất
                     </button>
                </li>
            </ul>
        </div>

        <div class="flex-grow-1 bg-light">
            <div class="container-fluid p-4">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

function logout() {
    authStore.logout();
    router.push('/staff/login');
}
</script>
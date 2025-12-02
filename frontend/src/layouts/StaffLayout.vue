<template>
    <div class="d-flex" style="min-height: 100vh;">
        <div 
            class="bg-dark text-white p-3 d-flex flex-column flex-shrink-0" 
            style="width: 260px; min-width: 260px; height: 100vh; position: sticky; top: 0; z-index: 1000;"
        >
            <div class="text-center py-3 border-bottom border-secondary">
                <h4 class="mb-0">Quản Lý Thư Viện</h4>
                <small class="text-info">
                    <font-awesome-icon icon="user-shield" />
                    Chào, {{ authStore.user?.hoTenNV || 'Admin' }}
                </small>
            </div>
            
            <ul class="nav flex-column mt-3">
                <li class="nav-item mb-2">
                    <router-link to="/staff" class="nav-link text-white">
                        <font-awesome-icon icon="chart-line" class="me-2" style="width: 20px"/> Tổng Quan
                    </router-link>
                </li>
                <li class="nav-item mb-2">
                    <router-link to="/staff/books" class="nav-link text-white">
                      <font-awesome-icon icon="book" class="me-2" style="width: 20px"/> Quản Lý Sách
                    </router-link>
                </li>
                <li class="nav-item mb-2">
                    <router-link to="/staff/publishers" class="nav-link text-white">
                      <font-awesome-icon icon="building" class="me-2" style="width: 20px"/> Nhà Xuất Bản
                    </router-link>
                </li>
                <li class="nav-item mb-2">
                    <router-link to="/staff/readers" class="nav-link text-white">
                      <font-awesome-icon icon="users" class="me-2" style="width: 20px"/> Quản Lý Độc Giả
                    </router-link>
                </li>
                <li class="nav-item mb-2">
                    <router-link to="/staff/accounts" class="nav-link text-white">
                      <font-awesome-icon icon="user-tie" class="me-2" style="width: 20px"/> Nhân Sự
                    </router-link>
                </li>
                <li class="nav-item mb-2">
                    <router-link to="/staff/borrowings" class="nav-link text-white">
                        <font-awesome-icon icon="clipboard-list" class="me-2" style="width: 20px"/> Mượn Trả
                    </router-link>
                </li>
                <li class="nav-item mb-2">
                    <router-link to="/staff/profile" class="nav-link text-white">
                      <font-awesome-icon icon="key" class="me-2" style="width: 20px"/> Đổi Mật Khẩu
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

<style scoped>
.nav-link:hover {
    background-color: rgba(255,255,255,0.1);
    border-radius: 5px;
}
.router-link-active {
    background-color: #0d6efd !important; 
    color: white !important;
    border-radius: 5px;
    font-weight: bold;
}
</style>
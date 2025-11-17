<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4">
        <div class="container">
            <a class="navbar-brand fw-bold text-primary" href="/">
                <font-awesome-icon icon="book-open" class="me-2" /> Thư Viện
            </a>
            
            <div class="ms-auto">
                <div v-if="authStore.isLoggedIn" class="d-flex align-items-center">
                    <router-link to="/history" class="btn btn-link text-decoration-none me-3">
                        <font-awesome-icon icon="history" /> Lịch sử mượn
                    </router-link>

                    <span class="me-3 fw-bold text-dark">
                        <font-awesome-icon icon="user" class="me-1" />
                        Xin chào, {{ authStore.user?.ten}}
                    </span>
                    <button @click="logout" class="btn btn-outline-danger btn-sm">
                        <font-awesome-icon icon="sign-out-alt" /> Đăng Xuất
                    </button>
                </div>
                
                <div v-else>
                    <router-link to="/login" class="btn btn-outline-primary btn-sm me-2">Đăng Nhập</router-link>
                    <router-link to="/register" class="btn btn-primary btn-sm">Đăng Ký</router-link>
                </div>
            </div>
        </div>
    </nav>

    <div class="container">
        <slot></slot>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

function logout() {
    authStore.logout();
    router.push('/login');
}
</script>
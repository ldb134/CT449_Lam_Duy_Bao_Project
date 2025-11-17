<template>
    <div class="reader-layout d-flex flex-column min-vh-100">
        <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4">
            <div class="container">
                <a class="navbar-brand fw-bold text-primary" href="/">
                    <font-awesome-icon icon="book-open" class="me-2" /> Thư Viện
                </a>
                
                <div class="ms-auto">
                    <div v-if="authStore.isLoggedIn" class="d-flex align-items-center">
                    <router-link to="/profile" class="text-decoration-none me-3 fw-bold text-dark d-flex align-items-center">
                        <div class="bg-light rounded-circle d-flex align-items-center justify-content-center me-2 text-primary border" style="width: 35px; height: 35px;">
                            <font-awesome-icon icon="user" />
                        </div>
                        <span>Xin chào, {{ authStore.user?.ten || 'Bạn' }}</span>
                    </router-link>

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

        <div class="container flex-grow-1">
            <slot></slot>
        </div>

        <AppFooter />
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'vue-router';
import AppFooter from '@/components/AppFooter.vue'; 

const authStore = useAuthStore();
const router = useRouter();

function logout() {
    authStore.logout();
    router.push('/login');
}
</script>

<style scoped>
.reader-layout {
    min-height: 100vh;
}
</style>
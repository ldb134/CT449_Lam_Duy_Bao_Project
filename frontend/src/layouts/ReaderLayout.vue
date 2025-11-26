<template>
    <div class="reader-layout d-flex flex-column min-vh-100">
        <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4">
            <div class="container">
                <a class="navbar-brand fw-bold text-primary" href="/">
                    <font-awesome-icon icon="book-open" class="me-2" /> Thư Viện
                </a>
                
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-4">
                    <li class="nav-item">
                    <router-link to="/" class="nav-link fw-bold" active-class="text-primary active">Trang Chủ</router-link>
                    </li>
                    <li class="nav-item">
                    <router-link to="/library" class="nav-link fw-bold" active-class="text-primary active">Danh Mục Sách</router-link>
                    </li>
                </ul>
                </div>
                <div class="ms-auto">
                    <div v-if="authStore.isLoggedIn" class="d-flex align-items-center">
                        
                        <div class="dropdown me-3">
                            <button class="btn btn-light position-relative rounded-circle border" type="button" data-bs-toggle="dropdown">
                                <font-awesome-icon icon="bell" :class="unreadCount > 0 ? 'text-primary' : 'text-muted'" />
                                <span v-if="unreadCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {{ unreadCount }}
                                </span>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end shadow p-0" style="width: 300px; max-height: 400px; overflow-y: auto;">
                                <li class="p-2 border-bottom fw-bold bg-light">Thông báo mới</li>
                                
                                <li v-if="notifications.length === 0" class="p-3 text-center text-muted small">
                                    Không có thông báo nào.
                                </li>

                                <li v-for="noti in notifications" :key="noti._id" class="border-bottom">
                                    <a class="dropdown-item p-2 text-wrap" href="#" @click.prevent="readNoti(noti)">
                                        <div class="d-flex w-100 justify-content-between">
                                            <strong class="mb-1 small" :class="'text-' + noti.loai">{{ noti.tieuDe }}</strong>
                                            <small class="text-muted" style="font-size: 10px">{{ formatDate(noti.createdAt) }}</small>
                                        </div>
                                        <p class="mb-1 small text-muted">{{ noti.noiDung }}</p>
                                        <div v-if="!noti.daXem" class="text-primary small" style="font-size: 10px">
                                            <font-awesome-icon icon="circle" style="font-size: 6px" class="me-1"/> Chưa đọc
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </div>
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
import { ref, onMounted, computed } from 'vue';
import NotificationService from '@/services/notification.service';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'vue-router';
import AppFooter from '@/components/AppFooter.vue'; 

const authStore = useAuthStore();
const router = useRouter();

const notifications = ref([]);

const unreadCount = computed(() => notifications.value.filter(n => !n.daXem).length);

const fetchNoti = async () => {
    if (authStore.isLoggedIn) {
        try {
            notifications.value = await NotificationService.getMine();
        } catch (e) { console.log(e); }
    }
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit'});
};

const readNoti = async (noti) => {
    if (!noti.daXem) {
        try {
            await NotificationService.markRead(noti._id);
            noti.daXem = true; 
        } catch (e) {
            console.log(e);
        }
    }
};

const logout = () => {
    authStore.logout();
    router.push('/login');
};

onMounted(() => {
    fetchNoti();
    setInterval(fetchNoti, 60000);
});
</script>

<style scoped>
.reader-layout {
    min-height: 100vh;
}
</style>
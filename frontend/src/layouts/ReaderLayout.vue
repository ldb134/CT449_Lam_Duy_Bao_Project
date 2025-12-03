<template>
    <div class="reader-layout d-flex flex-column min-vh-100">
        <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4 sticky-top">
            <div class="container">
                <a class="navbar-brand fw-bold text-primary fs-4" href="/">
                    <font-awesome-icon icon="book-open" class="me-2" /> Thư Viện
                </a>

                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                  <span class="navbar-toggler-icon"></span>
                </button>
                
                <div class="collapse navbar-collapse" id="navbarNav">
                  <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                      <router-link to="/" class="nav-link fw-bold px-3" active-class="text-primary active">Trang Chủ</router-link>
                    </li>
                    <li class="nav-item">
                      <router-link to="/library" class="nav-link fw-bold px-3" active-class="text-primary active">Sách</router-link>
                    </li>
                    <li class="nav-item">
                      <router-link to="/rules" class="nav-link fw-bold px-3" active-class="text-primary active">Quy Định</router-link>
                    </li>
                    <li class="nav-item">
                      <router-link to="/about" class="nav-link fw-bold px-3" active-class="text-primary active">Giới Thiệu</router-link>
                    </li>
                  </ul>

                  <form class="d-flex flex-grow-1 mx-lg-4 my-2 my-lg-0" style="max-width: 500px;" @submit.prevent="handleQuickSearch">
                    <div class="input-group">
                        <input 
                            class="form-control border-end-0 rounded-start-pill bg-light" 
                            type="search" 
                            placeholder="Bạn muốn tìm sách gì..." 
                            v-model="quickSearchText"
                        />
                        <button class="btn btn-light border border-start-0 rounded-end-pill text-muted" type="submit">
                            <font-awesome-icon icon="search" />
                        </button>
                    </div>
                  </form>

                  <div class="ms-auto d-flex align-items-center">
                    <div v-if="authStore.isLoggedIn" class="d-flex align-items-center">
                        
                        <div class="dropdown me-3">
                            <button class="btn btn-light position-relative rounded-circle border shadow-sm" type="button" data-bs-toggle="dropdown">
                                <font-awesome-icon icon="bell" :class="unreadCount > 0 ? 'text-primary' : 'text-muted'" />
                                <span v-if="unreadCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light">
                                    {{ unreadCount }}
                                </span>
                            </button>
                            
                            <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-2 p-0" style="width: 320px; max-height: 400px; overflow-y: auto;">
                                <li class="p-3 border-bottom fw-bold bg-light d-flex justify-content-between align-items-center sticky-top">
                                    <span>Thông báo</span>
                                    <small class="text-primary cursor-pointer hover-underline" @click="markAllRead" v-if="unreadCount > 0">
                                        Đánh dấu đã đọc hết
                                    </small>
                                </li>
                                <li v-if="notifications.length === 0" class="p-4 text-center text-muted small">
                                    <font-awesome-icon icon="bell-slash" class="mb-2 fs-4 d-block opacity-50" />
                                    Không có thông báo mới
                                </li>
                                <li v-for="noti in notifications" :key="noti._id" class="border-bottom hover-bg-light">
                                    <a class="dropdown-item p-3 text-wrap" href="#" @click.prevent="readNoti(noti)">
                                        <div class="d-flex w-100 justify-content-between mb-1">
                                            <strong class="small" :class="'text-' + noti.loai">{{ noti.tieuDe }}</strong>
                                            <small class="text-muted" style="font-size: 11px">{{ formatDate(noti.createdAt) }}</small>
                                        </div>
                                        <p class="mb-1 small text-secondary" style="font-size: 13px">{{ noti.noiDung }}</p>
                                        <div v-if="!noti.daXem" class="text-primary small fw-bold" style="font-size: 10px">
                                            ● Mới
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div class="dropdown">
                            <a href="#" class="d-flex align-items-center text-decoration-none dropdown-toggle text-dark fw-bold" data-bs-toggle="dropdown">
                                <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2 shadow-sm" style="width: 35px; height: 35px;">
                                    {{ getAvatarChar(authStore.user?.ten) }}
                                </div>
                                <span class="d-none d-md-inline">{{ authStore.user?.ten || 'Bạn' }}</span>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                                <li>
                                    <router-link to="/profile" class="dropdown-item">
                                        <font-awesome-icon icon="user-circle" class="me-2"/>Hồ sơ cá nhân
                                    </router-link>
                                </li>
                                <li>
                                    <router-link to="/history" class="dropdown-item">
                                        <font-awesome-icon icon="history" class="me-2"/>Lịch sử mượn
                                    </router-link>
                                </li>
                                <li><hr class="dropdown-divider" /></li>
                                <li>
                                    <button @click="logout" class="dropdown-item text-danger">
                                        <font-awesome-icon icon="sign-out-alt" class="me-2"/>Đăng xuất
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <div v-else class="d-flex gap-2">
                        <router-link to="/login" class="btn btn-outline-primary rounded-pill px-4 text-nowrap">Đăng Nhập</router-link>
                        <router-link to="/register" class="btn btn-primary rounded-pill px-4 shadow-sm text-nowrap">Đăng Ký</router-link>
                    </div>
                  </div> 
                </div> 
            </div> </nav>

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
const quickSearchText = ref('');

const unreadCount = computed(() => notifications.value.filter(n => !n.daXem).length);

const fetchNoti = async () => {
    if (authStore.isLoggedIn) {
        try {
            notifications.value = await NotificationService.getMine();
        } catch (e) { console.log(e); }
    }
};

const handleQuickSearch = () => {
    if (quickSearchText.value.trim()) {
        router.push({ path: '/library', query: { q: quickSearchText.value } });
        quickSearchText.value = ''; 
    }
};

const getAvatarChar = (name) => name ? name.charAt(0).toUpperCase() : 'U';

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit', hour: '2-digit', minute:'2-digit'});
};

// Hàm đánh dấu 1 tin đã đọc
const readNoti = async (noti) => {
    if (!noti.daXem) {
        try {
            await NotificationService.markRead(noti._id);
            noti.daXem = true; 
        } catch (e) {
            console.error("Lỗi cập nhật trạng thái đọc:", e);
        }
    }
};

// Hàm đánh dấu tất cả đã đọc (Gọi API)
const markAllRead = async () => {
    const unreadList = notifications.value.filter(n => !n.daXem);
    
    if (unreadList.length === 0) return;

    try {
        await Promise.all(unreadList.map(n => NotificationService.markRead(n._id)));
        notifications.value.forEach(n => n.daXem = true);
    } catch (error) {
        console.error("Lỗi cập nhật trạng thái:", error);
    }
};

const logout = () => {
    authStore.logout();
    router.push('/login');
};

onMounted(() => {
    fetchNoti();
    setInterval(fetchNoti, 60000); // Tự động check thông báo mỗi 60s
});
</script>

<style scoped>
.reader-layout {
    min-height: 100vh;
    background-color: #f8f9fa;
}
.hover-bg-light:hover {
    background-color: #f8f9fa;
}
.cursor-pointer {
    cursor: pointer;
}
.hover-underline:hover {
    text-decoration: underline;
}
/* Giữ header thông báo luôn ở trên cùng khi scroll */
.sticky-top {
    position: sticky;
    top: 0;
    z-index: 1020;
}
</style>
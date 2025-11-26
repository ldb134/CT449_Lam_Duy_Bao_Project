<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-5">
                <div class="card shadow-sm border-0">
                    <div class="card-header bg-white text-center py-3 border-bottom-0">
                        <h3 class="text-primary fw-bold">📚 Đăng Nhập</h3>
                    </div>
                    <div class="card-body p-4">
                        <div v-if="errorMessage" class="alert alert-danger">
                            {{ errorMessage }}
                        </div>

                        <form @submit.prevent="handleLogin">
                            <div class="mb-3">
                                <label for="username" class="form-label">Số điện thoại</label>
                                <input 
                                    type="text" 
                                    class="form-control" 
                                    id="username" 
                                    v-model="username"
                                    placeholder="Ví dụ: 0901234567"
                                    required
                                />
                            </div>

                            <div class="mb-4">
                                <label for="password" class="form-label">Mật khẩu</label>
                                <input 
                                    type="password" 
                                    class="form-control" 
                                    id="password" 
                                    v-model="password"
                                    required
                                />
                            </div>

                            <div class="d-grid">
                                <button class="btn btn-primary btn-lg" type="submit" :disabled="loading">
                                    <span v-if="loading && loginMethod === 'normal'" class="spinner-border spinner-border-sm me-2"></span>
                                    {{ loading && loginMethod === 'normal' ? 'Đang xử lý...' : 'Đăng Nhập' }}
                                </button>
                            </div>
                        </form>

                        <div class="text-center mt-4">
                            <p class="text-muted small position-relative">
                                <span class="bg-white px-2 position-relative" style="z-index: 1;">--- Hoặc đăng nhập bằng ---</span>
                                <span class="position-absolute top-50 start-0 w-100 border-bottom" style="z-index: 0;"></span>
                            </p>
                            <div class="d-grid">
                                <button 
                                    type="button" 
                                    class="btn btn-outline-danger" 
                                    @click="loginGoogle"
                                    :disabled="loading"
                                >
                                    <font-awesome-icon :icon="['fab', 'google']" class="me-2" /> Đăng nhập với Google
                                </button>
                            </div>
                        </div>
                        </div>
                    <div class="card-footer text-center bg-white py-3 border-top-0">
                        <small>Chưa có tài khoản? <router-link to="/register" class="text-decoration-none">Đăng ký ngay</router-link></small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'vue-router';

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/config/firebase"; 

const authStore = useAuthStore();
const router = useRouter();

const username = ref('');
const password = ref('');
const errorMessage = ref('');
const loading = ref(false);
const loginMethod = ref(''); 

onMounted(() => {
    authStore.logout();
});

// Đăng nhập thường (SĐT + Pass)
async function handleLogin() {
    loading.value = true;
    loginMethod.value = 'normal';
    errorMessage.value = '';
    
    try {
        await authStore.login({ dienThoai: username.value, password: password.value }, 'reader');
        router.push('/'); 
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Đăng nhập thất bại.';
    } finally {
        loading.value = false;
        loginMethod.value = '';
    }
}

// Đăng nhập Google
const loginGoogle = async () => {
    loading.value = true;
    loginMethod.value = 'google';
    errorMessage.value = '';

    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        const response = await authStore.loginWithSocial({
            email: user.email,
            displayName: user.displayName,
            photoUrl: user.photoURL
        });
        
        if (response.isNewUser) {
            alert("Chào mừng thành viên mới! Vui lòng cập nhật Số điện thoại và Mật khẩu để hoàn tất hồ sơ.");
            router.push('/profile'); 
        } else {
            router.push('/'); 
        }
        
    } catch (error) {
        console.error(error);
        errorMessage.value = "Lỗi đăng nhập Google: " + error.message;
    } finally {
        loading.value = false;
        loginMethod.value = '';
    }
};
</script>
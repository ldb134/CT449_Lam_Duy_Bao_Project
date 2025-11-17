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
                                    {{ loading ? 'Đang xử lý...' : 'Đăng Nhập' }}
                                </button>
                            </div>
                        </form>
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
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const username = ref('');
const password = ref('');
const errorMessage = ref('');
const loading = ref(false);

async function handleLogin() {
    loading.value = true;
    errorMessage.value = '';
    
    try {
        await authStore.login({ dienThoai: username.value, password: password.value }, 'reader');
        router.push('/'); 
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Đăng nhập thất bại.';
    } finally {
        loading.value = false;
    }
}
</script>
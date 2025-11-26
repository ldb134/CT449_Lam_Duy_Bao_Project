<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-4">
                <div class="card shadow-lg">
                    <div class="card-header bg-dark text-white text-center py-3">
                        <h4 class="mb-0">🔧 Quản Trị Viên</h4>
                    </div>
                    <div class="card-body p-4">
                        <div v-if="errorMessage" class="alert alert-danger">
                            {{ errorMessage }}
                        </div>

                        <form @submit.prevent="handleLogin">
                            <div class="mb-3">
                                <label class="form-label fw-bold">Mã Số Nhân Viên</label>
                                <input 
                                    type="text" 
                                    class="form-control form-control-lg" 
                                    v-model="msnv"
                                    placeholder="Ví dụ: NV001"
                                    required
                                />
                            </div>

                            <div class="mb-4">
                                <label class="form-label fw-bold">Mật khẩu</label>
                                <input 
                                    type="password" 
                                    class="form-control form-control-lg" 
                                    v-model="password"
                                    required
                                />
                            </div>

                            <div class="d-grid">
                                <button class="btn btn-dark btn-lg" type="submit" :disabled="loading">
                                    <font-awesome-icon icon="lock" class="me-2" />
                                    Truy cập hệ thống
                                </button>
                            </div>
                        </form>
                    </div>
                    <div class="card-footer text-center">
                        <small class="text-muted">Hệ thống dành riêng cho nội bộ thư viện</small>
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

const authStore = useAuthStore();
const router = useRouter();

const msnv = ref('');
const password = ref('');
const errorMessage = ref('');
const loading = ref(false);

onMounted(() => {
    authStore.logout(); 
});

async function handleLogin() {
    loading.value = true;
    errorMessage.value = '';
    
    try {
        await authStore.login({ msnv: msnv.value, password: password.value }, 'staff');
        router.push('/staff');
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Đăng nhập thất bại.';
    } finally {
        loading.value = false;
    }
}
</script>
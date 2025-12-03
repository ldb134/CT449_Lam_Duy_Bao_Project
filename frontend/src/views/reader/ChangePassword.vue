<template>
    <div class="card shadow-sm border-0">
        <div class="card-body p-4">
            <h4 class="mb-4 fw-bold text-primary">Đổi Mật Khẩu</h4>
            <form @submit.prevent="handleChangePassword">
                <div class="mb-3">
                    <label class="form-label fw-bold">Mật khẩu hiện tại</label>
                    <input type="password" class="form-control" v-model="formData.oldPassword" required>
                </div>

                <div class="mb-3">
                    <label class="form-label fw-bold">Mật khẩu mới</label>
                    <input type="password" class="form-control" v-model="formData.newPassword" required minlength="6">
                </div>

                <div class="mb-4">
                    <label class="form-label fw-bold">Nhập lại mật khẩu mới</label>
                    <input type="password" class="form-control" v-model="confirmPassword" required>
                    <div v-if="errorMatch" class="text-danger small mt-1">
                        Mật khẩu không khớp!
                    </div>
                </div>

                <div class="d-grid">
                    <button class="btn btn-primary" :disabled="loading || errorMatch">
                        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                        Lưu Thay Đổi
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import AuthService from '@/services/auth.service';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'vue3-toastify';

const router = useRouter();
const authStore = useAuthStore();
const loading = ref(false);
const confirmPassword = ref('');

const formData = reactive({
    oldPassword: '',
    newPassword: ''
});

const errorMatch = computed(() => {
    return formData.newPassword && confirmPassword.value && formData.newPassword !== confirmPassword.value;
});

const handleChangePassword = async () => {
    if (errorMatch.value) return;
    loading.value = true;
    
    try {
        await AuthService.changePassword(formData);
        toast.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.", {
            autoClose: 2500 
        });
        
        authStore.logout(); 
        
        setTimeout(() => {
                router.push('/login');
            }
        , 2500);
        
    } catch (error) {
        toast.error(error.response?.data?.message || "Đổi mật khẩu thất bại.");
    } finally {
        loading.value = false;
    }
};
</script>
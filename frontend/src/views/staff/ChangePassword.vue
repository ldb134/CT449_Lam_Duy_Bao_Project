<template>
    <div class="container-fluid">
        <h2 class="text-primary fw-bold mb-4">
            <font-awesome-icon icon="key" class="me-2" /> Đổi Mật Khẩu
        </h2>

        <div class="row">
            <div class="col-md-6">
                <div class="card shadow-sm border-0">
                    <div class="card-body p-4">
                        <form @submit.prevent="handleChangePassword">
                            <div class="mb-3">
                                <label class="form-label fw-bold">Mật khẩu hiện tại</label>
                                <input type="password" class="form-control" v-model="formData.oldPassword" required>
                            </div>

                            <div class="mb-3">
                                <label class="form-label fw-bold">Mật khẩu mới</label>
                                <input type="password" class="form-control" v-model="formData.newPassword" required minlength="6">
                                <div class="form-text">Tối thiểu 6 ký tự.</div>
                            </div>

                            <div class="mb-4">
                                <label class="form-label fw-bold">Nhập lại mật khẩu mới</label>
                                <input type="password" class="form-control" v-model="confirmPassword" required>
                                <div v-if="errorMatch" class="text-danger small mt-1">
                                    Mật khẩu nhập lại không khớp!
                                </div>
                            </div>

                            <div class="d-grid">
                                <button type="submit" class="btn btn-primary" :disabled="loading || errorMatch">
                                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                                    Lưu Mật Khẩu Mới
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import AuthService from '@/services/auth.service';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const confirmPassword = ref('');

const formData = reactive({
    oldPassword: '',
    newPassword: ''
});

// Kiểm tra nhập lại mật khẩu có khớp không
const errorMatch = computed(() => {
    return formData.newPassword && confirmPassword.value && formData.newPassword !== confirmPassword.value;
});

const handleChangePassword = async () => {
    if (errorMatch.value) return;
    
    loading.value = true;
    try {
        await AuthService.changePassword(formData);
        alert("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
        
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/staff/login');
        
    } catch (error) {
        alert(error.response?.data?.message || "Đổi mật khẩu thất bại.");
    } finally {
        loading.value = false;
    }
};
</script>
<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow border-0">
          <div class="card-header bg-primary text-white text-center py-3">
            <h4 class="mb-0 fw-bold">Đăng Ký Tài Khoản</h4>
          </div>
          <div class="card-body p-4">
            
            <div v-if="errorMessage" class="alert alert-danger">
              {{ errorMessage }}
            </div>

            <form @submit.prevent="handleRegister">
              <div class="row mb-3">
                <div class="col">
                  <label for="hoLot" class="form-label">Họ lót</label>
                  <input type="text" class="form-control" id="hoLot" v-model="formData.hoLot" required>
                </div>
                <div class="col">
                  <label for="ten" class="form-label">Tên</label>
                  <input type="text" class="form-control" id="ten" v-model="formData.ten" required>
                </div>
              </div>

              <div class="mb-3">
                <label for="dienThoai" class="form-label">Số điện thoại</label>
                <input type="tel" class="form-control" id="dienThoai" v-model="formData.dienThoai" required>
              </div>

              <div class="mb-3">
                <label for="diaChi" class="form-label">Địa chỉ</label>
                <input type="text" class="form-control" id="diaChi" v-model="formData.diaChi" required>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Mật khẩu</label>
                <input type="password" class="form-control" id="password" v-model="formData.password" required>
              </div>
              
              <div class="row mb-3">
                <div class="col">
                   <label class="form-label">Giới tính</label>
                   <select class="form-select" v-model="formData.phai" required>
                     <option value="Nam">Nam</option>
                     <option value="Nữ">Nữ</option>
                   </select>
                </div>
                <div class="col">
                   <label class="form-label">Ngày sinh</label>
                   <input type="date" class="form-control" v-model="formData.ngaySinh" required>
                </div>
              </div>

              <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="agreeRules" v-model="agreeRules" required>
                <label class="form-check-label" for="agreeRules">
                  Tôi đồng ý với các <a href="/rules" target="_blank" class="text-decoration-none">Quy định mượn trả sách</a> của thư viện.
                </label>
              </div>

              <button type="submit" class="btn btn-primary w-100 btn-lg" :disabled="loading || !agreeRules">
                {{ loading ? 'Đang đăng ký...' : 'Đăng Ký' }}
              </button>
            </form>

            <div class="text-center mt-4">
                <p class="text-muted small position-relative">
                    <span class="bg-white px-2 position-relative" style="z-index: 1;">--- Hoặc đăng nhập bằng ---</span>
                    <span class="position-absolute top-50 start-0 w-100 border-bottom" style="z-index: 0;"></span>
                </p>
                <div class="d-flex justify-content-center gap-2">
                    <button 
                        type="button" 
                        class="btn btn-outline-danger w-50" 
                        @click="loginGoogle"
                        :disabled="loading"
                    >
                        <font-awesome-icon :icon="['fab', 'google']" class="me-2" /> Google
                    </button>
                </div>
            </div>
          </div>
          <div class="card-footer text-center bg-white py-3">
            <small>Đã có tài khoản? <router-link to="/login" class="fw-bold text-decoration-none">Đăng nhập ngay</router-link></small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import AuthService from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'vue-router';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/config/firebase"; 
import { toast } from 'vue3-toastify';

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const errorMessage = ref('');
const agreeRules = ref(false); 

const formData = reactive({
    hoLot: '',
    ten: '',
    dienThoai: '',
    diaChi: '',
    password: '',
    phai: 'Nam', 
    ngaySinh: ''
});

async function handleRegister() {
    if (!agreeRules.value) {
        errorMessage.value = "Bạn phải đồng ý với quy định thư viện.";
        return;
    }

    loading.value = true;
    errorMessage.value = '';

    try {
        await AuthService.register(formData);
        toast.success("Đăng ký thành công! Đang chuyển hướng...", {
            autoClose: 2000 
        });

        setTimeout(() => {
            router.push('/login');
        }, 2000);
    } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Đăng ký thất bại.");
    } finally {
        loading.value = false;
    }
}

const loginGoogle = async () => {
    loading.value = true;
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
            toast.success("Chào mừng thành viên mới! Vui lòng cập nhật thông tin để hoàn tất hồ sơ.");
            router.push('/profile'); 
        } else {
            router.push('/'); 
        }
        
    } catch (error) {
        console.error(error);
        errorMessage.value = "Lỗi đăng nhập Google: " + error.message;
    } finally {
        loading.value = false;
    }
};
</script>
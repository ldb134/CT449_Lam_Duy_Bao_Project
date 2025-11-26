<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-lg border-0 rounded-lg">
          <div class="card-header bg-primary text-white text-center py-3">
            <h3 class="mb-0 fw-bold">
              <font-awesome-icon icon="user-plus" class="me-2" /> Đăng Ký Tài Khoản
            </h3>
          </div>

          <div class="card-body p-4">
            <div v-if="errorMessage" class="alert alert-danger d-flex align-items-center">
              <font-awesome-icon icon="exclamation-triangle" class="me-2" />
              {{ errorMessage }}
            </div>

            <form @submit.prevent="handleRegister">
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="hoLot" class="form-label fw-bold">Họ lót</label>
                  <input type="text" class="form-control" id="hoLot" v-model="formData.hoLot" required placeholder="Nguyễn">
                </div>
                <div class="col-md-6">
                  <label for="ten" class="form-label fw-bold">Tên</label>
                  <input type="text" class="form-control" id="ten" v-model="formData.ten" required placeholder="Văn A">
                </div>
              </div>

              <div class="mb-3">
                <label for="dienThoai" class="form-label fw-bold">Số điện thoại</label>
                <div class="input-group">
                  <span class="input-group-text bg-light"><font-awesome-icon icon="phone" /></span>
                  <input type="tel" class="form-control" id="dienThoai" v-model="formData.dienThoai" required placeholder="09xxxxxxxxx">
                </div>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label fw-bold">Mật khẩu</label>
                <div class="input-group">
                  <span class="input-group-text bg-light"><font-awesome-icon icon="lock" /></span>
                  <input type="password" class="form-control" id="password" v-model="formData.password" required placeholder="••••••">
                </div>
              </div>

              <div class="mb-3">
                <label for="diaChi" class="form-label fw-bold">Địa chỉ</label>
                <div class="input-group">
                  <span class="input-group-text bg-light"><font-awesome-icon icon="map-marker-alt" /></span>
                  <input type="text" class="form-control" id="diaChi" v-model="formData.diaChi" required placeholder="Số nhà, đường, quận/huyện...">
                </div>
              </div>
              
              <div class="row mb-4">
                <div class="col-md-6">
                   <label class="form-label fw-bold">Giới tính</label>
                   <select class="form-select" v-model="formData.phai" required>
                     <option value="Nam">Nam</option>
                     <option value="Nữ">Nữ</option>
                   </select>
                </div>
                <div class="col-md-6">
                   <label class="form-label fw-bold">Ngày sinh</label>
                   <input type="date" class="form-control" v-model="formData.ngaySinh" required>
                </div>
              </div>

              <div class="d-grid mb-3">
                <button type="submit" class="btn btn-primary btn-lg fw-bold" :disabled="loading">
                  <span v-if="loading && loginMethod === 'register'" class="spinner-border spinner-border-sm me-2"></span>
                  {{ loading && loginMethod === 'register' ? 'Đang xử lý...' : 'Đăng Ký Ngay' }}
                </button>
              </div>
            </form>

            <div class="text-center mt-4">
                <p class="text-muted small position-relative">
                    <span class="bg-white px-2 position-relative" style="z-index: 1;">--- Hoặc đăng ký bằng ---</span>
                    <span class="position-absolute top-50 start-0 w-100 border-bottom" style="z-index: 0;"></span>
                </p>
                <div class="d-grid">
                    <button 
                        type="button" 
                        class="btn btn-outline-danger" 
                        @click="loginGoogle"
                        :disabled="loading"
                    >
                        <font-awesome-icon :icon="['fab', 'google']" class="me-2" /> Google
                    </button>
                </div>
            </div>

          </div>
          
          <div class="card-footer text-center bg-light py-3">
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

// Firebase imports
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/config/firebase"; 

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const errorMessage = ref('');
const loginMethod = ref(''); 

const formData = reactive({
    hoLot: '',
    ten: '',
    dienThoai: '',
    diaChi: '',
    password: '',
    phai: 'Nam', 
    ngaySinh: ''
});

// Xử lý Đăng ký thường
async function handleRegister() {
    loading.value = true;
    loginMethod.value = 'register';
    errorMessage.value = '';

    try {
        await AuthService.register(formData);
        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        router.push('/login');
    } catch (error) {
        console.log(error);
        errorMessage.value = error.response?.data?.message || "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.";
    } finally {
        loading.value = false;
        loginMethod.value = '';
    }
}

// Xử lý Đăng ký bằng Google 
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
            alert("Chào mừng bạn! Vui lòng cập nhật thông tin để hoàn tất đăng ký.");
            router.push('/profile'); 
        } else {
            // Nếu tài khoản đã có rồi thì vào luôn
            router.push('/'); 
        }
        
    } catch (error) {
        console.error(error);
        errorMessage.value = "Lỗi Google: " + error.message;
    } finally {
        loading.value = false;
        loginMethod.value = '';
    }
};
</script>
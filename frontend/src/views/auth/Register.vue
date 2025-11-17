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

              <button type="submit" class="btn btn-primary w-100 btn-lg" :disabled="loading">
                {{ loading ? 'Đang đăng ký...' : 'Đăng Ký' }}
              </button>
            </form>
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
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const errorMessage = ref('');

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
    loading.value = true;
    errorMessage.value = '';

    try {
        await AuthService.register(formData);
        
        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        router.push('/login');
    } catch (error) {
        console.log(error);
        errorMessage.value = error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
    } finally {
        loading.value = false;
    }
}
</script>
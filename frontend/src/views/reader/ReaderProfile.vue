<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-4 mb-4">
        <div class="card shadow-sm border-0">
          <div class="card-body text-center pt-5 pb-4">
            <div class="avatar-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3 fw-bold fs-2">
              {{ getAvatarChar(formData.ten) }}
            </div>
            <h4 class="fw-bold">{{ formData.hoLot }} {{ formData.ten }}</h4>
            <p class="text-muted small">{{ formData.madocgia }}</p>
          </div>
          <div class="list-group list-group-flush">
            <button 
              class="list-group-item list-group-item-action py-3" 
              :class="{ active: activeTab === 'info' }" 
              @click="activeTab = 'info'"
            >
              <font-awesome-icon icon="user" class="me-3" /> Thông tin cá nhân
            </button>
            <button 
              class="list-group-item list-group-item-action py-3" 
              :class="{ active: activeTab === 'history' }" 
              @click="activeTab = 'history'"
            >
              <font-awesome-icon icon="history" class="me-3" /> Lịch sử mượn sách
            </button>
            <button 
              class="list-group-item list-group-item-action py-3" 
              :class="{ active: activeTab === 'password' }" 
              @click="activeTab = 'password'"
            >
              <font-awesome-icon icon="key" class="me-3" /> Đổi mật khẩu
            </button>
          </div>
        </div>
      </div>

      <div class="col-md-8">
        <div class="card shadow-sm border-0 min-h-500">
          <div class="card-body p-4">
            
            <div v-if="activeTab === 'info'">
              <h4 class="mb-4 fw-bold text-primary">Cập nhật thông tin</h4>
              <form @submit.prevent="updateProfile">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-bold">Họ lót</label>
                    <input type="text" class="form-control" v-model="formData.hoLot" required>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-bold">Tên</label>
                    <input type="text" class="form-control" v-model="formData.ten" required>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-bold">Ngày sinh</label>
                    <input type="date" class="form-control" v-model="formData.ngaySinh" required>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-bold">Giới tính</label>
                    <select class="form-select" v-model="formData.phai" required>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-bold">Số điện thoại</label>
                  <input type="tel" class="form-control" v-model="formData.dienThoai" required readonly disabled title="Không thể sửa SĐT">
                  <div class="form-text text-muted">Số điện thoại là tài khoản đăng nhập, không thể thay đổi.</div>
                </div>

                <div class="mb-4">
                  <label class="form-label fw-bold">Địa chỉ</label>
                  <input type="text" class="form-control" v-model="formData.diaChi" required>
                </div>

                <button type="submit" class="btn btn-primary">
                  <font-awesome-icon icon="save" class="me-2" /> Lưu Thay Đổi
                </button>
              </form>
            </div>

            <div v-if="activeTab === 'history'">
               <BorrowHistory />
            </div>

            <div v-if="activeTab === 'password'">
               <ChangePassword />
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import ReaderService from '@/services/reader.service';
import BorrowHistory from './BorrowHistory.vue';
import ChangePassword from './ChangePassword.vue';

const authStore = useAuthStore();
const activeTab = ref('info'); 

const formData = reactive({
  hoLot: '',
  ten: '',
  ngaySinh: '',
  phai: 'Nam',
  diaChi: '',
  dienThoai: '',
  madocgia: ''
});

const getAvatarChar = (name) => {
  return name ? name.charAt(0).toUpperCase() : 'U';
};

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  if (dateString.includes('-')) {
     const [day, month, year] = dateString.split('-');
     return `${year}-${month}-${day}`; 
  }
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

const fetchProfile = async () => {
  if (!authStore.isLoggedIn) return;
  try {
    const data = await ReaderService.get(authStore.user.madocgia);
    
    Object.assign(formData, data);
    
    formData.ngaySinh = formatDateForInput(data.ngaySinh);
    
  } catch (error) {
    console.error("Lỗi tải thông tin:", error);
  }
};

const updateProfile = async () => {
  try {
    await ReaderService.update(formData.madocgia, formData);
    alert("Cập nhật thông tin thành công!");
    
    authStore.user.ten = formData.ten;
    authStore.user.hoTen = `${formData.hoLot} ${formData.ten}`;
    localStorage.setItem("user", JSON.stringify(authStore.user));

  } catch (error) {
    alert("Lỗi cập nhật: " + (error.response?.data?.message || error.message));
  }
};

onMounted(() => {
  fetchProfile();
});
</script>

<style scoped>
.avatar-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
.min-h-500 {
  min-height: 500px;
}
.list-group-item.active {
  background-color: #0d6efd; 
  border-color: #0d6efd;
}
</style>
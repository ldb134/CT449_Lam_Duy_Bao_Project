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

              <div v-if="isMissingInfo" class="alert alert-warning">
                  <font-awesome-icon icon="exclamation-circle" class="me-2"/>
                  Vui lòng cập nhật <strong>Số điện thoại</strong>, <strong>Mật khẩu</strong> và <strong>Địa chỉ</strong> để hoàn tất hồ sơ.
              </div>

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
                  <label class="form-label fw-bold">Email</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    v-model="formData.email" 
                    placeholder="Nhập email để nhận thông báo mượn trả tự động"
                  >
                  <div class="form-text text-muted">Chúng tôi sẽ gửi thông báo mượn/trả sách qua email này.</div>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-bold">Số điện thoại</label>
                  <input 
                    type="tel" 
                    class="form-control" 
                    v-model="formData.dienThoai" 
                    required 
                    :readonly="!isPhoneEmpty" 
                    :disabled="!isPhoneEmpty"
                    :title="!isPhoneEmpty ? 'Liên hệ quản trị viên để đổi SĐT' : 'Nhập SĐT của bạn'"
                  >
                  <div class="form-text text-muted" v-if="!isPhoneEmpty">
                    Số điện thoại là tài khoản đăng nhập, không thể thay đổi.
                  </div>
                </div>

                <div class="mb-3" v-if="isPhoneEmpty">
                  <label class="form-label fw-bold text-primary">Tạo mật khẩu đăng nhập</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    v-model="formData.password" 
                    required 
                    placeholder="Nhập mật khẩu để dùng cho lần đăng nhập sau"
                    minlength="6"
                  >
                  <div class="form-text text-muted">Mật khẩu này dùng để đăng nhập bằng Số điện thoại.</div>
                </div>

                <div class="mb-4">
                  <label class="form-label fw-bold">Địa chỉ</label>
                  <input type="text" class="form-control" v-model="formData.diaChi" required>
                </div>

                <div class="mb-3 form-check" v-if="isPhoneEmpty">
                    <input type="checkbox" class="form-check-input" id="profileAgreeRules" v-model="agreeRules">
                    <label class="form-check-label" for="profileAgreeRules">
                        Tôi đồng ý với các <a href="/rules" target="_blank" class="text-decoration-none">Quy định mượn trả sách</a> của thư viện.
                    </label>
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
import { ref, reactive, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import ReaderService from '@/services/reader.service';
import BorrowHistory from './BorrowHistory.vue';
import ChangePassword from './ChangePassword.vue';
import { toast } from 'vue3-toastify';

const authStore = useAuthStore();
const activeTab = ref('info'); 

const formData = reactive({
  hoLot: '',
  ten: '',
  ngaySinh: '',
  phai: 'Nam',
  diaChi: '',
  dienThoai: '',
  email: '', 
  madocgia: '',
  password: '' 
});

const isPhoneEmpty = ref(false);
const agreeRules = ref(false); 

const isMissingInfo = computed(() => {
    return !formData.dienThoai || !formData.diaChi;
});

const getAvatarChar = (name) => {
  return name ? name.charAt(0).toUpperCase() : 'U';
};

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toISOString().split('T')[0];
};

const fetchProfile = async () => {
  if (!authStore.isLoggedIn) return;
  try {
    const data = await ReaderService.get(authStore.user.madocgia);
    
    Object.assign(formData, data);
    // Reset password field
    formData.password = ''; 
    
    if (data.ngaySinh) {
        formData.ngaySinh = formatDateForInput(data.ngaySinh);
    }

    // Kiểm tra nếu SĐT chưa có
    if (!formData.dienThoai) {
        isPhoneEmpty.value = true;
    }
    
  } catch (error) {
    console.error("Lỗi tải thông tin:", error);
    toast.error("Không thể tải thông tin cá nhân.");
  }
};

const updateProfile = async () => {
  try {
    if (isPhoneEmpty.value && !agreeRules.value) {
        toast.warning("Bạn cần đồng ý với quy định mượn trả để tiếp tục!");
        return;
    }
    
    await ReaderService.update(formData.madocgia, formData);
    toast.success("Cập nhật thông tin thành công!");
    
    authStore.user.ten = formData.ten;
    authStore.user.hoTen = `${formData.hoLot} ${formData.ten}`;
    authStore.user.dienThoai = formData.dienThoai; 
    authStore.user.diaChi = formData.diaChi;    
    
    localStorage.setItem("user", JSON.stringify(authStore.user));

    if (formData.dienThoai) {
        isPhoneEmpty.value = false;
    }
    formData.password = ''; 

  } catch (error) {
    toast.error("Lỗi cập nhật: " + (error.response?.data?.message || error.message));
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
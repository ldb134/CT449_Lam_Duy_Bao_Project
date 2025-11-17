<template>
    <div class="container-fluid">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="text-primary fw-bold">
                <font-awesome-icon icon="user-tie" class="me-2" /> Quản Lý Nhân Viên
            </h2>
            <button class="btn btn-primary" @click="openAddModal">
                <font-awesome-icon icon="plus" /> Thêm Nhân Viên
            </button>
        </div>

        <div class="card shadow-sm border-0">
            <div class="card-body p-0">
                <table class="table table-hover mb-0 align-middle">
                    <thead class="table-light">
                        <tr>
                            <th class="ps-4">MSNV</th>
                            <th>Họ Tên</th>
                            <th>Chức Vụ</th>
                            <th>Liên Hệ</th>
                            <th class="text-end pe-4">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="staff in staffList" :key="staff._id">
                            <td class="ps-4 fw-bold text-secondary">{{ staff.msnv }}</td>
                            <td>
                                <span class="fw-bold text-primary">{{ staff.hoTenNV }}</span>
                                <br><small class="text-muted">{{ staff.diaChi }}</small>
                            </td>
                            <td>
                                <span v-if="staff.chucVu === 'QuanLy'" class="badge bg-danger">Quản Lý</span>
                                <span v-else class="badge bg-info text-dark">Thủ Thư</span>
                            </td>
                            <td>{{ staff.soDienThoai }}</td>
                            <td class="text-end pe-4">
                                <button class="btn btn-sm btn-outline-danger" @click="deleteStaff(staff)" title="Xóa">
                                    <font-awesome-icon icon="trash" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-if="showModal" class="modal-backdrop fade show"></div>
        <div v-if="showModal" class="modal fade show d-block" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title fw-bold">Thêm Nhân Viên Mới</h5>
                        <button type="button" class="btn-close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="handleSave">
                            <div class="mb-3">
                                <label class="form-label fw-bold">Họ và Tên</label>
                                <input type="text" class="form-control" v-model="formData.hoTenNV" required>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label fw-bold">Chức Vụ</label>
                                    <select class="form-select" v-model="formData.chucVu" required>
                                        <option value="ThuThu">Thủ Thư</option>
                                        <option value="QuanLy">Quản Lý</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label fw-bold">Số Điện Thoại</label>
                                    <input type="tel" class="form-control" v-model="formData.soDienThoai" required>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label fw-bold">Địa Chỉ</label>
                                <input type="text" class="form-control" v-model="formData.diaChi">
                            </div>

                            <div class="mb-3">
                                <label class="form-label fw-bold text-danger">Mật Khẩu Đăng Nhập</label>
                                <input type="password" class="form-control" v-model="formData.password" required placeholder="Nhập mật khẩu cho nhân viên này">
                            </div>

                            <div class="text-end">
                                <button type="button" class="btn btn-secondary me-2" @click="closeModal">Hủy</button>
                                <button type="submit" class="btn btn-primary">
                                    <font-awesome-icon icon="save" class="me-1" /> Tạo Tài Khoản
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
import { ref, onMounted, reactive } from 'vue';
import StaffService from '@/services/staff.service';

const staffList = ref([]);
const showModal = ref(false);

const formData = reactive({
    hoTenNV: '',
    chucVu: 'ThuThu',
    diaChi: '',
    soDienThoai: '',
    password: ''
});

const fetchData = async () => {
    try {
        staffList.value = await StaffService.getAll();
    } catch (error) {
        console.error(error);
    }
};

const openAddModal = () => {
    // Reset form
    formData.hoTenNV = '';
    formData.chucVu = 'ThuThu';
    formData.diaChi = '';
    formData.soDienThoai = '';
    formData.password = '';
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

const handleSave = async () => {
    try {
        await StaffService.create(formData);
        alert("Tạo tài khoản thành công!");
        closeModal();
        fetchData();
    } catch (error) {
        alert("Lỗi: " + (error.response?.data?.message || error.message));
    }
};

const deleteStaff = async (staff) => {
    if (!confirm(`Bạn có chắc muốn xóa nhân viên "${staff.hoTenNV}"?`)) return;
    try {
        await StaffService.delete(staff.msnv);
        alert("Đã xóa nhân viên!");
        fetchData();
    } catch (error) {
        console.log(error)
        alert("Lỗi khi xóa!");
    }
};

onMounted(() => {
    fetchData();
});
</script>
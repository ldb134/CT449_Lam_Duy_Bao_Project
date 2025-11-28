<template>
    <div class="container-fluid">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="text-primary fw-bold">
                <font-awesome-icon icon="building" class="me-2" /> Quản Lý Nhà Xuất Bản
            </h2>
            <div>
                <button class="btn btn-outline-secondary me-2" @click="refreshData">
                    <font-awesome-icon icon="sync" /> Làm mới
                </button>
                <button class="btn btn-primary" @click="openAddModal">
                    <font-awesome-icon icon="plus" /> Thêm NXB Mới
                </button>
            </div>
        </div>

        <div class="card shadow-sm border-0">
            <div class="card-body p-0">
                <table class="table table-hover mb-0 align-middle">
                    <thead class="table-light">
                        <tr>
                            <th class="ps-4 text-nowrap">Mã NXB</th>
                            <th style="min-width: 200px;">Tên Nhà Xuất Bản</th>
                            <th style="min-width: 250px;">Liên Hệ</th> 
                            <th>Địa Chỉ</th>
                            <th class="text-end pe-4 text-nowrap">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="pub in publishers" :key="pub._id">
                            <td class="ps-4 fw-bold text-secondary">{{ pub.manxb }}</td>
                            <td class="fw-bold text-primary">{{ pub.tenNXB }}</td>
                            <td>
                                <div v-if="pub.email" class="small text-muted">
                                    <font-awesome-icon icon="envelope" class="me-1" /> {{ pub.email }}
                                </div>
                                <div v-if="pub.dienThoai" class="small text-muted">
                                    <font-awesome-icon icon="phone" class="me-1" /> {{ pub.dienThoai }}
                                </div>
                                <span v-if="!pub.email && !pub.dienThoai" class="text-muted small fst-italic">---</span>
                            </td>
                            <td>{{ pub.diaChi }}</td>
                            <td class="text-end pe-4">
                                <button class="btn btn-sm btn-outline-warning me-2" @click="openEditModal(pub)" title="Sửa">
                                    <font-awesome-icon icon="edit" />
                                </button>
                                <button class="btn btn-sm btn-outline-danger" @click="deletePublisher(pub)" title="Xóa">
                                    <font-awesome-icon icon="trash" />
                                </button>
                            </td>
                        </tr>
                        <tr v-if="publishers.length === 0">
                            <td colspan="5" class="text-center py-4 text-muted">Chưa có dữ liệu.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="card-footer bg-white border-top-0 d-flex justify-content-end py-3">
                <Pagination 
                    :current-page="currentPage" 
                    :total-pages="totalPages" 
                    @change-page="changePage" 
                />
            </div>
        </div>

        <div v-if="showModal" class="modal-backdrop fade show"></div>
        <div v-if="showModal" class="modal fade show d-block" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title fw-bold">{{ isEditing ? 'Cập Nhật NXB' : 'Thêm NXB Mới' }}</h5>
                        <button type="button" class="btn-close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="handleSave">
                            <div class="mb-3">
                                <label class="form-label fw-bold">Tên Nhà Xuất Bản</label>
                                <input type="text" class="form-control" v-model="formData.tenNXB" required>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label fw-bold">Email</label>
                                    <input type="email" class="form-control" v-model="formData.email" placeholder="contact@nxb.com">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label fw-bold">Số Điện Thoại</label>
                                    <input type="tel" class="form-control" v-model="formData.dienThoai" placeholder="028 38...">
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold">Địa Chỉ</label>
                                <input type="text" class="form-control" v-model="formData.diaChi" required>
                            </div>
                            <div class="text-end">
                                <button type="button" class="btn btn-secondary me-2" @click="closeModal">Hủy</button>
                                <button type="submit" class="btn btn-primary">
                                    <font-awesome-icon icon="save" class="me-1" /> Lưu
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
import PublisherService from '@/services/publisher.service';
import Pagination from '@/components/Pagination.vue'; 

const publishers = ref([]);
const showModal = ref(false);
const isEditing = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);

const formData = reactive({
    manxb: '', tenNXB: '', diaChi: '', email: '', dienThoai: ''
});

const fetchData = async () => {
    try {
        const res = await PublisherService.getAll({ page: currentPage.value, limit: 10 });
        publishers.value = res.publishers || [];
        totalPages.value = res.totalPages || 1;
        currentPage.value = res.currentPage || 1;
    } catch (error) {
        console.error(error);
    }
};

const changePage = (page) => {
    currentPage.value = page;
    fetchData();
};

const refreshData = () => {
    currentPage.value = 1;  
    fetchData();             
};

const openAddModal = () => {
    isEditing.value = false;
    Object.assign(formData, { manxb: '', tenNXB: '', diaChi: '', email: '', dienThoai: '' });
    showModal.value = true;
};

const openEditModal = (pub) => {
    isEditing.value = true;
    Object.assign(formData, pub);
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

const handleSave = async () => {
    try {
        if (isEditing.value) {
            await PublisherService.update(formData.manxb, formData);
            alert("Cập nhật thành công!");
        } else {
            await PublisherService.create(formData);
            alert("Thêm mới thành công!");
        }
        closeModal();
        fetchData();
    } catch (error) {
        alert("Lỗi: " + (error.response?.data?.message || error.message));
    }
};

const deletePublisher = async (pub) => {
    if (!confirm(`Bạn có chắc muốn xóa NXB "${pub.tenNXB}"?`)) return;
    try {
        await PublisherService.delete(pub.manxb);
        alert("Đã xóa NXB!");
        fetchData();
    } catch (error) {
        console.log(error);
        alert("Lỗi khi xóa! Có thể NXB này đang có sách.");
    }
};

onMounted(() => {
    fetchData();
});
</script>
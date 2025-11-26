<template>
    <div class="container-fluid">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="text-primary fw-bold">
                <font-awesome-icon icon="building" class="me-2" /> Quản Lý Nhà Xuất Bản
            </h2>
            <div>
                <button class="btn btn-outline-secondary me-2" @click="fetchData">
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
                            <th class="ps-4">Mã NXB</th>
                            <th>Tên Nhà Xuất Bản</th>
                            <th>Địa Chỉ</th>
                            <th class="text-end pe-4">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="pub in publishers" :key="pub._id">
                            <td class="ps-4 fw-bold text-secondary">{{ pub.manxb }}</td>
                            <td class="fw-bold text-primary">{{ pub.tenNXB }}</td>
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
                            <td colspan="4" class="text-center py-4 text-muted">Chưa có dữ liệu nhà xuất bản.</td>
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
                        <h5 class="modal-title fw-bold">{{ isEditing ? 'Cập Nhật NXB' : 'Thêm NXB Mới' }}</h5>
                        <button type="button" class="btn-close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="handleSave">
                            <div class="mb-3">
                                <label class="form-label fw-bold">Tên Nhà Xuất Bản</label>
                                <input type="text" class="form-control" v-model="formData.tenNXB" required>
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

const publishers = ref([]);
const showModal = ref(false);
const isEditing = ref(false);

const formData = reactive({
    manxb: '', 
    tenNXB: '',
    diaChi: ''
});

const fetchData = async () => {
    try {
        publishers.value = await PublisherService.getAll();
    } catch (error) {
        console.error(error);
    }
};

const openAddModal = () => {
    isEditing.value = false;
    formData.tenNXB = '';
    formData.diaChi = '';
    formData.manxb = '';
    showModal.value = true;
};

const openEditModal = (pub) => {
    isEditing.value = true;
    formData.manxb = pub.manxb;
    formData.tenNXB = pub.tenNXB;
    formData.diaChi = pub.diaChi;
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
    if (!confirm(`Bạn có chắc muốn xóa NXB "${pub.tenNXB}"?\nLưu ý: Nếu NXB này đã có sách, việc xóa có thể gây lỗi hiển thị sách.`)) return;
    try {
        await PublisherService.delete(pub.manxb);
        alert("Đã xóa NXB!");
        fetchData();
    } catch (error) {
        console.log(error);
        alert("Lỗi khi xóa!");
    }
};

onMounted(() => {
    fetchData();
});
</script>
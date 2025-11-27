<template>
    <form @submit.prevent="submitBook" enctype="multipart/form-data">
        <div class="row">
            <div class="col-md-8">
                <div class="mb-3">
                    <label class="form-label fw-bold">Tên Sách</label>
                    <input type="text" class="form-control" v-model="bookLocal.tenSach" required>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label fw-bold">Tác Giả</label>
                        <input type="text" class="form-control" v-model="bookLocal.tacGia" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label fw-bold">Nhà Xuất Bản</label>
                        <select class="form-select" v-model="bookLocal.manxb" required>
                            <option value="" disabled>-- Chọn NXB --</option>
                            <option v-for="pub in publishers" :key="pub.manxb" :value="pub.manxb">
                                {{ pub.tenNXB }}
                            </option>
                        </select>
                    </div>
                </div>
                 <div class="row">
                    <div class="col-md-4 mb-3">
                        <label class="form-label fw-bold">Đơn Giá</label>
                        <input type="number" class="form-control" v-model="bookLocal.donGia" required min="0">
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label fw-bold">Số Quyển</label>
                        <input type="number" class="form-control" v-model="bookLocal.soQuyen" required min="0">
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label fw-bold">Năm XB</label>
                        <input type="number" class="form-control" v-model="bookLocal.namXuatBan" required>
                    </div>
                </div>
            </div>

            <div class="col-md-4">
                <div class="mb-3">
                    <label class="form-label fw-bold">Ảnh Bìa</label>
                    <input type="file" class="form-control" @change="handleFileUpload" accept="image/*">
                </div>
                
                <div class="card border-0 shadow-sm bg-light d-flex align-items-center justify-content-center" style="height: 250px; overflow: hidden;">
                    <img v-if="previewImage" :src="previewImage" class="img-fluid" style="max-height: 100%;" alt="Preview">
                    <span v-else class="text-muted">Chưa có ảnh</span>
                </div>
            </div>
        </div>

        <div class="mt-3 text-end">
            <button type="button" class="btn btn-secondary me-2" @click="$emit('cancel')">Hủy</button>
            <button type="submit" class="btn btn-primary">
                <font-awesome-icon icon="save" class="me-1" /> Lưu Sách
            </button>
        </div>
    </form>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import PublisherService from '@/services/publisher.service';

const API_URL = 'http://localhost:3000'; 

const props = defineProps({
    book: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['submit:book', 'cancel']);

const bookLocal = ref({});
const publishers = ref([]);
const selectedFile = ref(null); 
const previewImage = ref('');   

watch(() => props.book, (newVal) => {
    bookLocal.value = { ...newVal };
    if (newVal.anh) {
        if (newVal.anh.startsWith('http')) {
             previewImage.value = newVal.anh;
        } else {
             previewImage.value = `${API_URL}${newVal.anh}`;
        }
    } else {
        previewImage.value = '';
    }
    selectedFile.value = null; 
}, { immediate: true });

const fetchPublishers = async () => {
    try {
        publishers.value = await PublisherService.getAll();
    } catch (error) {
        console.error(error);
    }
};

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        selectedFile.value = file;
        previewImage.value = URL.createObjectURL(file);
    }
};

const submitBook = () => {
    const formData = new FormData();
    
    formData.append('tenSach', bookLocal.value.tenSach);
    formData.append('tacGia', bookLocal.value.tacGia);
    formData.append('manxb', bookLocal.value.manxb);
    formData.append('donGia', bookLocal.value.donGia);
    formData.append('soQuyen', bookLocal.value.soQuyen);
    formData.append('namXuatBan', bookLocal.value.namXuatBan);
    if (bookLocal.value.masach) {
         formData.append('masach', bookLocal.value.masach);
    }

    if (selectedFile.value) {
        formData.append('anh', selectedFile.value);
    }

    emit('submit:book', formData);
};

onMounted(() => {
    fetchPublishers();
});
</script>
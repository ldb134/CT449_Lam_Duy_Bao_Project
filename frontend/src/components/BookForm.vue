<template>
    <form @submit.prevent="submitBook">
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
                    <label class="form-label fw-bold">Link Ảnh Bìa</label>
                    <input type="url" class="form-control" v-model="bookLocal.anh" placeholder="https://...">
                </div>
                <div class="card border-0 shadow-sm bg-light d-flex align-items-center justify-content-center" style="height: 250px;">
                    <img v-if="bookLocal.anh" :src="bookLocal.anh" class="img-fluid" style="max-height: 100%;" alt="Preview" @error="setDefaultImage">
                    <span v-else class="text-muted">Xem trước ảnh</span>
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

const props = defineProps({
    book: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['submit:book', 'cancel']);

const bookLocal = ref({});
const publishers = ref([]);

watch(() => props.book, (newVal) => {
    bookLocal.value = { ...newVal };
    if (!bookLocal.value.anh) bookLocal.value.anh = '';
}, { immediate: true });

const fetchPublishers = async () => {
    try {
        publishers.value = await PublisherService.getAll();
    } catch (error) {
        console.error(error);
    }
};

const submitBook = () => {
    emit('submit:book', bookLocal.value);
};

const setDefaultImage = (e) => {
    e.target.src = 'https://fastly.picsum.photos/id/173/200/300.jpg?hmac=9Ed5HxHOL3tFCOiW6UHx6a3hVksxDWc7L7p_WzN9N9Q'; //ảnh test
};

onMounted(() => {
    fetchPublishers();
});
</script>
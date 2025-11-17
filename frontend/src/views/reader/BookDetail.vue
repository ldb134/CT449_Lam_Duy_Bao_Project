<template>
    <div class="container mt-5">
        <button @click="$router.back()" class="btn btn-outline-secondary mb-4">
            <font-awesome-icon icon="arrow-left" class="me-2" /> Quay lại
        </button>

        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2">Đang tải thông tin sách...</p>
        </div>

        <div v-else-if="book" class="row shadow-sm p-4 bg-white rounded">
            <div class="col-md-4 text-center mb-4 mb-md-0">
                <div class="book-cover-wrapper bg-light rounded p-3">
                    <img 
                        :src="book.anh" 
                        :alt="book.tenSach" 
                        class="img-fluid rounded shadow" 
                        style="max-height: 450px; object-fit: contain;"
                        @error="setDefaultImage"
                    >
                </div>
            </div>

            <div class="col-md-8">
                <h2 class="fw-bold text-primary mb-1">{{ book.tenSach }}</h2>
                <p class="text-muted fst-italic mb-3">
                    <font-awesome-icon icon="pen-nib" class="me-1" /> Tác giả: {{ book.tacGia }}
                </p>

                <div class="badge bg-info text-dark mb-3 fs-6">
                    Mã sách: {{ book.masach }}
                </div>

                <h3 class="text-danger fw-bold mb-4">
                    {{ formatPrice(book.donGia) }}
                </h3>

                <div class="card bg-light border-0 mb-4">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-6 mb-2">
                                <strong>Năm xuất bản:</strong> {{ book.namXuatBan }}
                            </div>
                            <div class="col-6 mb-2">
                                <strong>Nhà xuất bản:</strong> {{ book.manxb }}
                                </div>
                            <div class="col-6">
                                <strong>Tình trạng:</strong> 
                                <span :class="book.soQuyen > 0 ? 'text-success' : 'text-danger'">
                                    {{ book.soQuyen > 0 ? 'Còn hàng' : 'Hết hàng' }}
                                </span>
                            </div>
                            <div class="col-6">
                                <strong>Số lượng kho:</strong> {{ book.soQuyen }}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="d-flex gap-3">
                    <button 
                        class="btn btn-success btn-lg flex-grow-1" 
                        :disabled="book.soQuyen <= 0"
                        @click="borrowBook"
                    >
                        <font-awesome-icon icon="plus-circle" class="me-2" />
                        {{ book.soQuyen > 0 ? 'Mượn Sách Ngay' : 'Tạm Hết Hàng' }}
                    </button>
                </div>
            </div>
        </div>

        <div v-else class="alert alert-warning text-center">
            Không tìm thấy thông tin cuốn sách này.
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BookService from '@/services/book.service';
import BorrowingService from '@/services/borrowing.service';
import { useAuthStore } from '@/stores/auth.store';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const book = ref(null);
const loading = ref(false);

const fetchBookDetail = async () => {
    loading.value = true;
    try {
        const id = route.params.id; 
        book.value = await BookService.get(id);
    } catch (error) {
        console.error("Lỗi:", error);
    } finally {
        loading.value = false;
    }
};

const borrowBook = async () => {
    if (!authStore.isLoggedIn) {
        alert("Bạn cần đăng nhập để mượn sách!");
        router.push('/login');
        return;
    }
    
    if (confirm(`Gửi yêu cầu mượn cuốn "${book.value.tenSach}"?`)) {
        try {
            await BorrowingService.create({
                madocgia: authStore.user.madocgia,
                masach: book.value.masach
            });
            alert("Gửi yêu cầu thành công! Vui lòng chờ duyệt.");
        } catch (error) {
            alert(error.response?.data?.message || "Lỗi khi mượn sách.");
        }
    }
};

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const setDefaultImage = (e) => {
    e.target.src = 'https://fastly.picsum.photos/id/173/200/300.jpg?hmac=9Ed5HxHOL3tFCOiW6UHx6a3hVksxDWc7L7p_WzN9N9Q';
};

onMounted(() => {
    fetchBookDetail();
});
</script>
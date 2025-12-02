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
                <div class="bg-light rounded p-3 h-100 d-flex align-items-center justify-content-center">
                    <img 
                        :src="getImageUrl(book.anh)" 
                        :alt="book.tenSach" 
                        class="img-fluid rounded shadow" 
                        style="max-height: 450px; object-fit: contain;"
                        @error="setDefaultImage"
                    >
                </div>
            </div>

            <div class="col-md-8">
                <h2 class="fw-bold text-primary mb-2">{{ book.tenSach }}</h2>
                
                <div class="d-flex align-items-center mb-3">
                    <span class="badge bg-info text-dark me-2">
                        <font-awesome-icon icon="barcode" class="me-1" /> {{ book.masach }}
                    </span>
                    <span class="text-muted fst-italic">
                        <font-awesome-icon icon="pen-nib" class="me-1" /> Tác giả: {{ book.tacGia }}
                    </span>
                </div>

                <div class="card bg-light border-0 mb-4">
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-sm-6">
                                <strong><font-awesome-icon icon="calendar-alt" class="me-1" /> Năm xuất bản:</strong> {{ book.namXuatBan }}
                            </div>
                            <div class="col-sm-6">
                                <strong><font-awesome-icon icon="building" class="me-1" /> Nhà xuất bản:</strong> 
                                {{ getPublisherName(book.manxb) }}
                            </div>
                            
                            <div class="col-sm-6">
                                <strong><font-awesome-icon icon="check-circle" class="me-1" /> Trạng thái:</strong> 
                                <span :class="book.soQuyen > 0 ? 'text-success fw-bold' : 'text-danger fw-bold'">
                                    {{ book.soQuyen > 0 ? 'Có thể mượn' : 'Không thể mượn' }}
                                </span>
                            </div>
                            
                            <div class="col-sm-6">
                                <strong><font-awesome-icon icon="layer-group" class="me-1" /> Số lượng kho:</strong> {{ book.soQuyen }}
                            </div>

                            <div class="col-sm-6">
                                <strong><font-awesome-icon icon="tag" class="me-1" /> Giá bìa:</strong> 
                                <span class="text-muted">{{ formatPrice(book.donGia) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="d-grid gap-2 d-md-block">
                    <button 
                        class="btn btn-success btn-lg px-5" 
                        :disabled="book.soQuyen <= 0"
                        @click="openBorrowModal"
                    >
                        <font-awesome-icon icon="file-import" class="me-2" />
                        {{ book.soQuyen > 0 ? 'Mượn Sách Ngay' : 'Tạm Hết Hàng' }}
                    </button>
                </div>
            </div>
        </div>

        <div v-else class="alert alert-warning text-center mt-5">
            <h3><font-awesome-icon icon="exclamation-triangle" class="me-2" /> Không tìm thấy thông tin cuốn sách này.</h3>
            <router-link to="/" class="btn btn-primary mt-3">Về trang chủ</router-link>
        </div>

        <BorrowModal 
            :isVisible="showBorrowModal" 
            :book="book" 
            @close="showBorrowModal = false"
            @confirm="handleBorrowConfirm"
        />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BookService from '@/services/book.service';
import BorrowingService from '@/services/borrowing.service';
import PublisherService from '@/services/publisher.service'; 
import BorrowModal from '@/components/BorrowModal.vue'; 
import { useAuthStore } from '@/stores/auth.store';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const book = ref(null);
const publishers = ref([]); 
const loading = ref(false);
const showBorrowModal = ref(false); 

const formatPrice = (price) => {
    if (price === 0) {
        return "Sách Nhà Nước đặt hàng";
    }
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const API_URL = import.meta.env.VITE_API_URL; 

const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://fastly.picsum.photos/id/173/200/300.jpg?hmac=9Ed5HxHOL3tFCOiW6UHx6a3hVksxDWc7L7p_WzN9N9Q';
    if (imagePath.startsWith('http')) return imagePath; 
    return `${API_URL}${imagePath}`; 
}

const setDefaultImage = (e) => {
    e.target.src = 'https://fastly.picsum.photos/id/173/200/300.jpg?hmac=9Ed5HxHOL3tFCOiW6UHx6a3hVksxDWc7L7p_WzN9N9Q';
};

const getPublisherName = (manxb) => {
    const pub = publishers.value.find(p => p.manxb === manxb);
    return pub ? pub.tenNXB : manxb; 
};

const fetchData = async () => {
    loading.value = true;
    try {
        const id = route.params.id;
        const [bookData, publisherData] = await Promise.all([
            BookService.get(id),
            PublisherService.getAll()
        ]);
        book.value = bookData;
        publishers.value = publisherData;
    } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
    } finally {
        loading.value = false;
    }
};

const openBorrowModal = () => {
    if (!authStore.isLoggedIn) {
        alert("Bạn cần đăng nhập để mượn sách!");
        router.push('/login');
        return;
    }
    if (!authStore.user.dienThoai || !authStore.user.diaChi) {
        if(confirm("Bạn cần hoàn tất hồ sơ (SĐT, Địa chỉ) và đồng ý quy định trước khi mượn sách. Đi đến trang hồ sơ ngay?")) {
            router.push('/profile');
        }
        return;
    }
    showBorrowModal.value = true;
};

const handleBorrowConfirm = async (date) => {
    try {
        const borrowData = {
            madocgia: authStore.user.madocgia,
            masach: book.value.masach,
            ngayHenLay: date
        };

        await BorrowingService.create(borrowData);
        alert("Gửi yêu cầu thành công! Vui lòng đến nhận sách đúng hẹn.");
        showBorrowModal.value = false; 

    } catch (error) {
        alert(error.response?.data?.message || "Lỗi khi mượn sách.");
    }
};

onMounted(() => {
    fetchData();
});
</script>
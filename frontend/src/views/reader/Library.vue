<template>
  <div class="container mt-4">
    <h2 class="fw-bold text-primary mb-4">
        <font-awesome-icon icon="book-open" class="me-2" /> Kho Sách Thư Viện
    </h2>
    
    <div class="row">
      <div class="col-md-3 mb-4">
        <div class="card shadow-sm border-0 mb-4">
          <div class="card-header bg-white py-3">
            <h5 class="mb-0 text-primary fw-bold">
              <font-awesome-icon icon="filter" class="me-2" /> Nhà Xuất Bản
            </h5>
          </div>
          <div class="list-group list-group-flush">
            <button 
              class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              :class="{ 'active': selectedNXB === '' }"
              @click="changeFilter('nxb', '')"
            >
              <span>Tất cả</span>
            </button>
            <button 
              v-for="pub in publishers" :key="pub._id"
              class="list-group-item list-group-item-action"
              :class="{ 'active': selectedNXB === pub.manxb }"
              @click="changeFilter('nxb', pub.manxb)"
            >
              {{ pub.tenNXB }}
            </button>
          </div>
        </div>

        <div class="card shadow-sm border-0">
          <div class="card-header bg-white py-3">
            <h5 class="mb-0 text-primary fw-bold">
              <font-awesome-icon icon="calendar-alt" class="me-2" /> Năm Xuất Bản
            </h5>
          </div>
          <div class="p-3">
              <select class="form-select" v-model="selectedYear" @change="changeFilter('year', selectedYear)">
                  <option value="">-- Tất cả các năm --</option>
                  <option v-for="year in availableYears" :key="year" :value="year">Năm {{ year }}</option>
              </select>
          </div>
        </div>
      </div>

      <div class="col-md-9">
        <div class="d-flex justify-content-between align-items-center mb-4">
           <div class="input-group w-100 shadow-sm">
              <input 
                type="text" 
                class="form-control border-end-0" 
                placeholder="Tìm tên sách, tác giả..." 
                v-model="searchText"
                @keyup.enter="fetchData" 
              >
              <button class="btn bg-white border-start-0 border" @click="fetchData">
                  <font-awesome-icon icon="search" class="text-muted"/>
              </button>
           </div>
        </div>

        <div v-if="selectedNXB || selectedYear" class="mb-3">
            <span class="text-muted me-2">Đang lọc:</span>
            <span v-if="selectedNXB" class="badge bg-primary me-2 p-2">
                NXB: {{ getPublisherName(selectedNXB) }} 
                <font-awesome-icon icon="times" class="ms-2 cursor-pointer" @click="changeFilter('nxb', '')" />
            </span>
            <span v-if="selectedYear" class="badge bg-info text-dark p-2">
                Năm: {{ selectedYear }}
                <font-awesome-icon icon="times" class="ms-2 cursor-pointer" @click="changeFilter('year', '')" />
            </span>
        </div>

        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
        </div>

        <div v-else>
            <div v-if="books.length === 0" class="col-12 text-center py-5 text-muted bg-light rounded">
                <font-awesome-icon icon="box-open" size="4x" class="mb-3 opacity-50" />
                <h5>Không tìm thấy cuốn sách nào phù hợp.</h5>
            </div>

            <div class="row">
                <div class="col-md-4 mb-4" v-for="book in books" :key="book._id">
                    <div class="card h-100 shadow-sm border-0 book-card">
                        <div class="card-body text-center d-flex flex-column cursor-pointer p-3" @click="goToDetail(book.masach)">
                            <div class="image-container mb-3 position-relative rounded overflow-hidden">
                                <img :src="getImageUrl(book.anh)" class="book-cover" @error="setDefaultImage">
                                <span class="position-absolute top-0 end-0 badge m-2 shadow-sm" 
                                    :class="book.soQuyen > 0 ? 'bg-success' : 'bg-secondary'">
                                    <small>{{ book.soQuyen > 0 ? 'Có thể mượn' : 'Không thể mượn' }}</small>
                                </span>
                            </div>
                            <h6 class="card-title fw-bold text-truncate text-dark mb-1" :title="book.tenSach">{{ book.tenSach }}</h6>
                            <p class="card-text text-muted small mb-1">{{ book.tacGia }}</p>
                            <div class="mt-auto">
                                <small class="text-muted"><font-awesome-icon icon="tag" class="me-1"/> Giá bìa: {{ formatPrice(book.donGia) }}</small>
                            </div>
                        </div>
                        <div class="card-footer bg-white border-top-0 p-3 pt-0 mt-2">
                            <button class="btn w-100 rounded-pill fw-bold shadow-sm btn-borrow btn-outline-primary" @click="openBorrowModal(book)">
                                <font-awesome-icon icon="file-import" class="me-2" /> Mượn Ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Pagination 
                :current-page="currentPage" 
                :total-pages="totalPages" 
                @change-page="changePage"
            />
        </div>
      </div>
    </div>

    <BorrowModal :isVisible="showBorrowModal" :book="selectedBook" @close="showBorrowModal = false" @confirm="handleBorrowConfirm"/>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import BookService from '@/services/book.service';
import PublisherService from '@/services/publisher.service'; 
import BorrowingService from '@/services/borrowing.service'; 
import BorrowModal from '@/components/BorrowModal.vue'; 
import Pagination from '@/components/Pagination.vue'; 
import { useRouter, useRoute } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const books = ref([]);
const publishers = ref([]);
const loading = ref(false);
const showBorrowModal = ref(false);
const selectedBook = ref(null);

const currentPage = ref(1);
const totalPages = ref(1);
const selectedNXB = ref('');
const selectedYear = ref('');
const searchText = ref('');

const availableYears = [2020, 2021, 2022, 2023, 2024, 2025];

const fetchData = async () => {
    loading.value = true;
    try {
        const params = {
            page: currentPage.value,
            limit: 9, 
            q: searchText.value,
            nxb: selectedNXB.value,
            year: selectedYear.value
        };

        const [bookRes, pubsData] = await Promise.all([
            BookService.getAll(params),
            PublisherService.getAll()
        ]);

        if (bookRes.books) {
            books.value = bookRes.books;      
            totalPages.value = bookRes.totalPages; 
            currentPage.value = bookRes.currentPage; 
        } else {
            books.value = Array.isArray(bookRes) ? bookRes : [];
        }
        
        publishers.value = pubsData;
    } catch (error) { 
        console.error("Lỗi tải dữ liệu:", error); 
    } finally { 
        loading.value = false; 
    }
};

const changePage = (page) => {
    currentPage.value = page;
    fetchData();
};

const changeFilter = (type, value) => {
    if (type === 'nxb') selectedNXB.value = value;
    if (type === 'year') selectedYear.value = value;
    currentPage.value = 1; 
    fetchData();
};

watch(() => route.query.q, (newQuery) => {
    searchText.value = newQuery || '';
    currentPage.value = 1;
    fetchData();
}, { immediate: true });

const getImageUrl = (imagePath) => {
    if (!imagePath) return 'default-image-url';
    if (imagePath.startsWith('http')) return imagePath; 
    return `http://localhost:3000${imagePath}`; 
}
const getPublisherName = (manxb) => publishers.value.find(p => p.manxb === manxb)?.tenNXB || manxb;
const goToDetail = (masach) => router.push({ name: 'book-detail', params: { id: masach } });
const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
const setDefaultImage = (e) => e.target.src = 'https://fastly.picsum.photos/id/173/200/300.jpg?hmac=9Ed5HxHOL3tFCOiW6UHx6a3hVksxDWc7L7p_WzN9N9Q';

const openBorrowModal = (book) => {
    if (!authStore.isLoggedIn) { alert("Bạn cần đăng nhập để mượn sách!"); router.push('/login'); return; }
    if (!authStore.user.dienThoai || !authStore.user.diaChi) {
        if(confirm("Bạn cần hoàn tất hồ sơ trước khi mượn sách. Đi đến trang hồ sơ ngay?")) router.push('/profile');
        return;
    }
    selectedBook.value = book;
    showBorrowModal.value = true;
};

const handleBorrowConfirm = async (date) => {
    try {
        await BorrowingService.create({ madocgia: authStore.user.madocgia, masach: selectedBook.value.masach, ngayHenLay: date });
        alert("Gửi yêu cầu thành công!");
        showBorrowModal.value = false; 
    } catch (error) { alert(error.response?.data?.message || "Lỗi."); }
};

onMounted(() => {
    if (!route.query.q) fetchData();
});
</script>

<style scoped>
.book-card { transition: all 0.3s ease; border: 1px solid #f0f0f0 !important; }
.book-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; border-color: #cce5ff !important; }
.image-container { height: 220px; background-color: #f8f9fa; display: flex; align-items: center; justify-content: center; }
.book-cover { height: 100%; width: auto; object-fit: contain; }
.cursor-pointer { cursor: pointer; }
</style>
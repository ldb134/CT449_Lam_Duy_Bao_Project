<template>
  <div class="container mt-3">
    
    <div id="libraryCarousel" class="carousel slide shadow-sm rounded overflow-hidden mb-5" data-bs-ride="carousel">
      <div class="carousel-indicators">
        <button type="button" data-bs-target="#libraryCarousel" data-bs-slide-to="0" class="active"></button>
        <button type="button" data-bs-target="#libraryCarousel" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#libraryCarousel" data-bs-slide-to="2"></button>
      </div>
      <div class="carousel-inner">
        <div class="carousel-item active" data-bs-interval="3000">
          <img src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" class="d-block w-100" alt="Slide 1" style="height: 400px; object-fit: cover;">
          <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded">
            <h5>Chào mừng đến với Thư Viện</h5>
            <p>Khám phá kho tàng tri thức vô tận ngay hôm nay.</p>
          </div>
        </div>
        <div class="carousel-item" data-bs-interval="3000">
          <img src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" class="d-block w-100" alt="Slide 3" style="height: 400px; object-fit: cover;">
          <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded">
            <h5>Cập nhật sách mới liên tục</h5>
            <p>Hàng ngàn đầu sách mới đang chờ đón bạn.</p>
          </div>
        </div>
        <div class="carousel-item" data-bs-interval="3000">
          <img src="https://images.unsplash.com/photo-1507842217121-9d59754a8429?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" class="d-block w-100" alt="Slide 2" style="height: 400px; object-fit: cover;">
          <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded">
            <h5>Không gian đọc sách lý tưởng</h5>
            <p>Mượn sách dễ dàng, nhanh chóng và tiện lợi.</p>
          </div>
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#libraryCarousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#libraryCarousel" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
      </button>
    </div>

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
              @click="selectedNXB = ''"
            >
              <span>Tất cả</span>
            </button>
            
            <button 
              v-for="pub in publishers" 
              :key="pub._id"
              class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              :class="{ 'active': selectedNXB === pub.manxb }"
              @click="selectedNXB = pub.manxb"
            >
              <span>{{ pub.tenNXB }}</span>
              <span class="badge bg-light text-dark rounded-pill border">
                {{ countBooksByPub(pub.manxb) }}
              </span>
            </button>
          </div>
        </div>

        <div class="card shadow-sm border-0">
          <div class="card-header bg-white py-3">
            <h5 class="mb-0 text-primary fw-bold">
              <font-awesome-icon icon="calendar-alt" class="me-2" /> Năm Xuất Bản
            </h5>
          </div>
          <div class="list-group list-group-flush scrollable-list" style="max-height: 300px; overflow-y: auto;">
            <button 
              class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              :class="{ 'active': selectedYear === '' }"
              @click="selectedYear = ''"
            >
              <span>Tất cả các năm</span>
            </button>
            
            <button 
              v-for="year in uniqueYears" 
              :key="year"
              class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              :class="{ 'active': selectedYear === year }"
              @click="selectedYear = year"
            >
              <span>Năm {{ year }}</span>
              <span class="badge bg-light text-dark rounded-pill border">
                {{ countBooksByYear(year) }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div class="col-md-9">
        <div class="d-flex justify-content-between align-items-center mb-4">
           <h4 class="fw-bold text-dark mb-0">
             <font-awesome-icon icon="book" class="me-2 text-primary" /> 
             Danh Sách Sách
           </h4>
           
           <div class="input-group w-50 shadow-sm">
              <input 
                type="text" 
                class="form-control border-end-0" 
                placeholder="Tìm tên sách, tác giả..." 
                v-model="searchText"
              >
              <span class="input-group-text bg-white border-start-0 text-muted">
                <font-awesome-icon icon="search" />
              </span>
           </div>
        </div>

        <div v-if="selectedNXB || selectedYear" class="mb-3">
            <span class="text-muted me-2">Đang lọc theo:</span>
            <span v-if="selectedNXB" class="badge bg-primary me-2 p-2">
                NXB: {{ getPublisherName(selectedNXB) }} 
                <font-awesome-icon icon="times" class="ms-2 cursor-pointer" @click="selectedNXB = ''" />
            </span>
            <span v-if="selectedYear" class="badge bg-info text-dark p-2">
                Năm: {{ selectedYear }}
                <font-awesome-icon icon="times" class="ms-2 cursor-pointer" @click="selectedYear = ''" />
            </span>
            <button class="btn btn-link btn-sm text-decoration-none text-danger" @click="clearFilters">Xóa hết lọc</button>
        </div>

        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-2 text-muted">Đang tải dữ liệu...</p>
        </div>

        <div v-else class="row">
          <div v-if="filteredBooks.length === 0" class="col-12 text-center py-5 text-muted bg-light rounded">
            <font-awesome-icon icon="box-open" size="4x" class="mb-3 opacity-50" />
            <h5>Không tìm thấy cuốn sách nào phù hợp.</h5>
          </div>

          <div class="col-md-4 mb-4" v-for="book in filteredBooks" :key="book._id">
            <div class="card h-100 shadow-sm border-0 book-card">
              <div class="card-body text-center d-flex flex-column cursor-pointer p-3" @click="goToDetail(book.masach)">
                
                <div class="image-container mb-3 position-relative rounded overflow-hidden">
                  <img 
                    :src="book.anh" 
                    :alt="book.tenSach" 
                    class="book-cover" 
                    @error="setDefaultImage"
                  >
                  <span class="position-absolute top-0 end-0 badge m-2 shadow-sm" 
                    :class="book.soQuyen > 0 ? 'bg-success' : 'bg-secondary'">
                    <small>{{ book.soQuyen > 0 ? 'Có thể mượn' : 'Không thể mượn' }}</small>
                  </span>
                </div>

                <h6 class="card-title fw-bold text-truncate text-dark mb-1" :title="book.tenSach">
                  {{ book.tenSach }}
                </h6>
                <p class="card-text text-muted small mb-1">
                  {{ book.tacGia }}
                </p>
                <small class="text-muted mb-2">Năm: {{ book.namXuatBan }}</small>
                
                <div class="mt-auto">
                   <small class="text-muted">
                       <font-awesome-icon icon="tag" class="me-1"/> Giá bìa: {{ formatPrice(book.donGia) }}
                   </small>
                </div>
              </div>
              
              <div class="card-footer bg-white border-top-0 p-3 pt-0 mt-2">
                <button 
                  class="btn w-100 rounded-pill fw-bold shadow-sm btn-borrow" 
                  :class="book.soQuyen > 0 ? 'btn-outline-primary' : 'btn-secondary disabled'"
                  @click="openBorrowModal(book)"
                >
                  <font-awesome-icon icon="file-import" class="me-2" />
                  {{ book.soQuyen > 0 ? 'Mượn Ngay' : 'Tạm Hết' }}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <BorrowModal 
            :isVisible="showBorrowModal" 
            :book="selectedBook" 
            @close="showBorrowModal = false"
            @confirm="handleBorrowConfirm"
        />

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import BookService from '@/services/book.service';
import PublisherService from '@/services/publisher.service'; 
import BorrowingService from '@/services/borrowing.service'; 
import BorrowModal from '@/components/BorrowModal.vue'; 
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const books = ref([]);
const publishers = ref([]);
const selectedNXB = ref('');
const selectedYear = ref(''); 
const searchText = ref('');
const loading = ref(false);
const showBorrowModal = ref(false);
const selectedBook = ref(null);

const goToDetail = (masach) => {
    router.push({ name: 'book-detail', params: { id: masach } });
};

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const fetchData = async () => {
    loading.value = true;
    try {
        const [booksData, pubsData] = await Promise.all([
            BookService.getAll(),
            PublisherService.getAll()
        ]);
        books.value = booksData;
        publishers.value = pubsData;
    } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
    } finally {
        loading.value = false;
    }
};

const countBooksByPub = (manxb) => {
    return books.value.filter(b => b.manxb === manxb).length;
};

const countBooksByYear = (year) => {
    return books.value.filter(b => b.namXuatBan == year).length; 
};

const uniqueYears = computed(() => {
    const years = books.value.map(b => b.namXuatBan).filter(y => y); 
    return [...new Set(years)].sort((a, b) => b - a); 
});

const getPublisherName = (manxb) => {
    const pub = publishers.value.find(p => p.manxb === manxb);
    return pub ? pub.tenNXB : manxb;
};

const clearFilters = () => {
    selectedNXB.value = '';
    selectedYear.value = '';
    searchText.value = '';
};

const filteredBooks = computed(() => {
    let result = books.value;

    if (selectedNXB.value) {
        result = result.filter(book => book.manxb === selectedNXB.value);
    }

    if (selectedYear.value) {
        result = result.filter(book => book.namXuatBan == selectedYear.value);
    }

    if (searchText.value) {
        const lower = searchText.value.toLowerCase();
        result = result.filter(book => 
            book.tenSach.toLowerCase().includes(lower) ||
            book.tacGia.toLowerCase().includes(lower)
        );
    }

    return result;
});

const openBorrowModal = (book) => {
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

    selectedBook.value = book;
    showBorrowModal.value = true;
};

const handleBorrowConfirm = async (date) => {
    try {
        const borrowData = {
            madocgia: authStore.user.madocgia,
            masach: selectedBook.value.masach,
            ngayHenLay: date 
        };

        await BorrowingService.create(borrowData);
        alert("Gửi yêu cầu thành công! Vui lòng đến nhận sách đúng hẹn.");
        showBorrowModal.value = false; 

    } catch (error) {
        console.log(error);
        alert(error.response?.data?.message || "Có lỗi xảy ra.");
    }
};

const setDefaultImage = (event) => {
    event.target.src = 'https://fastly.picsum.photos/id/173/200/300.jpg?hmac=9Ed5HxHOL3tFCOiW6UHx6a3hVksxDWc7L7p_WzN9N9Q';
};

onMounted(() => {
    fetchData();
});
</script>

<style scoped>
.book-card {
    transition: all 0.3s ease;
    border: 1px solid #f0f0f0 !important;
}
.book-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
    border-color: #cce5ff !important;
}

.image-container {
    height: 220px;
    background-color: #f8f9fa;
    display: flex;
    align-items: center;
    justify-content: center;
}
.book-cover {
    height: 100%;
    width: auto;
    object-fit: contain;
    transition: transform 0.3s ease;
}
.book-card:hover .book-cover {
    transform: scale(1.05);
}

.btn-borrow:hover {
    background-color: #0d6efd;
    color: white;
}

.cursor-pointer {
    cursor: pointer;
}

.list-group-item.active {
    background-color: #0d6efd;
    border-color: #0d6efd;
}

.scrollable-list::-webkit-scrollbar {
    width: 6px;
}
.scrollable-list::-webkit-scrollbar-track {
    background: #f1f1f1; 
}
.scrollable-list::-webkit-scrollbar-thumb {
    background: #ccc; 
    border-radius: 3px;
}
.scrollable-list::-webkit-scrollbar-thumb:hover {
    background: #aaa; 
}
</style>
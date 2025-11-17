<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">     
      <div v-if="!authStore.isLoggedIn">
        <router-link to="/login" class="btn btn-outline-primary me-2">Đăng Nhập</router-link>
        <router-link to="/register" class="btn btn-primary">Đăng Ký</router-link>
      </div>
    </div>

    <div class="input-group mb-4 shadow-sm">
      <input 
        type="text" 
        class="form-control" 
        placeholder="Tìm kiếm sách yêu thích..." 
        v-model="searchText"
      >
      <button class="btn btn-primary">
        <font-awesome-icon icon="search" /> Tìm kiếm
      </button>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Đang tải sách...</p>
    </div>

    <div v-else class="row">
      <div v-if="filteredBooks.length === 0" class="col-12 text-center py-5 text-muted">
        <font-awesome-icon icon="box-open" size="3x" class="mb-3" />
        <h4>Không tìm thấy cuốn sách nào.</h4>
      </div>

      <div class="col-md-3 mb-4" v-for="book in filteredBooks" :key="book._id">
        <div class="card h-100 shadow-sm border-0 book-card">
          <div class="card-body text-center d-flex flex-column">
            <div class="image-container mb-3 position-relative">
              <img 
                :src="book.anh" 
                :alt="book.tenSach" 
                class="book-cover img-fluid rounded" 
                @error="setDefaultImage"
              >
              <span class="position-absolute top-0 end-0 badge rounded-pill m-2" 
                :class="book.soQuyen > 0 ? 'bg-success' : 'bg-secondary'">
                Còn: {{ book.soQuyen }}
              </span>
            </div>

            <h5 class="card-title fw-bold text-truncate mb-1" :title="book.tenSach">
              {{ book.tenSach }}
            </h5>
            <p class="card-text text-muted small flex-grow-1">
              <font-awesome-icon icon="pen-nib" class="me-1" /> {{ book.tacGia }}
            </p>
            <h6 class="text-primary fw-bold mt-2">
              {{ formatPrice(book.donGia) }}
            </h6>
          </div>
          
          <div class="card-footer bg-white border-top-0 pb-3">
            <button 
              class="btn w-100 rounded-pill" 
              :class="book.soQuyen > 0 ? 'btn-success' : 'btn-secondary'"
              :disabled="book.soQuyen <= 0"
              @click="borrowBook(book)"
            >
              <font-awesome-icon icon="plus-circle" class="me-1" />
              {{ book.soQuyen > 0 ? 'Mượn Sách' : 'Hết Hàng' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import BookService from '@/services/book.service';
import BorrowingService from '@/services/borrowing.service'; 
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const books = ref([]);
const searchText = ref('');
const loading = ref(false);

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const fetchBooks = async () => {
    loading.value = true;
    try {
        books.value = await BookService.getAll();
    } catch (error) {
        console.error("Lỗi khi lấy sách:", error);
    } finally {
        loading.value = false;
    }
};

const filteredBooks = computed(() => {
    if (!searchText.value) return books.value;
    return books.value.filter(book => 
        book.tenSach.toLowerCase().includes(searchText.value.toLowerCase()) ||
        book.tacGia.toLowerCase().includes(searchText.value.toLowerCase())
    );
});

const borrowBook = async (book) => {
    if (!authStore.isLoggedIn) {
        alert("Bạn cần đăng nhập để mượn sách!");
        router.push('/login');
        return;
    }
    
    if (confirm(`Bạn muốn gửi yêu cầu mượn sách: "${book.tenSach}"?`)) {
        try {
            const borrowData = {
                madocgia: authStore.user.madocgia,
                masach: book.masach
            };

            await BorrowingService.create(borrowData);
            alert("Gửi yêu cầu thành công! Vui lòng chờ nhân viên duyệt.");

        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Có lỗi xảy ra khi mượn sách.");
        }
    }
};

const setDefaultImage = (event) => {
    event.target.src = 'https://fastly.picsum.photos/id/173/200/300.jpg?hmac=9Ed5HxHOL3tFCOiW6UHx6a3hVksxDWc7L7p_WzN9N9Q'; // Ảnh test
};

onMounted(() => {
    fetchBooks();
});
</script>

<style scoped>
.book-card {
    transition: transform 0.2s, box-shadow 0.2s;
}
.book-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
}
.image-container {
    height: 240px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden; 
    background-color: #f8f9fa; 
}
.book-cover {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain; 
    width: auto; 
    height: auto; 
}
</style>
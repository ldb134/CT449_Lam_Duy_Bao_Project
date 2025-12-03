<template>
  <div class="home-page">
    
    <div class="banner-section position-relative mb-5">
        <img 
            src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
            class="d-block w-100 rounded-3 shadow" 
            alt="Thư viện banner" 
            style="height: 450px; object-fit: cover; filter: brightness(0.85);"
        >
        
        <div class="position-absolute top-50 start-50 translate-middle text-center text-white w-100 px-3">
            <h1 class="fw-bold display-4 mb-3 text-shadow">Chào mừng đến với Thư Viện CTU</h1>
            <p class="fs-5 mb-4 text-shadow">Nơi khởi nguồn tri thức và chắp cánh ước mơ của bạn.</p>
            
            <router-link to="/library" class="btn btn-primary btn-lg rounded-pill px-5 shadow-lg border-2 border-white">
                <font-awesome-icon icon="search" class="me-2" /> Khám Phá Kho Sách Ngay
            </router-link>
        </div>
    </div>

    <div class="container">
      <section class="mb-5">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="fw-bold text-primary border-start border-4 border-primary ps-3">Sách Mới Cập Nhật</h3>
            <router-link to="/library" class="btn btn-outline-primary rounded-pill">Xem tất cả</router-link>
        </div>
        
        <div class="row">
             <div v-if="newBooks.length === 0" class="col-12 text-center text-muted py-4">
                Đang tải sách mới...
             </div>
            <div class="col-md-3 mb-4" v-for="book in newBooks" :key="book._id">
               <div class="card h-100 shadow-sm border-0 book-card" @click="goToDetail(book.masach)">
                  <div class="image-container rounded-top overflow-hidden position-relative">
                      <img :src="getImageUrl(book.anh)" class="book-cover" @error="setDefaultImage">
                      
                      <span class="position-absolute top-0 start-0 badge bg-danger m-2 shadow-sm">Mới</span>
                  </div>
                  <div class="card-body text-center">
                      <h6 class="fw-bold text-truncate text-dark" :title="book.tenSach">{{ book.tenSach }}</h6>
                      <small class="text-muted">{{ book.tacGia }}</small>
                  </div>
                  <div class="card-footer bg-white border-top-0 p-3 pt-0 mt-2">
                      <button 
                          class="btn w-100 rounded-pill fw-bold shadow-sm btn-outline-primary" 
                          @click.stop="openBorrowModal(book)"
                      >
                          <font-awesome-icon icon="file-import" class="me-2" /> Mượn Ngay
                      </button>
                  </div>
               </div>
            </div>
        </div>
      </section>

      <section class="bg-light rounded-3 p-5 mb-5 text-center shadow-sm">
          <h2 class="fw-bold text-dark">Bạn chưa tìm thấy cuốn sách ưng ý?</h2>
          <p class="text-muted mb-4">Kho sách của chúng tôi có hàng ngàn đầu sách thuộc nhiều lĩnh vực khác nhau.</p>
          <router-link to="/library" class="btn btn-lg btn-success px-5 rounded-pill shadow">
             <font-awesome-icon icon="search" class="me-2" /> Tìm Sách Trong Kho
          </router-link>
      </section>

      <section class="mb-5">
        <h3 class="fw-bold text-secondary border-start border-4 border-secondary ps-3 mb-4">Được Mượn Nhiều</h3>
        <div class="row">
            <div v-if="hotBooks.length === 0" class="col-12 text-center text-muted py-4">
                Chưa có dữ liệu sách nổi bật.
             </div>
            <div class="col-md-3 mb-4" v-for="book in hotBooks" :key="book._id">
               <div class="card h-100 shadow-sm border-0 book-card" @click="goToDetail(book.masach)">
                  <div class="image-container rounded-top overflow-hidden position-relative">
                      <img :src="getImageUrl(book.anh)" class="book-cover" @error="setDefaultImage">
                      
                      <span class="position-absolute top-0 end-0 badge bg-warning text-dark m-2 shadow-sm">
                        <font-awesome-icon icon="fire" class="me-1"/>Hot
                      </span>
                  </div>
                  <div class="card-body text-center">
                      <h6 class="fw-bold text-truncate text-dark" :title="book.tenSach">{{ book.tenSach }}</h6>
                      <small class="text-muted">{{ book.tacGia }}</small>
                  </div>
                  <div class="card-footer bg-white border-top-0 p-3 pt-0 mt-2">
                      <button 
                          class="btn w-100 rounded-pill fw-bold shadow-sm btn-outline-primary" 
                          @click.stop="openBorrowModal(book)"
                      >
                          <font-awesome-icon icon="file-import" class="me-2" /> Mượn Ngay
                      </button>
                  </div>
               </div>
            </div>
        </div>
      </section>
    </div>
  <BorrowModal 
        :isVisible="showBorrowModal" 
        :book="selectedBook" 
        @close="showBorrowModal = false" 
        @confirm="handleBorrowConfirm"
    />
  </div> 
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BookService from '@/services/book.service';
import BorrowingService from '@/services/borrowing.service';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store'; 
import Swal from 'sweetalert2'; 
import { toast } from 'vue3-toastify'; 
import BorrowModal from '@/components/BorrowModal.vue'; 

const router = useRouter();
const authStore = useAuthStore(); 

const newBooks = ref([]);
const hotBooks = ref([]);
const showBorrowModal = ref(false); 
const selectedBook = ref(null);    

const fetchData = async () => {
    try {
        const [topData, newData] = await Promise.all([
            BookService.getTopBorrowed(),
            BookService.getNew()
        ]);

        hotBooks.value = topData;
        newBooks.value = newData; 

    } catch (error) { 
        console.error("Lỗi tải trang chủ:", error); 
    }
};

const goToDetail = (masach) => {
    router.push({ name: 'book-detail', params: { id: masach } });
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


const openBorrowModal = async (book) => { 
    if(event) event.stopPropagation(); 

    if (!authStore.isLoggedIn) { 
        toast.warning("Bạn cần đăng nhập để mượn sách!"); 
        router.push('/login'); 
        return; 
    }
    
    if (!authStore.user.dienThoai || !authStore.user.diaChi) {
        const result = await Swal.fire({
            title: 'Chưa hoàn tất hồ sơ',
            text: "Bạn cần cập nhật Số điện thoại và Địa chỉ để mượn sách. Cập nhật ngay?",
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Đi tới Hồ sơ',
            cancelButtonText: 'Để sau'
        });
        
        if(result.isConfirmed) {
            router.push('/profile');
        }
        return;
    }
    selectedBook.value = book;
    showBorrowModal.value = true;
};

const handleBorrowConfirm = async (date) => {
    try {
        await BorrowingService.create({ 
            madocgia: authStore.user.madocgia, 
            masach: selectedBook.value.masach, 
            ngayHenLay: date 
        });
        toast.success("Gửi yêu cầu thành công! Vui lòng chờ duyệt.");
        showBorrowModal.value = false; 
    } catch (error) { 
        toast.error(error.response?.data?.message || "Lỗi khi mượn sách."); 
    }
};

onMounted(() => {
    fetchData();
});
</script>

<style scoped>
.image-container { 
    height: 250px; 
    background-color: #f8f9fa; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
}
.book-cover { 
    height: 100%; 
    width: auto; 
    object-fit: contain; 
    transition: transform 0.3s; 
}
.book-card { 
    cursor: pointer; 
    transition: transform 0.2s, box-shadow 0.2s; 
}
.book-card:hover { 
    transform: translateY(-5px); 
    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}
.book-card:hover .book-cover {
    transform: scale(1.05);
}
.text-shadow {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}
</style>
<template>
  <div class="home-page">
    
    <div id="libraryCarousel" class="carousel slide shadow-sm mb-5" data-bs-ride="carousel">
      <div class="carousel-indicators">
        <button type="button" data-bs-target="#libraryCarousel" data-bs-slide-to="0" class="active"></button>
        <button type="button" data-bs-target="#libraryCarousel" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#libraryCarousel" data-bs-slide-to="2"></button>
      </div>
      <div class="carousel-inner">
        <div class="carousel-item active" data-bs-interval="3000">
          <img src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" class="d-block w-100" alt="Thư viện" style="height: 450px; object-fit: cover;">
          <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-3">
            <h2 class="fw-bold">Chào mừng đến với Thư Viện</h2>
            <p class="fs-5">Khám phá kho tàng tri thức vô tận ngay hôm nay.</p>
            <router-link to="/library" class="btn btn-primary mt-2">
                <font-awesome-icon icon="search" class="me-2" /> Khám Phá Ngay
            </router-link>
          </div>
        </div>
        <div class="carousel-item" data-bs-interval="3000">
          <img src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" class="d-block w-100" alt="Sách mới" style="height: 450px; object-fit: cover;">
          <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-3">
            <h2 class="fw-bold">Cập nhật sách mới liên tục</h2>
            <p class="fs-5">Hàng ngàn đầu sách mới đang chờ đón bạn.</p>
          </div>
        </div>
        <div class="carousel-item" data-bs-interval="3000">
          <img src="https://images.unsplash.com/photo-1507842217121-9d59754a8429?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" class="d-block w-100" alt="Không gian đọc" style="height: 450px; object-fit: cover;">
          <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-3">
            <h2 class="fw-bold">Không gian đọc sách lý tưởng</h2>
            <p class="fs-5">Mượn sách dễ dàng, nhanh chóng và tiện lợi.</p>
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
               </div>
            </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BookService from '@/services/book.service';
import { useRouter } from 'vue-router';

const router = useRouter();

const newBooks = ref([]);
const hotBooks = ref([]);

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

const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://fastly.picsum.photos/id/173/200/300.jpg?hmac=9Ed5HxHOL3tFCOiW6UHx6a3hVksxDWc7L7p_WzN9N9Q'; // Ảnh mặc định
    if (imagePath.startsWith('http')) return imagePath; 
    return `http://localhost:3000${imagePath}`; 
}

const setDefaultImage = (e) => {
    e.target.src = 'https://fastly.picsum.photos/id/173/200/300.jpg?hmac=9Ed5HxHOL3tFCOiW6UHx6a3hVksxDWc7L7p_WzN9N9Q';
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
</style>
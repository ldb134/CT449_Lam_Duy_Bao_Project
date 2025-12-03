<template>
  <div class="container py-5">
    <div class="row align-items-center mb-5">
        <div class="col-md-6">
            <h1 class="display-5 fw-bold text-primary mb-3">Thư Viện Trực Tuyến</h1>
            <p class="lead text-muted">
                Dự án quản lý thư viện nhỏ gọn, hiện đại, giúp bạn tra cứu và mượn sách dễ dàng hơn bao giờ hết.
            </p>
            <p>
                Website được xây dựng với mục tiêu số hóa quy trình quản lý sách, thay thế sổ sách thủ công, 
                giúp độc giả tiết kiệm thời gian và thủ thư quản lý hiệu quả hơn.
            </p>
            <div class="mt-4">
                <router-link to="/library" class="btn btn-primary rounded-pill px-4 shadow-sm">
                    <font-awesome-icon icon="search" class="me-2" /> Khám Phá Kho Sách
                </router-link>
            </div>
        </div>
        <div class="col-md-6">
            <img src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80" 
                 class="img-fluid rounded-3 shadow-lg" 
                 alt="Library Image"
                 style="object-fit: cover; height: 400px; width: 100%;">
        </div>
    </div>
    
    <div class="row g-4 text-center mt-2 mb-5">
        <div class="col-md-4">
            <div class="card border-0 shadow-sm h-100 py-4 bg-light hover-card">
                <div class="card-body">
                    <div class="mb-3 text-primary">
                        <font-awesome-icon icon="book" class="display-4" />
                    </div>
                    <h3 class="fw-bold">{{ loading ? '...' : totalBooks }}</h3>
                    <p class="text-muted text-uppercase small fw-bold">Đầu Sách Hiện Có</p>
                </div>
            </div>
        </div>
        <div class="col-md-4">
             <div class="card border-0 shadow-sm h-100 py-4 bg-light hover-card">
                <div class="card-body">
                    <div class="mb-3 text-success">
                        <font-awesome-icon icon="users" class="display-4" />
                    </div>
                    <h3 class="fw-bold">{{ loading ? '...' : totalReaders }}</h3>
                    <p class="text-muted text-uppercase small fw-bold">Thành Viên Đăng Ký</p>
                </div>
            </div>
        </div>
        <div class="col-md-4">
             <div class="card border-0 shadow-sm h-100 py-4 bg-light hover-card">
                <div class="card-body">
                    <div class="mb-3 text-warning">
                        <font-awesome-icon icon="star" class="display-4" />
                    </div>
                    <h3 class="fw-bold">24/7</h3>
                    <p class="text-muted text-uppercase small fw-bold">Hoạt Động Online</p>
                </div>
            </div>
        </div>
    </div>

    <hr class="my-5 text-muted">

    <div class="text-center">
        <h3 class="fw-bold text-secondary mb-4">Đội Ngũ Phát Triển</h3>
        <div class="row justify-content-center">
            <div class="col-md-4">
                <div class="card border-0 shadow-sm">
                    <div class="card-body">
                        <div class="avatar-circle bg-primary text-white mx-auto mb-3 d-flex align-items-center justify-content-center fs-2 fw-bold">
                            B
                        </div>
                        <h5 class="fw-bold">Lâm Duy Bảo</h5>
                        <p class="text-muted small mb-1">MSSV: B2205854</p>
                        <p class="text-muted small">Full-stack Developer</p>
                        <div class="d-flex justify-content-center gap-2 mt-3">
                            <a href="#" class="btn btn-sm btn-outline-primary rounded-circle"><font-awesome-icon :icon="['fab', 'facebook']" /></a>
                            <a href="#" class="btn btn-sm btn-outline-dark rounded-circle"><font-awesome-icon :icon="['fab', 'github']" /></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BookService from '@/services/book.service';
import ReaderService from '@/services/reader.service';

const totalBooks = ref(0);
const totalReaders = ref(0);
const loading = ref(true);

const fetchStats = async () => {
    try {
        const [bookRes, readerRes] = await Promise.all([
            BookService.getAll({ page: 1, limit: 1 }), 
            ReaderService.getAll({ page: 1, limit: 1 }) 
        ]);

        totalBooks.value = bookRes.totalItems || (Array.isArray(bookRes) ? bookRes.length : 0);
        totalReaders.value = readerRes.totalItems || (Array.isArray(readerRes) ? readerRes.length : 0);
        
    } catch (error) {
        console.error("Lỗi tải thống kê:", error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchStats();
});
</script>

<style scoped>
.hover-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.hover-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
    background-color: #fff !important;
}
.avatar-circle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
}
</style>
<template>
  <div class="staff-dashboard">
    <h2 class="mb-4 fw-bold text-primary">
       <font-awesome-icon icon="chart-line" class="me-2" /> Thống Kê & Báo Cáo
    </h2>
    
    <div class="row mb-4 g-3">
      <div class="col-md-3">
        <div class="card text-white bg-primary shadow-sm border-0 h-100">
          <div class="card-body d-flex justify-content-between align-items-center">
            <div>
              <h6 class="card-title fw-light text-uppercase mb-1">Đang Mượn</h6>
              <h3 class="fw-bold mb-0">{{ counts.borrowing }}</h3>
            </div>
            <font-awesome-icon icon="book-reader" size="2x" class="opacity-50" />
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-white bg-warning shadow-sm border-0 h-100">
          <div class="card-body d-flex justify-content-between align-items-center">
            <div>
              <h6 class="card-title fw-light text-uppercase mb-1 text-dark">Chờ Duyệt</h6>
              <h3 class="fw-bold mb-0 text-dark">{{ counts.pending }}</h3>
            </div>
            <font-awesome-icon icon="clock" size="2x" class="opacity-50 text-dark" />
          </div>
        </div>
      </div>
       <div class="col-md-3">
        <div class="card text-white bg-success shadow-sm border-0 h-100">
          <div class="card-body d-flex justify-content-between align-items-center">
            <div>
              <h6 class="card-title fw-light text-uppercase mb-1">Đã Trả</h6>
              <h3 class="fw-bold mb-0">{{ counts.returned }}</h3>
            </div>
            <font-awesome-icon icon="check-circle" size="2x" class="opacity-50" />
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-white bg-danger shadow-sm border-0 h-100">
          <div class="card-body d-flex justify-content-between align-items-center">
            <div>
              <h6 class="card-title fw-light text-uppercase mb-1">Độc Giả</h6>
              <h3 class="fw-bold mb-0">{{ totalReaders }}</h3>
            </div>
            <font-awesome-icon icon="users" size="2x" class="opacity-50" />
          </div>
        </div>
      </div>
    </div>

    <div class="row mb-4">
        <div class="col-md-8 mb-4 mb-md-0">
            <div class="card shadow-sm border-0 h-100">
                <div class="card-header bg-white py-3">
                    <h5 class="mb-0 fw-bold text-secondary">
                        <font-awesome-icon icon="chart-bar" class="me-2"/> Xu Hướng Mượn Sách ({{ currentYear }})
                    </h5>
                </div>
                <div class="card-body">
                    <Bar v-if="loaded" :data="barChartData" :options="barOptions" />
                </div>
            </div>
        </div>

        <div class="col-md-4">
             <div class="card shadow-sm border-0 h-100">
                <div class="card-header bg-white py-3">
                    <h5 class="mb-0 fw-bold text-secondary">
                        <font-awesome-icon icon="chart-pie" class="me-2"/> Tỉ Lệ Trạng Thái
                    </h5>
                </div>
                <div class="card-body d-flex align-items-center justify-content-center">
                    <div style="max-width: 300px; width: 100%;">
                        <Doughnut v-if="loaded" :data="doughnutChartData" :options="doughnutOptions" />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="card shadow-sm border-0">
      <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
        <h5 class="mb-0 fw-bold text-secondary">
          <font-awesome-icon icon="list-alt" class="me-2" /> Hoạt Động Gần Đây
        </h5>
        <button class="btn btn-sm btn-outline-secondary" @click="fetchData">
          <font-awesome-icon icon="sync" /> Làm mới
        </button>
      </div>
      <div class="card-body p-0">
         <div v-if="!loaded" class="text-center py-4">
            <div class="spinner-border text-primary" role="status"></div>
         </div>

         <table v-else class="table table-hover mb-0 align-middle">
           <thead class="table-light">
             <tr>
               <th scope="col" class="ps-4">Mã Phiếu</th>
               <th scope="col">Độc Giả</th>
               <th scope="col">Mã Sách</th>
               <th scope="col">Hạn Trả</th>
               <th scope="col">Trạng Thái</th>
               <th scope="col">Ngày Tạo</th>
               <th scope="col" class="text-center">Hành Động</th>
             </tr>
           </thead>
           <tbody>
             <tr v-for="item in recentBorrowings" :key="item._id">
               <td class="ps-4 fw-bold text-muted small">#{{ item._id.slice(-6).toUpperCase() }}</td>
               <td>{{ item.madocgia }}</td>
               <td>{{ item.masach }}</td>
               
               <td>
                 <span :class="getStatusLabel(item.ngayHetHan, item.trangThai).class">
                    <font-awesome-icon 
                        v-if="getStatusLabel(item.ngayHetHan, item.trangThai).class.includes('text-danger')" 
                        icon="exclamation-circle" 
                        class="me-1"
                    />
                    {{ getStatusLabel(item.ngayHetHan, item.trangThai).text }}
                 </span>
               </td>

               <td>
                 <span v-if="item.trangThai === 'Chờ duyệt'" class="badge bg-warning text-dark">Chờ duyệt</span>
                 <span v-else-if="item.trangThai === 'Đang mượn'" class="badge bg-primary">Đang mượn</span>
                 <span v-else-if="item.trangThai === 'Đã trả'" class="badge bg-success">Đã trả</span>
                 <span v-else class="badge bg-secondary">{{ item.trangThai }}</span>
               </td>

               <td class="small text-muted">{{ formatDate(item.createdAt) }}</td>
               
               <td class="text-center">
                 <div v-if="item.trangThai === 'Chờ duyệt'">
                   <button class="btn btn-sm btn-outline-primary me-1" @click="approve(item._id)" title="Duyệt"><font-awesome-icon icon="check" /></button>
                   <button class="btn btn-sm btn-outline-danger" @click="reject(item._id)" title="Xóa"><font-awesome-icon icon="times" /></button>
                 </div>
                 <div v-else-if="item.trangThai === 'Đang mượn'">
                    <button class="btn btn-sm btn-success" @click="returnBook(item._id)" title="Trả sách"><font-awesome-icon icon="undo" /></button>
                 </div>
                 <span v-else class="text-muted small">---</span>
               </td>
             </tr>
           </tbody>
         </table>
      </div>
      <div class="card-footer bg-white text-center">
          <small class="text-muted">Hiển thị 10 giao dịch gần nhất</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import BorrowingService from '@/services/borrowing.service';
import ReaderService from '@/services/reader.service';
import {
  Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement
} from 'chart.js'
import { Bar, Doughnut } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

const loaded = ref(false);
const borrowings = ref([]);
const totalReaders = ref(0);
const currentYear = new Date().getFullYear();

const counts = reactive({
    pending: 0, borrowing: 0, returned: 0
});

// Chart Config
const barChartData = ref({
  labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
  datasets: [{ label: 'Lượt mượn', backgroundColor: '#0d6efd', data: [] }]
});
const barOptions = { responsive: true, maintainAspectRatio: false };

const doughnutChartData = ref({
  labels: ['Đang mượn', 'Chờ duyệt', 'Đã trả'],
  datasets: [{ backgroundColor: ['#0d6efd', '#ffc107', '#198754'], data: [] }]
});
const doughnutOptions = { responsive: true, maintainAspectRatio: false };

const fetchData = async () => {
    loaded.value = false;
    try {
        // Truyền limit lớn để lấy toàn bộ dữ liệu cho việc thống kê chính xác
        const [borrowRes, readerRes] = await Promise.all([
            BorrowingService.getAll({ limit: 10000 }), 
            ReaderService.getAll({ limit: 10000 })
        ]);
        
        
        let borrowList = [];
        if (borrowRes.borrowings) {
            borrowList = borrowRes.borrowings; 
        } else if (Array.isArray(borrowRes)) {
            borrowList = borrowRes;            
        }

        let readerList = [];
        if (readerRes.readers) {
            readerList = readerRes.readers;   
        } else if (Array.isArray(readerRes)) {
            readerList = readerRes;            
        }

        borrowings.value = borrowList;
        totalReaders.value = readerList.length; 

        // Tính toán thống kê dựa trên list đã chuẩn hóa
        counts.pending = borrowList.filter(b => b.trangThai === 'Chờ duyệt').length;
        counts.borrowing = borrowList.filter(b => b.trangThai === 'Đang mượn').length;
        counts.returned = borrowList.filter(b => b.trangThai === 'Đã trả').length;

        // Vẽ biểu đồ
        const monthlyData = new Array(12).fill(0);
        borrowList.forEach(item => {
            const date = new Date(item.createdAt);
            if (date.getFullYear() === currentYear) {
                monthlyData[date.getMonth()]++;
            }
        });
        
        barChartData.value.datasets[0].data = monthlyData;
        doughnutChartData.value.datasets[0].data = [counts.borrowing, counts.pending, counts.returned];

        loaded.value = true; g
    } catch (error) {
        console.error("Lỗi tải dữ liệu Dashboard:", error);
        loaded.value = true; 
    }
};

const recentBorrowings = computed(() => {
    return [...borrowings.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);
});

const formatDate = (dateString) => {
    if (!dateString) return '---';
    return new Date(dateString).toLocaleDateString('vi-VN');
};

// Hàm tính toán hạn trả (Đã tối ưu cho ISO Date)
const getStatusLabel = (dateString, status) => {
    if (status === 'Đã trả' || status === 'Đã hủy') {
        return { text: '---', class: 'text-muted' };
    }
    if (status === 'Chờ duyệt') {
         return { text: 'Đang chờ', class: 'text-muted fst-italic' };
    }
    if (!dateString) return { text: '---', class: 'text-muted' };
    
    // Dùng trực tiếp ISO date từ backend
    const deadline = new Date(dateString);
    const today = new Date();
    
    // Reset giờ để so sánh ngày
    deadline.setHours(0,0,0,0);
    today.setHours(0,0,0,0);

    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return { text: `Trễ ${Math.abs(diffDays)} ngày`, class: 'text-danger fw-bold' };
    }
    if (diffDays === 0) {
        return { text: 'Hôm nay', class: 'text-warning fw-bold' };
    }
    if (diffDays === 1) {
        return { text: 'Ngày mai', class: 'text-primary fw-bold' };
    }
    
    return { text: formatDate(dateString), class: 'text-success' }; 
};

const approve = async (id) => {
    if(!confirm("Duyệt phiếu mượn này?")) return;
    try { 
        await BorrowingService.approve(id); 
        alert("Duyệt thành công!"); 
        fetchData(); 
    } catch(e) { 
        alert(e.response?.data?.message || "Có lỗi xảy ra!"); 
    }
};
const reject = async (id) => {
    if(!confirm("Xóa phiếu mượn này?")) return;
    try { await BorrowingService.delete(id); fetchData(); } catch(e) { alert("Lỗi!"); }
};
const returnBook = async (id) => {
    if(!confirm("Xác nhận trả sách?")) return;
    try { await BorrowingService.returnBook(id); fetchData(); } catch(e) { alert("Lỗi!"); }
};

onMounted(() => {
    fetchData();
});
</script>

<style scoped>
.card { transition: transform 0.2s; }
.card:hover { transform: translateY(-3px); }
</style>
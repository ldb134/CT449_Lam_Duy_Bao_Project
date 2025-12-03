<template>
  <div class="staff-dashboard">
    <h2 class="mb-4 fw-bold text-primary">
       <font-awesome-icon icon="chart-line" class="me-2" /> Thống Kê & Báo Cáo
    </h2>
    
    <div class="row mb-4 g-3">
      <div class="col">
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
      
      <div class="col">
        <div 
            class="card text-white bg-danger shadow-sm border-0 h-100 cursor-pointer"
            @click="viewOverdueDetails"
            title="Xem danh sách trễ hạn"
        >
          <div class="card-body d-flex justify-content-between align-items-center">
            <div>
              <h6 class="card-title fw-light text-uppercase mb-1">Trễ Hạn</h6>
              <h3 class="fw-bold mb-0">{{ counts.overdue }}</h3>
            </div>
            <font-awesome-icon icon="exclamation-triangle" size="2x" class="opacity-50" />
          </div>
        </div>
      </div>

      <div class="col">
        <div class="card text-dark bg-warning shadow-sm border-0 h-100">
          <div class="card-body d-flex justify-content-between align-items-center">
            <div>
              <h6 class="card-title fw-light text-uppercase mb-1">Chờ Duyệt</h6>
              <h3 class="fw-bold mb-0">{{ counts.pending }}</h3>
            </div>
            <font-awesome-icon icon="clock" size="2x" class="opacity-50" />
          </div>
        </div>
      </div>
       <div class="col">
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
      
      <div class="col">
        <div class="card text-dark bg-info shadow-sm border-0 h-100">
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
                <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                    <h5 class="mb-0 fw-bold text-secondary">
                        <font-awesome-icon icon="chart-area" class="me-2"/> Xu Hướng Năm {{ currentYear }}
                    </h5>
                    <div class="small">
                        <span class="badge bg-primary me-1">Mượn</span>
                        <span class="badge bg-success me-1">Đúng hạn</span>
                        <span class="badge bg-danger">Vi phạm</span>
                    </div>
                </div>
                <div class="card-body">
                    <Line v-if="loaded" :data="lineChartData" :options="lineOptions" />
                </div>
            </div>
        </div>

        <div class="col-md-4">
             <div class="card shadow-sm border-0 h-100">
                <div class="card-header bg-white py-3">
                    <h5 class="mb-0 fw-bold text-secondary">
                        <font-awesome-icon icon="chart-pie" class="me-2"/> Tỉ Lệ Tháng {{ currentMonth + 1 }}
                    </h5>
                </div>
                <div class="card-body d-flex align-items-center justify-content-center">
                    <div style="width: 100%;">
                        <Doughnut v-if="loaded" :data="doughnutChartData" :options="doughnutOptions" />
                    </div>
                </div>
                <div class="card-footer bg-white text-center small text-muted">
                    *Biểu đồ này chỉ tính dữ liệu trong tháng {{ currentMonth + 1 }}
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
                    {{ getStatusLabel(item.ngayHetHan, item.trangThai).text }}
                 </span>
               </td>

               <td>
                 <span v-if="item.trangThai === 'Chờ duyệt'" class="badge bg-warning text-dark">Chờ duyệt</span>
                 <span v-else-if="item.trangThai === 'Đang mượn'" class="badge bg-primary">Đang mượn</span>
                 <span v-else-if="item.trangThai === 'Đã trả'" class="badge bg-success">Đã trả</span>
                 <span v-else-if="item.trangThai === 'Đã hủy'" class="badge bg-secondary">Đã hủy</span>
                 <span v-else-if="item.trangThai === 'Quá hạn'" class="badge bg-danger">Quá hạn</span>
                 <span v-else class="badge bg-secondary">{{ item.trangThai }}</span>
               </td>

               <td class="small text-muted">{{ formatDate(item.createdAt) }}</td>
               
               <td class="text-center">
                 <div v-if="item.trangThai === 'Chờ duyệt'">
                   <button class="btn btn-sm btn-outline-primary me-1" @click="approve(item._id)" title="Duyệt"><font-awesome-icon icon="check" /></button>
                   <button class="btn btn-sm btn-outline-danger" @click="reject(item._id)" title="Từ chối"><font-awesome-icon icon="times" /></button>
                 </div>
                 <div v-else-if="item.trangThai === 'Đang mượn' || (item.trangThai === 'Quá hạn' && !item.ngayTra)">
                    <button class="btn btn-sm btn-success" @click="returnBook(item._id)" title="Trả sách"><font-awesome-icon icon="undo" /></button>
                 </div>
                 <span v-else class="text-muted small">---</span>
               </td>
             </tr>
           </tbody>
         </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import BorrowingService from '@/services/borrowing.service';
import ReaderService from '@/services/reader.service';
import { useRouter } from 'vue-router';
import {
  Chart as ChartJS, Title, Tooltip, Legend, 
  BarElement, CategoryScale, LinearScale, ArcElement,
  PointElement, LineElement, Filler
} from 'chart.js'
import { Doughnut, Line } from 'vue-chartjs'
import Swal from 'sweetalert2';
import { toast } from 'vue3-toastify'; 

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler)

const router = useRouter();
const loaded = ref(false);
const borrowings = ref([]);
const totalReaders = ref(0);
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth(); 

const counts = reactive({ pending: 0, borrowing: 0, returned: 0, cancelled: 0, overdue: 0 });

const lineChartData = ref({
  labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
  datasets: [
    { 
        label: 'Tổng lượt mượn', 
        borderColor: '#0d6efd', 
        backgroundColor: 'rgba(13, 110, 253, 0.1)', 
        data: [], 
        tension: 0.4, 
        fill: true 
    },
    { 
        label: 'Trả đúng hạn', 
        borderColor: '#198754', 
        backgroundColor: 'rgba(25, 135, 84, 0.1)', 
        data: [], 
        tension: 0.4, 
        fill: false 
    },
    { 
        label: 'Vi phạm (Trễ/Quá hạn)', 
        borderColor: '#dc3545', 
        backgroundColor: 'rgba(220, 53, 69, 0.1)', 
        data: [], 
        tension: 0.4, 
        fill: false 
    }
  ]
});

const lineOptions = { 
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: true, position: 'top' } },
    interaction: { mode: 'index', intersect: false },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
};

const doughnutChartData = ref({
  labels: ['Đang mượn', 'Trễ hạn', 'Chờ duyệt', 'Đã trả', 'Đã hủy'],
  datasets: [{ 
      backgroundColor: ['#0d6efd', '#dc3545', '#ffc107', '#198754', '#6c757d'],
      data: [],
      hoverOffset: 4
  }]
});
const doughnutOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } };

const fetchData = async () => {
    loaded.value = false;
    try {
        const [borrowRes, readerRes] = await Promise.all([
            BorrowingService.getAll({ limit: 10000 }), 
            ReaderService.getAll({ limit: 10000 })
        ]);
        
        let borrowList = borrowRes.borrowings || (Array.isArray(borrowRes) ? borrowRes : []);
        let readerList = readerRes.readers || (Array.isArray(readerRes) ? readerRes : []);

        borrowings.value = borrowList;
        totalReaders.value = readerList.length;

        const today = new Date();
        today.setHours(0,0,0,0);

        counts.pending = 0;
        counts.borrowing = 0;
        counts.returned = 0;
        counts.cancelled = 0;
        counts.overdue = 0;

        borrowList.forEach(b => {
            if (b.ngayTra) {
                counts.returned++;
                return; // Đã trả rồi thì không xét tiếp các case dưới
            }

            // B. Các trường hợp CHƯA TRẢ
            if (b.trangThai === 'Chờ duyệt') {
                counts.pending++;
            } 
            else if (b.trangThai === 'Đã hủy') {
                counts.cancelled++;
            }
            else if (b.trangThai === 'Quá hạn') {
                // Trạng thái là Quá hạn và chưa có ngày trả -> Đang trễ
                counts.overdue++;
            }
            else if (b.trangThai === 'Đang mượn') {
                if (b.ngayHetHan) {
                    const dueDate = new Date(b.ngayHetHan);
                    dueDate.setHours(0,0,0,0);
                    if (dueDate < today) {
                        counts.overdue++; 
                    } else {
                        counts.borrowing++;
                    }
                } else {
                    counts.borrowing++;
                }
            }
        });

        // --- 2. TÍNH TOÁN BIỂU ĐỒ (Xu hướng - Tính cả lịch sử) ---
        const borrowData = new Array(12).fill(0);
        const onTimeData = new Array(12).fill(0);
        const lateData = new Array(12).fill(0);

        borrowList.forEach(item => {
            const createdDate = new Date(item.createdAt);
            if (createdDate.getFullYear() === currentYear) {
                const monthIndex = createdDate.getMonth();
                borrowData[monthIndex]++; // Tổng lượt mượn

                // Case 1: Đã trả nhưng trễ -> Tính vào Vi phạm (Đỏ)
                if (item.ngayTra && item.ngayHetHan) {
                    const returnDate = new Date(item.ngayTra);
                    const dueDate = new Date(item.ngayHetHan);
                    returnDate.setHours(0,0,0,0); dueDate.setHours(0,0,0,0);
                    
                    if (returnDate > dueDate) {
                        lateData[monthIndex]++;
                    } else {
                        onTimeData[monthIndex]++;
                    }
                }
                // Case 2: Chưa trả và đang trễ -> Tính vào Vi phạm (Đỏ)
                else if (!item.ngayTra && item.ngayHetHan) {
                    const dueDate = new Date(item.ngayHetHan);
                    dueDate.setHours(0,0,0,0);
                    
                    if (item.trangThai === 'Quá hạn' || (item.trangThai === 'Đang mượn' && dueDate < today)) {
                        lateData[monthIndex]++;
                    }
                }
            }
        });

        lineChartData.value.datasets[0].data = borrowData;
        lineChartData.value.datasets[1].data = onTimeData;
        lineChartData.value.datasets[2].data = lateData;

        // --- 3. TÍNH TOÁN BIỂU ĐỒ TRÒN ---
        const thisMonthBorrowings = borrowList.filter(item => {
            const d = new Date(item.createdAt);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });

        let dPending = 0, dBorrowing = 0, dReturned = 0, dCancelled = 0, dOverdue = 0;

        thisMonthBorrowings.forEach(b => {
            if (b.ngayTra) dReturned++;
            else if (b.trangThai === 'Chờ duyệt') dPending++;
            else if (b.trangThai === 'Đã hủy') dCancelled++;
            else if (b.trangThai === 'Quá hạn') dOverdue++;
            else if (b.trangThai === 'Đang mượn') {
                const dueDate = new Date(b.ngayHetHan);
                dueDate.setHours(0,0,0,0);
                if (dueDate < today) dOverdue++;
                else dBorrowing++;
            }
        });

        doughnutChartData.value.datasets[0].data = [
            dBorrowing, dOverdue, dPending, dReturned, dCancelled
        ];

        loaded.value = true;
    } catch (error) {
        console.error("Lỗi tải dữ liệu Dashboard:", error);
        loaded.value = true; 
    }
};

const viewOverdueDetails = () => {
    router.push({ 
        path: '/staff/borrowings', 
        query: { trangThai: 'Quá hạn' } 
    });
};

const recentBorrowings = computed(() => [...borrowings.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10));
const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('vi-VN') : '---';

const getStatusLabel = (dateString, status) => {
    if (status === 'Đã trả') return { text: 'Đã trả', class: 'text-success' };
    if (status === 'Đã hủy') return { text: 'Đã hủy', class: 'text-muted' };
    if (status === 'Chờ duyệt') return { text: 'Chờ duyệt', class: 'text-warning' };
    if (status === 'Quá hạn') return { text: 'Quá hạn', class: 'text-danger fw-bold' };
    
    const deadline = new Date(dateString);
    const today = new Date();
    deadline.setHours(0,0,0,0); today.setHours(0,0,0,0);
    const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: `Trễ ${Math.abs(diffDays)} ngày`, class: 'text-danger fw-bold' };
    return { text: formatDate(dateString), class: 'text-primary' }; 
};

const approve = async (id) => {
    const result = await Swal.fire({
        title: 'Duyệt phiếu mượn?', icon: 'question', showCancelButton: true, confirmButtonText: 'Duyệt ngay', confirmButtonColor: '#198754'
    });
    if (result.isConfirmed) {
        try { await BorrowingService.approve(id); toast.success("Duyệt thành công!"); fetchData(); } catch(e) { toast.error(e.response?.data?.message); }
    }
};

const reject = async (id) => {
    const result = await Swal.fire({
        title: 'Từ chối yêu cầu?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Từ chối'
    });
    if (result.isConfirmed) {
        try { await BorrowingService.reject(id); toast.success("Đã từ chối!"); fetchData(); } catch(e) { toast.error(e.response?.data?.message); }
    }
};

const returnBook = async (id) => {
    const result = await Swal.fire({
        title: 'Xác nhận trả sách?', icon: 'info', showCancelButton: true, confirmButtonText: 'Xác nhận trả', confirmButtonColor: '#0d6efd'
    });
    if (result.isConfirmed) {
        try { await BorrowingService.returnBook(id); toast.success("Trả sách thành công!"); fetchData(); } catch(e) { toast.error(e.message); }
    }
};

onMounted(() => { fetchData(); });
</script>

<style scoped>
.card { transition: transform 0.2s; }
.card:hover { transform: translateY(-3px); }
.col { min-width: 200px; }
.cursor-pointer { cursor: pointer; }
</style>
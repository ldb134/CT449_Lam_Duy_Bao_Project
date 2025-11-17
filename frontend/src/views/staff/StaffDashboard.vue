<template>
  <div class="staff-dashboard">
    <h2 class="mb-4 fw-bold text-primary">
       <font-awesome-icon icon="chart-pie" class="me-2" /> Tổng Quan Hệ Thống
    </h2>
    
    <div class="row mb-4">
      <div class="col-md-4">
        <div class="card text-white bg-primary mb-3 shadow border-0">
          <div class="card-body d-flex justify-content-between align-items-center">
            <div>
              <h5 class="card-title fw-light">Yêu cầu chờ duyệt</h5>
              <p class="card-text fs-1 fw-bold">{{ pendingCount }}</p>
            </div>
            <font-awesome-icon icon="bell" size="3x" class="opacity-50" />
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card text-white bg-success mb-3 shadow border-0">
          <div class="card-body d-flex justify-content-between align-items-center">
            <div>
               <h5 class="card-title fw-light">Đang mượn</h5>
               <p class="card-text fs-1 fw-bold">{{ borrowingCount }}</p>
            </div>
            <font-awesome-icon icon="book-reader" size="3x" class="opacity-50" />
          </div>
        </div>
      </div>
    </div>

    <div class="card shadow-sm border-0">
      <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
        <h5 class="mb-0 fw-bold text-secondary">
          <font-awesome-icon icon="list-alt" class="me-2" /> Danh sách phiếu mượn
        </h5>
        <button class="btn btn-sm btn-outline-secondary" @click="fetchBorrowings">
          <font-awesome-icon icon="sync" /> Làm mới
        </button>
      </div>
      <div class="card-body p-0">
         <div v-if="loading" class="text-center py-4">
            <div class="spinner-border text-primary" role="status"></div>
         </div>

         <table v-else class="table table-hover mb-0 align-middle">
           <thead class="table-light">
             <tr>
               <th scope="col" class="ps-4">Mã Phiếu</th>
               <th scope="col">Độc Giả</th>
               <th scope="col">Mã Sách</th>
               <th scope="col">Ngày Mượn</th>
               <th scope="col">Hạn Trả</th>
               <th scope="col">Trạng Thái</th>
               <th scope="col" class="text-center">Hành Động</th>
             </tr>
           </thead>
           <tbody>
             <tr v-for="item in borrowings" :key="item._id">
               <td class="ps-4 fw-bold text-muted small">#{{ item._id.slice(-6).toUpperCase() }}</td>
               <td>{{ item.madocgia }}</td>
               <td>{{ item.masach }}</td>
               <td>{{ item.ngayMuon || '---' }}</td>
               <td>{{ item.ngayHetHan || '---' }}</td>
               
               <td>
                 <span v-if="item.trangThai === 'Chờ duyệt'" class="badge bg-warning text-dark">Chờ duyệt</span>
                 <span v-else-if="item.trangThai === 'Đang mượn'" class="badge bg-primary">Đang mượn</span>
                 <span v-else-if="item.trangThai === 'Đã trả'" class="badge bg-success">Đã trả</span>
               </td>

               <td class="text-center">
                 <div v-if="item.trangThai === 'Chờ duyệt'">
                   <button class="btn btn-sm btn-outline-primary me-2" title="Duyệt" @click="approve(item._id)">
                      <font-awesome-icon icon="check" /> Duyệt
                   </button>
                   <button class="btn btn-sm btn-outline-danger" title="Từ chối" @click="reject(item._id)">
                      <font-awesome-icon icon="times" />
                   </button>
                 </div>

                 <div v-else-if="item.trangThai === 'Đang mượn'">
                    <button class="btn btn-sm btn-success" title="Khách trả sách" @click="returnBook(item._id)">
                      <font-awesome-icon icon="undo" /> Trả sách
                   </button>

                   <button 
                        v-if="item.soLanGiaHan === 0"
                        class="btn btn-sm btn-warning text-dark" 
                        title="Gia hạn thêm 7 ngày" 
                        @click="renew(item._id)"
                    >
                      <font-awesome-icon icon="clock" /> Gia hạn
                    </button>
                    <span v-else class="badge bg-secondary">Đã gia hạn</span>
                 </div>

                 <div v-else>
                    <span class="text-muted small"><font-awesome-icon icon="check-circle" /> Hoàn tất</span>
                 </div>
               </td>
             </tr>
           </tbody>
         </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import BorrowingService from '@/services/borrowing.service';

const borrowings = ref([]);
const loading = ref(false);

const pendingCount = computed(() => borrowings.value.filter(b => b.trangThai === 'Chờ duyệt').length);
const borrowingCount = computed(() => borrowings.value.filter(b => b.trangThai === 'Đang mượn').length);

const fetchBorrowings = async () => {
    loading.value = true;
    try {
        borrowings.value = await BorrowingService.getAll();
        borrowings.value.sort((a, b) => {
             if (a.trangThai === 'Chờ duyệt' && b.trangThai !== 'Chờ duyệt') return -1;
             if (a.trangThai !== 'Chờ duyệt' && b.trangThai === 'Chờ duyệt') return 1;
             return new Date(b.updatedAt) - new Date(a.updatedAt); 
        });
    } catch (error) {
        console.error("Lỗi tải danh sách:", error);
    } finally {
        loading.value = false;
    }
};

const approve = async (id) => {
    if (!confirm("Bạn có chắc muốn duyệt phiếu mượn này?")) return;
    try {
        await BorrowingService.approve(id);
        alert("Đã duyệt thành công!");
        fetchBorrowings(); 
    } catch (error) {
        alert(error.response?.data?.message || "Lỗi khi duyệt!");
    }
};

const renew = async (id) => {
    try {
        await BorrowingService.renew(id);
        fetchBorrowings(); 
    } catch (error) {
        alert(error.response?.data?.message || "Lỗi khi gia hạn!");
    }
};

const returnBook = async (id) => {
    if (!confirm("Xác nhận độc giả đã trả sách?")) return;
    try {
        await BorrowingService.returnBook(id);
        alert("Đã trả sách thành công!");
        fetchBorrowings();
    } catch (error) {
        alert("Lỗi khi trả sách!");
    }
};

const reject = async (id) => {
    if (!confirm("Bạn muốn từ chối và xóa yêu cầu này?")) return;
    try {
        await BorrowingService.delete(id);
        fetchBorrowings();
    } catch (error) {
        alert("Lỗi khi xóa!");
    }
};

onMounted(() => {
    fetchBorrowings();
});
</script>

<style scoped>
.card { transition: transform 0.2s; }
.card:hover { transform: translateY(-5px); }
</style>
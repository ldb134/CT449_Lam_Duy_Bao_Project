<template>
    <div class="container-fluid">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="text-primary fw-bold">
                <font-awesome-icon icon="clipboard-list" class="me-2" /> Quản Lý Mượn Trả
            </h2>
            <button class="btn btn-outline-secondary" @click="refreshData">
                <font-awesome-icon icon="sync" /> Làm mới
            </button>
        </div>

        <div class="card shadow-sm border-0 mb-4">
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-4">
                         <div class="input-group">
                            <span class="input-group-text bg-white"><font-awesome-icon icon="search" /></span>
                            <input 
                                type="text" 
                                class="form-control" 
                                placeholder="Nhập mã độc giả..." 
                                v-model="searchText"
                                @keyup.enter="fetchData"
                            >
                        </div>
                    </div>
                    <div class="col-md-8">
                        <div class="nav nav-pills">
                            <button class="nav-link" :class="{ active: activeTab === '' }" @click="changeTab('')">Tất cả</button>
                            <button class="nav-link" :class="{ active: activeTab === 'Chờ duyệt' }" @click="changeTab('Chờ duyệt')">Chờ duyệt</button>
                            <button class="nav-link" :class="{ active: activeTab === 'Đang mượn' }" @click="changeTab('Đang mượn')">Đang mượn</button>
                            <button class="nav-link" :class="{ active: activeTab === 'Đã trả' }" @click="changeTab('Đã trả')">Đã trả</button>
                            <button class="nav-link" :class="{ active: activeTab === 'Quá hạn' }" @click="changeTab('Quá hạn')">Quá hạn</button>
                            <button class="nav-link" :class="{ active: activeTab === 'Đã hủy' }" @click="changeTab('Đã hủy')">Đã hủy</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card shadow-sm border-0">
            <div class="card-body p-0">
                <table class="table table-hover mb-0 align-middle">
                    <thead class="table-light">
                        <tr>
                            <th class="ps-4">Mã Phiếu</th>
                            <th>Độc Giả</th>
                            <th>Mã Sách</th>
                            <th>Hạn Trả</th>
                            <th>Trạng Thái</th>
                            <th class="text-center">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in borrowings" :key="item._id">
                            <td class="ps-4 fw-bold text-secondary small">#{{ item._id.slice(-6).toUpperCase() }}</td>
                            <td>{{ item.madocgia }}</td>
                            <td>{{ item.masach }}</td>
                            
                            <td>
                                <span :class="getStatusLabel(item.ngayHetHan, item.trangThai, item.ngayTra).class">
                                    {{ getStatusLabel(item.ngayHetHan, item.trangThai, item.ngayTra).text }}
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

                            <td class="text-center">
                                <div v-if="item.trangThai === 'Chờ duyệt'">
                                    <button class="btn btn-sm btn-outline-primary me-1" @click="approve(item._id)" title="Duyệt">
                                        <font-awesome-icon icon="check" />
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" @click="reject(item._id)" title="Hủy">
                                        <font-awesome-icon icon="times" />
                                    </button>
                                </div>
                                
                                <div v-else-if="(item.trangThai === 'Đang mượn' || item.trangThai === 'Quá hạn') && !item.ngayTra">
                                    <button class="btn btn-sm btn-success" @click="returnBook(item._id)" title="Trả sách">
                                        <font-awesome-icon icon="undo" /> Trả
                                    </button>
                                </div>
                                
                                <span v-else class="text-muted small">---</span>
                            </td>
                        </tr>
                         <tr v-if="borrowings.length === 0">
                            <td colspan="6" class="text-center py-4 text-muted">Không tìm thấy dữ liệu phù hợp.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="card-footer bg-white border-top-0 d-flex justify-content-end py-3">
                <Pagination :current-page="currentPage" :total-pages="totalPages" @change-page="changePage" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BorrowingService from '@/services/borrowing.service';
import Pagination from '@/components/Pagination.vue';
import Swal from 'sweetalert2';
import { toast } from 'vue3-toastify';
import { useRoute } from 'vue-router'; 

const route = useRoute(); 

const borrowings = ref([]);
const searchText = ref('');
const activeTab = ref(''); 
const currentPage = ref(1);
const totalPages = ref(1);

const fetchData = async () => {
    try {
        const res = await BorrowingService.getAll({ 
            page: currentPage.value, 
            limit: 10, 
            q: searchText.value,
            trangThai: activeTab.value
        });
        
        if (res.borrowings) {
            borrowings.value = res.borrowings;
            totalPages.value = res.totalPages || 1;
            currentPage.value = res.currentPage || 1;
        } else if (Array.isArray(res)) {
            borrowings.value = res;
        } else {
            borrowings.value = [];
        }

    } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 401) {
            toast.error("Phiên đăng nhập hết hạn.");
        }
    }
};

const changePage = (page) => {
    currentPage.value = page;
    fetchData();
};

const changeTab = (tab) => {
    activeTab.value = tab;
    currentPage.value = 1; 
    fetchData();
};

const refreshData = () => {
    searchText.value = '';
    activeTab.value = '';
    currentPage.value = 1;
    fetchData();
};

// --- HÀM XỬ LÝ HIỂN THỊ TRẠNG THÁI & HẠN TRẢ ---
const getStatusLabel = (dateString, status, actualReturnDate) => {
    if (status === 'Đã trả') return { text: 'Đã trả', class: 'text-success' };
    if (status === 'Đã hủy') return { text: 'Đã hủy', class: 'text-muted' };
    if (status === 'Chờ duyệt') return { text: 'Chờ duyệt', class: 'text-warning' };
    
    if (!dateString) return { text: '---', class: 'text-muted' };

    const deadline = new Date(dateString);
    deadline.setHours(0,0,0,0);
    
    const compareDate = actualReturnDate ? new Date(actualReturnDate) : new Date();
    compareDate.setHours(0,0,0,0);

    const diffDays = Math.ceil((deadline - compareDate) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        const lateText = `Trễ ${Math.abs(diffDays)} ngày`;
        
        // Trường hợp 1: Đã trả rồi nhưng bị trễ (Lưu vết)
        if (actualReturnDate) {
             return { text: `Đã trả (${lateText})`, class: 'text-danger fw-bold' };
        }
        // Trường hợp 2: Đang mượn và đang trễ
        return { text: lateText, class: 'text-danger fw-bold' };
    }
    
    if (diffDays === 0) return { text: 'Hôm nay', class: 'text-warning fw-bold' };
    if (diffDays === 1) return { text: 'Ngày mai', class: 'text-primary fw-bold' };
    
    return { text: new Date(dateString).toLocaleDateString('vi-VN'), class: 'text-primary' }; 
};

// --- CÁC HÀM HÀNH ĐỘNG ---

const reject = async (id) => {
    const result = await Swal.fire({
        title: 'Bạn chắc chắn chứ?',
        text: "Hành động này sẽ từ chối phiếu mượn!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33', 
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Vâng, từ chối!',
        cancelButtonText: 'Hủy bỏ'
    });

    if (result.isConfirmed) {
        try { 
            await BorrowingService.reject(id); 
            toast.success('Đã từ chối phiếu mượn.');
            fetchData(); 
        } catch(e) { 
            toast.error("Lỗi: " + e.message); 
        }
    }
};

const approve = async (id) => {
    const result = await Swal.fire({
        title: 'Duyệt phiếu mượn này?',
        text: "Sách sẽ được trừ khỏi kho.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#198754',
        confirmButtonText: 'Duyệt ngay'
    });

    if (result.isConfirmed) {
        try { 
            await BorrowingService.approve(id); 
            toast.success("Duyệt thành công!");
            fetchData(); 
        } catch(e) { 
            toast.error(e.response?.data?.message);
        }
    }
};

const returnBook = async (id) => {
    const result = await Swal.fire({
        title: 'Xác nhận trả sách?',
        text: "Sách đã được kiểm tra và thu hồi về kho.",
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Xác nhận trả',
        confirmButtonColor: '#0d6efd'
    });

    if (result.isConfirmed) {
        try { 
            const res = await BorrowingService.returnBook(id); 
            if (res.message.includes("KHÓA")) {
                Swal.fire('Chú ý!', res.message, 'warning');
            } else {
                toast.success(res.message);
            }
            fetchData(); 
        } catch(e) { 
            const errorMsg = e.response?.data?.message || e.message;
            toast.error("Lỗi: " + errorMsg); 
        }
    }
};

onMounted(() => {
    if (route.query.trangThai) {
        activeTab.value = route.query.trangThai;
    }
    fetchData();
});
</script>
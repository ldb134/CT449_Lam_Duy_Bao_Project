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
                                <span :class="getStatusLabel(item.ngayHetHan, item.trangThai).class">
                                    {{ getStatusLabel(item.ngayHetHan, item.trangThai).text }}
                                </span>
                            </td>

                            <td>
                                <span v-if="item.trangThai === 'Chờ duyệt'" class="badge bg-warning text-dark">Chờ duyệt</span>
                                <span v-else-if="item.trangThai === 'Đang mượn'" class="badge bg-primary">Đang mượn</span>
                                <span v-else-if="item.trangThai === 'Đã trả'" class="badge bg-success">Đã trả</span>
                                <span v-else-if="item.trangThai === 'Đã hủy'" class="badge bg-secondary">Đã hủy</span>
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
                                <div v-else-if="item.trangThai === 'Đang mượn'">
                                    <button class="btn btn-sm btn-success" @click="returnBook(item._id)" title="Trả sách">
                                        <font-awesome-icon icon="undo" /> Trả
                                    </button>
                                </div>
                                <span v-else class="text-muted small">---</span>
                            </td>
                        </tr>
                         <tr v-if="borrowings.length === 0">
                            <td colspan="6" class="text-center py-4 text-muted">Không tìm thấy dữ liệu.</td>
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
import { ref, onMounted} from 'vue';
import BorrowingService from '@/services/borrowing.service';
import Pagination from '@/components/Pagination.vue';

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

        console.log("Dữ liệu trả về:", res);
        
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
            alert("Phiên đăng nhập hết hạn.");
            
        }
    }
};

const changePage = (page) => {
    currentPage.value = page;
    fetchData();
};

const changeTab = (tab) => {
    activeTab.value = tab;
    currentPage.value = 1; // Reset về trang 1 khi đổi tab
    fetchData();
};

const refreshData = () => {
    searchText.value = '';
    activeTab.value = '';
    currentPage.value = 1;
    fetchData();
};

const getStatusLabel = (dateString, status) => {
    if (status === 'Đã trả' || status === 'Đã hủy') return { text: '---', class: 'text-muted' };
    if (status === 'Chờ duyệt') return { text: 'Đang chờ', class: 'text-muted fst-italic' };
    if (!dateString) return { text: '---', class: 'text-muted' };

    const deadline = new Date(dateString);
    const today = new Date();
    deadline.setHours(0,0,0,0); today.setHours(0,0,0,0);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: `Trễ ${Math.abs(diffDays)} ngày`, class: 'text-danger fw-bold' };
    if (diffDays === 0) return { text: 'Hôm nay', class: 'text-warning fw-bold' };
    if (diffDays === 1) return { text: 'Ngày mai', class: 'text-primary fw-bold' };
    return { text: new Date(dateString).toLocaleDateString('vi-VN'), class: 'text-success' }; 
};

// Các hàm xử lý hành động
const approve = async (id) => {
    if(!confirm("Duyệt phiếu mượn này?")) return;
    try { await BorrowingService.approve(id); fetchData(); } catch(e) { alert(e.response?.data?.message || "Lỗi!"); }
};
const reject = async (id) => {
    if(!confirm("Bạn muốn TỪ CHỐI phiếu mượn này?")) return;
    
    try { 
        await BorrowingService.reject(id); 
        alert("Đã hủy phiếu mượn!");
        fetchData(); 
    } catch(e) { 
        alert(e.response?.data?.message || "Lỗi!"); 
    }
};

const returnBook = async (id) => {
    if(!confirm("Xác nhận trả sách?")) return;
    try { await BorrowingService.returnBook(id); fetchData(); } catch(e) { alert("Lỗi!"); }
};

onMounted(() => {
    fetchData();
});
</script>
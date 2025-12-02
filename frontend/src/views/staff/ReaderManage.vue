<template>
    <div class="container-fluid">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="text-primary fw-bold">
                <font-awesome-icon icon="users" class="me-2" /> Quản Lý Độc Giả
            </h2>
            <button class="btn btn-outline-secondary" @click="refreshData">
                <font-awesome-icon icon="sync" /> Làm mới
            </button>
        </div>

        <div class="mb-4 bg-white p-3 rounded shadow-sm">
            <div class="input-group">
                <span class="input-group-text bg-transparent border-end-0"><font-awesome-icon icon="search" /></span>
                <input 
                    type="text" 
                    class="form-control border-start-0" 
                    placeholder="Tìm theo tên, số điện thoại..." 
                    v-model="searchText"
                    @keyup.enter="fetchData"
                >
                <button class="btn btn-outline-secondary" @click="fetchData">Tìm</button>
            </div>
        </div>

        <div class="card shadow-sm border-0">
            <div class="card-body p-0">
                <table class="table table-hover mb-0 align-middle">
                    <thead class="table-light">
                        <tr>
                            <th class="ps-4">Mã ĐG</th>
                            <th>Họ và Tên</th>
                            <th>Liên Lạc</th>
                            <th class="text-center">Vi Phạm</th>
                            <th>Trạng Thái</th>
                            <th class="text-end pe-4">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="reader in readers" :key="reader._id" :class="{'table-secondary': reader.trangThai === 'Bị khóa'}">
                            <td class="ps-4 fw-bold text-secondary">{{ reader.madocgia }}</td>
                            <td>
                                <span class="fw-bold text-primary d-block">{{ reader.hoLot }} {{ reader.ten }}</span>
                            </td>
                            <td>
                                <div class="fw-bold">{{ reader.dienThoai }}</div>
                            </td>
                            
                            <td class="text-center">
                                <span class="badge rounded-pill" 
                                    :class="reader.soLanTreHan >= 3 ? 'bg-danger' : (reader.soLanTreHan > 0 ? 'bg-warning text-dark' : 'bg-light text-muted border')">
                                    {{ reader.soLanTreHan || 0 }}/3
                                </span>
                            </td>

                            <td>
                                <span v-if="reader.trangThai === 'Bị khóa'" class="badge bg-danger">
                                    <font-awesome-icon icon="lock" class="me-1" /> Bị khóa
                                </span>
                                <span v-else class="badge bg-success">
                                    <font-awesome-icon icon="check-circle" class="me-1" /> Hoạt động
                                </span>
                            </td>

                            <td class="text-end pe-4">
                                <button class="btn btn-sm btn-outline-primary me-2" @click="viewHistory(reader)" title="Xem lịch sử mượn">
                                    <font-awesome-icon icon="eye" />
                                </button>
                                <button 
                                    class="btn btn-sm me-2" 
                                    :class="reader.trangThai === 'Bị khóa' ? 'btn-success' : 'btn-warning'"
                                    @click="toggleStatus(reader)"
                                    :title="reader.trangThai === 'Bị khóa' ? 'Mở khóa' : 'Khóa tài khoản'"
                                >
                                    <font-awesome-icon :icon="reader.trangThai === 'Bị khóa' ? 'unlock' : 'lock'" />
                                </button>

                                <button class="btn btn-sm btn-outline-danger" @click="deleteReader(reader)" title="Xóa">
                                    <font-awesome-icon icon="trash" />
                                </button>
                            </td>
                        </tr>
                        <tr v-if="readers.length === 0">
                            <td colspan="6" class="text-center py-4 text-muted">Không tìm thấy độc giả nào.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="card-footer bg-white border-top-0 d-flex justify-content-end py-3">
                <Pagination 
                    :current-page="currentPage" 
                    :total-pages="totalPages" 
                    @change-page="changePage" 
                />
            </div>
        </div>
        
        <div v-if="showHistoryModal" class="modal-backdrop fade show"></div>
        <div v-if="showHistoryModal" class="modal fade show d-block" tabindex="-1">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-info text-white">
                        <h5 class="modal-title fw-bold">
                            <font-awesome-icon icon="history" class="me-2"/>
                            Lịch sử mượn: {{ selectedReader.hoLot }} {{ selectedReader.ten }}
                        </h5>
                        <button type="button" class="btn-close" @click="closeHistoryModal"></button>
                    </div>
                    <div class="modal-body p-0">
                        <table class="table table-striped mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th class="ps-3">Mã Sách</th>
                                    <th>Ngày Mượn</th>
                                    <th>Hạn Trả</th>
                                    <th>Trạng Thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in historyList" :key="item._id">
                                    <td class="ps-3 fw-bold">{{ item.masach }}</td>
                                    <td>{{ formatDate(item.ngayMuon || item.createdAt) }}</td>
                                    <td>{{ formatDate(item.ngayHetHan) }}</td>
                                    <td>
                                        <span v-if="item.trangThai === 'Đang mượn'" class="badge bg-primary">Đang mượn</span>
                                        <span v-else-if="item.trangThai === 'Đã trả'" class="badge bg-success">Đã trả</span>
                                        <span v-else-if="item.trangThai === 'Chờ duyệt'" class="badge bg-warning text-dark">Chờ duyệt</span>
                                        <span v-else class="badge bg-secondary">{{ item.trangThai }}</span>
                                    </td>
                                </tr>
                                <tr v-if="historyList.length === 0">
                                    <td colspan="4" class="text-center py-3 text-muted">Độc giả này chưa mượn cuốn nào.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeHistoryModal">Đóng</button>
                    </div>
                </div>
            </div>
        </div>
        </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ReaderService from '@/services/reader.service';
import BorrowingService from '@/services/borrowing.service'; 
import Pagination from '@/components/Pagination.vue'; 

const readers = ref([]);
const searchText = ref('');
const currentPage = ref(1);
const totalPages = ref(1);

const showHistoryModal = ref(false);
const selectedReader = ref({});
const historyList = ref([]);

const fetchData = async () => {
    try {
        const res = await ReaderService.getAll({ 
            page: currentPage.value, 
            limit: 10, 
            q: searchText.value 
        });
        
        readers.value = res.readers || [];
        totalPages.value = res.totalPages || 1;
        currentPage.value = res.currentPage || 1;
    } catch (error) {
        console.error(error);
    }
};

const changePage = (page) => {
    currentPage.value = page;
    fetchData();
};

const refreshData = () => {
    searchText.value = '';   
    currentPage.value = 1;  
    fetchData();             
};

const toggleStatus = async (reader) => {
    const newStatus = reader.trangThai === 'Bị khóa' ? 'Hoạt động' : 'Bị khóa';
    if (!confirm(`Bạn có chắc muốn đổi trạng thái thành ${newStatus}?`)) return;

    try {
        const updateData = { trangThai: newStatus };
        if (newStatus === 'Hoạt động') {
            updateData.soLanTreHan = 0; 
        }

        await ReaderService.update(reader.madocgia, updateData);
        alert("Cập nhật thành công!");
        fetchData();
    } catch (error) {
        alert("Lỗi: " + error.message);
    }
};

const deleteReader = async (reader) => {
    if (!confirm(`Xóa độc giả ${reader.ten}?`)) return;
    try {
        await ReaderService.delete(reader.madocgia);
        alert("Đã xóa!");
        fetchData();
    } catch (error) {
        console.log(error); 
        alert("Không thể xóa (có thể đang mượn sách).");
    }
};

const viewHistory = async (reader) => {
    selectedReader.value = reader;
    try {
        const res = await BorrowingService.getAll({ madocgia: reader.madocgia });
        historyList.value = res;
        showHistoryModal.value = true;
    } catch (error) {
        alert("Lỗi tải lịch sử: " + error.message);
    }
};

const closeHistoryModal = () => {
    showHistoryModal.value = false;
    historyList.value = [];
};

const formatDate = (dateString) => {
    if (!dateString) return '---';
    return new Date(dateString).toLocaleDateString('vi-VN');
};

onMounted(() => {
    fetchData();
});
</script>
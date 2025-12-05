<template>
    <div class="container-fluid">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="text-primary fw-bold">
                <font-awesome-icon icon="history" class="me-2" /> Nhật Ký Hoạt Động
            </h2>
            <button class="btn btn-outline-secondary" @click="refreshData">
                <font-awesome-icon icon="sync" /> Làm mới
            </button>
        </div>

        <div class="card shadow-sm border-0">
            <div class="card-body p-0">
                <table class="table table-hover mb-0 align-middle">
                    <thead class="table-light">
                        <tr>
                            <th class="ps-4">Thời Gian</th>
                            <th>Nhân Viên</th>
                            <th>Độc Giả</th>
                            <th>Hành Động</th>
                            <th>Chi Tiết / Ghi Chú</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="log in logs" :key="log._id">
                            <td class="ps-4 text-muted small">
                                {{ formatDateTime(log.createdAt) }}
                            </td>
                            <td>
                                <span class="fw-bold text-dark">
                                    <font-awesome-icon icon="user-tie" class="me-1 text-secondary"/>
                                    {{ log.nhanVienId }}
                                </span>
                            </td>
                            <td>
                                <span class="badge bg-light text-dark border">
                                    {{ log.madocgia }}
                                </span>
                            </td>
                            <td>
                                <span :class="getActionBadge(log.hanhDong)">
                                    {{ getActionText(log.hanhDong) }}
                                </span>
                            </td>
                            <td>{{ log.ghiChu }}</td>
                        </tr>
                        <tr v-if="logs.length === 0">
                            <td colspan="5" class="text-center py-4 text-muted">Chưa có nhật ký nào.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="card-footer bg-white border-top-0 d-flex justify-content-between align-items-center py-3">
                <div class="small text-muted">
                    Hiển thị trang {{ currentPage }} / {{ totalPages }} (Tổng {{ totalItems }} hoạt động)
                </div>
                <Pagination 
                    :current-page="currentPage" 
                    :total-pages="totalPages" 
                    @change-page="changePage" 
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TransactionService from '@/services/transaction.service';
import Pagination from '@/components/Pagination.vue'; 

const logs = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);

const fetchData = async () => {
    try {
        const res = await TransactionService.getAll({
            page: currentPage.value,
            limit: 10
        });

        logs.value = res.logs || [];
        totalPages.value = res.totalPages || 1;
        currentPage.value = res.currentPage || 1;
        totalItems.value = res.totalItems || 0;

    } catch (error) {
        console.error(error);
    }
};

const changePage = (page) => {
    currentPage.value = page;
    fetchData();
};

const refreshData = () => {
    currentPage.value = 1;
    fetchData();
};

const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
        hour: '2-digit', minute: '2-digit',
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
};

const getActionBadge = (action) => {
    switch (action) {
        case 'DUYET': return 'badge bg-success';
        case 'TU_CHOI': return 'badge bg-danger';
        case 'TRA_SACH': return 'badge bg-primary';
        case 'GIA_HAN': return 'badge bg-warning text-dark';
        default: return 'badge bg-secondary';
    }
};

const getActionText = (action) => {
    switch (action) {
        case 'DUYET': return 'Duyệt mượn';
        case 'TU_CHOI': return 'Từ chối';
        case 'TRA_SACH': return 'Trả sách';
        case 'GIA_HAN': return 'Gia hạn';
        default: return action;
    }
};

onMounted(() => {
    fetchData();
});
</script>
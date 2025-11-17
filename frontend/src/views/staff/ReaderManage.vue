<template>
    <div class="container-fluid">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="text-primary fw-bold">
                <font-awesome-icon icon="users" class="me-2" /> Quản Lý Độc Giả
            </h2>
        </div>

        <div class="mb-4 bg-white p-3 rounded shadow-sm">
            <div class="input-group">
                <span class="input-group-text bg-transparent border-end-0"><font-awesome-icon icon="search" /></span>
                <input type="text" class="form-control border-start-0" placeholder="Tìm theo tên, số điện thoại..." v-model="searchText">
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
                            <th>Giới Tính / Năm Sinh</th>
                            <th class="text-end pe-4">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="reader in filteredReaders" :key="reader._id">
                            <td class="ps-4 fw-bold text-secondary">{{ reader.madocgia }}</td>
                            <td>
                                <span class="fw-bold text-primary d-block">{{ reader.hoLot }} {{ reader.ten }}</span>
                                <small class="text-muted">{{ reader.diaChi }}</small>
                            </td>
                            <td>
                                <div class="fw-bold">{{ reader.dienThoai }}</div>
                            </td>
                            <td>
                                <div>{{ reader.phai }}</div>
                                <small class="text-muted">{{ formatDate(reader.ngaySinh) }}</small>
                            </td>
                            <td class="text-end pe-4">
                                <button class="btn btn-sm btn-outline-danger" @click="deleteReader(reader)" title="Xóa độc giả">
                                    <font-awesome-icon icon="trash" />
                                </button>
                            </td>
                        </tr>
                        <tr v-if="filteredReaders.length === 0">
                            <td colspan="5" class="text-center py-4 text-muted">Không tìm thấy độc giả nào.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ReaderService from '@/services/reader.service';

const readers = ref([]);
const searchText = ref('');

const fetchData = async () => {
    try {
        readers.value = await ReaderService.getAll();
    } catch (error) {
        console.error(error);
    }
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString; 
};

const filteredReaders = computed(() => {
    if (!searchText.value) return readers.value;
    const lower = searchText.value.toLowerCase();
    return readers.value.filter(r => 
        r.dienThoai.includes(lower) || 
        (r.hoLot + ' ' + r.ten).toLowerCase().includes(lower) ||
        r.madocgia.toLowerCase().includes(lower)
    );
});

const deleteReader = async (reader) => {
    if (!confirm(`Bạn có chắc muốn xóa độc giả "${reader.hoLot} ${reader.ten}"?\nHành động này không thể hoàn tác.`)) return;
    try {
        await ReaderService.delete(reader.madocgia);
        alert("Đã xóa độc giả!");
        fetchData();
    } catch (error) {
        alert("Không thể xóa! Có thể độc giả này đang mượn sách.");
    }
};

onMounted(() => {
    fetchData();
});
</script>
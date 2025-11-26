<template>
    <div class="container-fluid">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="text-primary fw-bold">
                <font-awesome-icon icon="users" class="me-2" /> Quản Lý Độc Giả
            </h2>
            <button class="btn btn-outline-secondary" @click="fetchData">
                <font-awesome-icon icon="sync" /> Làm mới
            </button>
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
                            <th class="text-center">Vi Phạm</th>
                            <th>Trạng Thái</th>
                            <th class="text-end pe-4">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="reader in filteredReaders" :key="reader._id" :class="{'table-secondary': reader.trangThai === 'Bị khóa'}">
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

const filteredReaders = computed(() => {
    if (!searchText.value) return readers.value;
    const lower = searchText.value.toLowerCase();
    return readers.value.filter(r => 
        (r.dienThoai && r.dienThoai.includes(lower)) || 
        (r.hoLot + ' ' + r.ten).toLowerCase().includes(lower) ||
        r.madocgia.toLowerCase().includes(lower)
    );
});

// Hàm Khóa/Mở khóa thủ công 
const toggleStatus = async (reader) => {
    const newStatus = reader.trangThai === 'Bị khóa' ? 'Hoạt động' : 'Bị khóa';
    if (!confirm(`Bạn có chắc muốn đổi trạng thái thành ${newStatus}?`)) return;

    try {
        // Cập nhật trạng thái 
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

onMounted(() => {
    fetchData();
});
</script>
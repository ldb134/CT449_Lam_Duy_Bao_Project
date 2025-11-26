<template>
    <table class="table table-hover mb-0 align-middle">
        <thead class="table-light">
            <tr>
                <th class="ps-4">Mã ĐG</th>
                <th>Họ và Tên</th>
                <th>Liên Lạc</th>
                <th>Trạng Thái</th> 
                <th class="text-end pe-4">Hành Động</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="reader in filteredReaders" :key="reader._id" :class="{'table-secondary': reader.trangThai === 'Bị khóa'}">
                <td class="ps-4 fw-bold">{{ reader.madocgia }}</td>
                <td>
                    <span class="fw-bold d-block">{{ reader.hoLot }} {{ reader.ten }}</span>
                    <small class="text-muted">{{ reader.diaChi }}</small>
                </td>
                <td>
                    <div class="fw-bold">{{ reader.dienThoai }}</div>
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
                        :title="reader.trangThai === 'Bị khóa' ? 'Mở khóa tài khoản' : 'Vô hiệu hóa tài khoản'"
                    >
                        <font-awesome-icon :icon="reader.trangThai === 'Bị khóa' ? 'unlock' : 'lock'" />
                    </button>

                    <button class="btn btn-sm btn-outline-danger" @click="deleteReader(reader)" title="Xóa độc giả">
                        <font-awesome-icon icon="trash" />
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
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
        r.dienThoai.includes(lower) || 
        (r.hoLot + ' ' + r.ten).toLowerCase().includes(lower) ||
        r.madocgia.toLowerCase().includes(lower)
    );
});

const toggleStatus = async (reader) => {
    const newStatus = reader.trangThai === 'Bị khóa' ? 'Hoạt động' : 'Bị khóa';
    const actionName = newStatus === 'Bị khóa' ? 'VÔ HIỆU HÓA' : 'MỞ KHÓA';

    if (!confirm(`Bạn có chắc muốn ${actionName} tài khoản của ${reader.hoLot} ${reader.ten}?`)) return;

    try {
        // Gọi API update có sẵn trong ReaderService
        await ReaderService.update(reader.madocgia, { trangThai: newStatus });
        alert(`Đã ${actionName.toLowerCase()} thành công!`);
        fetchData(); 
    } catch (error) {
        alert("Lỗi cập nhật trạng thái: " + (error.response?.data?.message || error.message));
    }
};

const deleteReader = async (reader) => {
    if (!confirm(`Bạn có chắc muốn xóa độc giả "${reader.hoLot} ${reader.ten}"?\nHành động này không thể hoàn tác.`)) return;
    try {
        await ReaderService.delete(reader.madocgia);
        alert("Đã xóa độc giả!");
        fetchData();
    } catch (error) {
        console.log(error);
        alert("Không thể xóa! Có thể độc giả này đang mượn sách.");
    }
};

onMounted(() => {
    fetchData();
});
</script>
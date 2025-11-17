<template>
    <div class="container mt-4">
        <h2 class="text-primary fw-bold mb-4">
            <font-awesome-icon icon="history" class="me-2" /> Lịch Sử Mượn Sách
        </h2>

        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2">Đang tải dữ liệu...</p>
        </div>

        <div v-else>
            <div v-if="myBorrowings.length === 0" class="alert alert-info text-center">
                Bạn chưa mượn cuốn sách nào. <router-link to="/">Mượn ngay!</router-link>
            </div>

            <div v-else class="card shadow-sm border-0">
                <div class="card-body p-0">
                    <table class="table table-hover mb-0 align-middle">
                        <thead class="table-light">
                            <tr>
                                <th class="ps-4">Thông Tin Sách</th> 
                                <th>Ngày Mượn</th>
                                <th>Hạn Trả</th>
                                <th>Trạng Thái</th>
                                <th class="text-center">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in myBorrowings" :key="item._id">
                                <td class="ps-4">
                                    <span class="fw-bold text-primary d-block">{{ getBookName(item.masach) }}</span>
                                    <small class="text-muted">
                                        <font-awesome-icon icon="pen-nib" class="me-1" />
                                        {{ getBookAuthor(item.masach) }}
                                    </small>
                                </td>
                                
                                <td>{{ item.ngayMuon || '---' }}</td>
                                <td :class="{'text-danger fw-bold': isOverdue(item)}">
                                    {{ item.ngayHetHan || '---' }}
                                </td>
                                <td>
                                    <span v-if="item.trangThai === 'Chờ duyệt'" class="badge bg-warning text-dark">Chờ duyệt</span>
                                    <span v-else-if="item.trangThai === 'Đang mượn'" class="badge bg-primary">Đang mượn</span>
                                    <span v-else class="badge bg-success">Đã trả</span>
                                </td>
                                <td class="text-center">
                                    <button 
                                        v-if="item.trangThai === 'Đang mượn' && item.soLanGiaHan === 0"
                                        class="btn btn-sm btn-outline-warning text-dark"
                                        @click="renewBook(item._id)"
                                        title="Gia hạn thêm 7 ngày ngay lập tức"
                                    >
                                        <font-awesome-icon icon="clock" /> Gia hạn
                                    </button>
                                    <small v-if="item.trangThai === 'Đang mượn' && item.soLanGiaHan > 0" class="text-muted fst-italic">
                                        <font-awesome-icon icon="check-circle" /> Đã gia hạn
                                    </small>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BorrowingService from '@/services/borrowing.service';
import BookService from '@/services/book.service';
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();
const myBorrowings = ref([]);
const books = ref([]); 
const loading = ref(false);

const getBookName = (masach) => {
    const book = books.value.find(b => b.masach === masach);
    return book ? book.tenSach : 'Sách không xác định';
};

const getBookAuthor = (masach) => {
    const book = books.value.find(b => b.masach === masach);
    return book ? book.tacGia : '';
};

const fetchData = async () => {
    if (!authStore.isLoggedIn) return;
    loading.value = true;
    try {
        const [borrowingsData, booksData] = await Promise.all([
            BorrowingService.getAll(),
            BookService.getAll()
        ]);

        books.value = booksData;
        myBorrowings.value = borrowingsData.filter(b => b.madocgia === authStore.user.madocgia);
        myBorrowings.value.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};

const renewBook = async (id) => {
    if (!confirm("Bạn muốn gia hạn sách này thêm 7 ngày?")) return;
    try {
        await BorrowingService.renew(id);
        alert("Gia hạn thành công!");
        fetchData();
    } catch (error) {
        alert(error.response?.data?.message || "Không thể gia hạn!");
    }
};

const isOverdue = (item) => {
    const deadlineStr = item.ngayHetHan;
    if (!deadlineStr || item.trangThai !== 'Đang mượn') return false;
    
    const [day, month, year] = deadlineStr.split('-');
    const deadline = new Date(`${year}-${month}-${day}`);
    deadline.setHours(23, 59, 59, 999); 
    return new Date() > deadline;
};

onMounted(() => {
    fetchData();
});
</script>
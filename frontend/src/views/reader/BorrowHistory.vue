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
                                
                                <td>
                                    <span v-if="item.ngayMuon" class="fw-bold text-dark">
                                        {{ formatDate(item.ngayMuon) }}
                                    </span>
                                    <span v-else>---</span>
                                </td>

                                <td>
                                    <span v-if="item.ngayHetHan" :class="{'text-danger fw-bold': isOverdue(item), 'fw-bold': !isOverdue(item)}">
                                        {{ formatDate(item.ngayHetHan) }}
                                    </span>
                                    <span v-else>---</span>
                                </td>

                                <td>
                                    <span v-if="item.trangThai === 'Chờ duyệt'" class="badge bg-warning text-dark">Chờ duyệt</span>
                                    <span v-else-if="item.trangThai === 'Đang mượn'" class="badge bg-primary">Đang mượn</span>
                                    <span v-else-if="item.trangThai === 'Đã trả'" class="badge bg-success">Đã trả</span>
                                    <span v-else-if="item.trangThai === 'Đã hủy'" class="badge bg-secondary">Đã hủy</span>
                                    <span v-else class="badge bg-secondary">{{ item.trangThai }}</span>
                                </td>
                                
                                <td class="text-center">
                                    <button 
                                        v-if="item.trangThai === 'Đang mượn' && item.soLanGiaHan === 0"
                                        class="btn btn-sm btn-outline-warning text-dark"
                                        @click="renewBook(item._id)"
                                        title="Gia hạn thêm 7 ngày"
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
import { toast } from 'vue3-toastify'; 

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

const formatDate = (dateString) => {
    if (!dateString) return '---';
    return new Date(dateString).toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
};

const fetchData = async () => {
    if (!authStore.isLoggedIn) return;
    loading.value = true;
    try {
        const [borrowRes, bookRes] = await Promise.all([
            BorrowingService.getAll({ 
                madocgia: authStore.user.madocgia,
                limit: 100 
            }), 
            BookService.getAll({ limit: 1000 }) 
        ]);

        if (borrowRes.borrowings) {
            myBorrowings.value = borrowRes.borrowings;
        } else if (Array.isArray(borrowRes)) {
            myBorrowings.value = borrowRes;
        } else {
            myBorrowings.value = [];
        }

        if (bookRes.books) {
            books.value = bookRes.books;
        } else if (Array.isArray(bookRes)) {
            books.value = bookRes;
        } else {
            books.value = [];
        }

        myBorrowings.value.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    } catch (error) {
        console.error("Lỗi tải lịch sử:", error);
        toast.error("Không tải được dữ liệu. Vui lòng thử lại sau."); 
    } finally {
        loading.value = false;
    }
};

const renewBook = async (id) => {
    if (!confirm("Bạn muốn gia hạn sách này thêm 7 ngày?")) return;
    try {
        await BorrowingService.renew(id);
        toast.success("Gia hạn thành công!"); 
        fetchData();
    } catch (error) {
        toast.error(error.response?.data?.message || "Không thể gia hạn!");
    }
};

const isOverdue = (item) => {
    const deadlineStr = item.ngayHetHan;
    if (!deadlineStr || item.trangThai !== 'Đang mượn') return false;
    
    const deadline = new Date(deadlineStr);
    const now = new Date();
    deadline.setHours(23, 59, 59, 999); 
    return now > deadline;
};

onMounted(() => {
    fetchData();
});
</script>
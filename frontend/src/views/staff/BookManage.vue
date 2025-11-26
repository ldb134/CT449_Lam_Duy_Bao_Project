<template>
    <div class="container-fluid">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="text-primary fw-bold">
                <font-awesome-icon icon="book" class="me-2" /> Quản Lý Sách
            </h2>
            <button class="btn btn-primary" @click="openAddModal">
                <font-awesome-icon icon="plus" /> Thêm Sách Mới
            </button>
        </div>

        <div class="mb-4 bg-white p-3 rounded shadow-sm">
            <div class="input-group">
                <span class="input-group-text bg-transparent border-end-0"><font-awesome-icon icon="search" /></span>
                <input type="text" class="form-control border-start-0" placeholder="Tìm kiếm tên sách, tác giả..." v-model="searchText">
            </div>
        </div>

        <div class="card shadow-sm border-0">
            <div class="card-body p-0">
                <table class="table table-hover mb-0 align-middle">
                    <thead class="table-light">
                        <tr>
                            <th class="ps-4">Ảnh</th>
                            <th>Tên Sách</th>
                            <th>Giá / Kho</th>
                            <th>NXB / Năm</th>
                            <th class="text-end pe-4">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="book in filteredBooks" :key="book._id">
                            <td class="ps-4">
                                <img :src="book.anh" class="rounded border" style="width: 40px; height: 60px; object-fit: cover;" @error="setDefaultImage">
                            </td>
                            <td>
                                <span class="fw-bold text-primary d-block">{{ book.tenSach }}</span>
                                <small class="text-muted">{{ book.tacGia }}</small>
                                <br><small class="text-muted fst-italic">{{ book.masach }}</small>
                            </td>
                            <td>
                                <div class="fw-bold">{{ formatPrice(book.donGia) }}</div>
                                <small :class="book.soQuyen > 0 ? 'text-success' : 'text-danger'">
                                    Kho: {{ book.soQuyen }}
                                </small>
                            </td>
                            <td>
                                <div>{{ getPublisherName(book.manxb) }}</div>
                                <small class="text-muted">{{ book.namXuatBan }}</small>
                            </td>
                            <td class="text-end pe-4">
                                <button class="btn btn-sm btn-outline-warning me-2" @click="openEditModal(book)" title="Sửa">
                                    <font-awesome-icon icon="edit" />
                                </button>
                                <button class="btn btn-sm btn-outline-danger" @click="deleteBook(book)" title="Xóa">
                                    <font-awesome-icon icon="trash" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-if="showModal" class="modal-backdrop fade show"></div>
        <div v-if="showModal" class="modal fade show d-block" tabindex="-1">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title fw-bold">{{ isEditing ? 'Cập Nhật Sách' : 'Thêm Sách Mới' }}</h5>
                        <button type="button" class="btn-close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <BookForm :book="selectedBook" @submit:book="handleSave" @cancel="closeModal" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import BookService from '@/services/book.service';
import PublisherService from '@/services/publisher.service';
import BookForm from '@/components/BookForm.vue';

const books = ref([]);
const publishers = ref([]);
const searchText = ref('');
const showModal = ref(false);
const isEditing = ref(false);
const selectedBook = ref({});

const fetchData = async () => {
    try {
        const [booksData, pubsData] = await Promise.all([
            BookService.getAll(),
            PublisherService.getAll()
        ]);
        books.value = booksData;
        publishers.value = pubsData;
    } catch (error) {
        console.error(error);
    }
};

const getPublisherName = (manxb) => {
    const pub = publishers.value.find(p => p.manxb === manxb);
    return pub ? pub.tenNXB : manxb;
};

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
const setDefaultImage = (e) => e.target.src = 'https://fastly.picsum.photos/id/173/200/300.jpg?hmac=9Ed5HxHOL3tFCOiW6UHx6a3hVksxDWc7L7p_WzN9N9Q'; //ảnh test

const filteredBooks = computed(() => {
    if (!searchText.value) return books.value;
    const lower = searchText.value.toLowerCase();
    return books.value.filter(b => b.tenSach.toLowerCase().includes(lower) || b.tacGia.toLowerCase().includes(lower));
});

const openAddModal = () => {
    selectedBook.value = {};
    isEditing.value = false;
    showModal.value = true;
};

const openEditModal = (book) => {
    selectedBook.value = { ...book };
    isEditing.value = true;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

const handleSave = async (bookData) => {
    try {
        if (isEditing.value) {
            await BookService.update(bookData.masach, bookData);
            alert("Cập nhật thành công!");
        } else {
            await BookService.create(bookData);
            alert("Thêm sách mới thành công!");
        }
        closeModal();
        fetchData();
    } catch (error) {
        alert("Lỗi: " + (error.response?.data?.message || error.message));
    }
};

const deleteBook = async (book) => {
    if (!confirm(`Bạn có chắc muốn xóa sách "${book.tenSach}"?`)) return;
    try {
        await BookService.delete(book.masach);
        alert("Đã xóa sách!");
        fetchData();
    } catch (error) {
        console.log(error);
        alert("Không thể xóa sách! Có thể sách đang được mượn.");
    }
};

onMounted(() => {
    fetchData();
});
</script>
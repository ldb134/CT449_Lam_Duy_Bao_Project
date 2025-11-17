<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="text-primary fw-bold">
          <font-awesome-icon icon="books" class="me-2" /> Thư Viện Trực Tuyến
      </h2>
      
      <div v-if="!authStore.isLoggedIn">
        <router-link to="/login" class="btn btn-outline-primary me-2">Đăng Nhập</router-link>
        <router-link to="/register" class="btn btn-primary">Đăng Ký</router-link>
      </div>
    </div>

    <div class="input-group mb-4 shadow-sm">
      <input type="text" class="form-control" placeholder="Tìm kiếm sách yêu thích...">
      <button class="btn btn-primary"><font-awesome-icon icon="search" /> Tìm kiếm</button>
    </div>

    <div class="row">
      <div class="col-md-3 mb-4" v-for="i in 4" :key="i">
        <div class="card h-100 shadow-sm border-0">
          <div class="card-body text-center">
            <div class="bg-light mb-3 d-flex align-items-center justify-content-center rounded" style="height: 150px;">
              <font-awesome-icon icon="book" size="4x" class="text-secondary" />
            </div>
            <h5 class="card-title fw-bold">Tên Sách {{ i }}</h5>
            <p class="card-text text-muted small">Tác giả ABC</p>
            <h6 class="text-primary fw-bold">50.000 đ</h6>
          </div>
          <div class="card-footer bg-white border-top-0">
            <button class="btn btn-success w-100 rounded-pill">Mượn Sách</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth.store';
const authStore = useAuthStore();
</script>
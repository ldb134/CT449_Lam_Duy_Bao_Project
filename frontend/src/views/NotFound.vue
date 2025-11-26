<template>
  <div class="page-not-found d-flex flex-column justify-content-center align-items-center text-center">
    <h1 class="display-1 fw-bold text-primary" style="font-size: 8rem;">404</h1>
    
    <h2 class="mb-3 fw-bold text-dark">Úi! Không tìm thấy trang này.</h2>
    
    <p class="lead text-muted mb-4" style="max-width: 500px;">
        Có vẻ như đường dẫn bạn đang truy cập không tồn tại hoặc đã bị xóa.
    </p>
    
    <div class="d-flex gap-3">
        <router-link to="/" class="btn btn-primary btn-lg rounded-pill px-4 shadow-sm">
            <font-awesome-icon icon="home" class="me-2" />
            Về Trang Chủ
        </router-link>

        <button @click="$router.go(-1)" class="btn btn-outline-secondary btn-lg rounded-pill px-4">
            Quay Lại
        </button>
    </div>
  </div>
</template>

<style scoped>
.page-not-found {
  min-height: 80vh;
  background-color: #f8f9fa; 
}
</style>
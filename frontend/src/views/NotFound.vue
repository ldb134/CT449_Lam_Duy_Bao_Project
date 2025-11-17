<template>
  <div class="page-not-found d-flex flex-column justify-content-center align-items-center text-center">
    <h1 class="display-1 fw-bold text-primary">404</h1>
    <h2 class="mb-4">Úi! Không tìm thấy trang này.</h2>
    <p class="lead mb-4">Có vẻ như đường dẫn bạn truy cập không tồn tại hoặc đã bị xóa.</p>
    
    <router-link to="/" class="btn btn-primary btn-lg">
        <font-awesome-icon icon="home" class="me-2" />
        Về Trang Chủ
    </router-link>
  </div>
</template>

<style scoped>
.page-not-found {
  height: 80vh; 
}
</style>
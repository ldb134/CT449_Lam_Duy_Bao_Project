<template>
  <footer class="bg-dark text-white pt-5 pb-3 mt-5">
    <div class="container">
      <div class="row">
        <div class="col-md-4 mb-4">
          <h5 class="text-uppercase mb-3 text-primary fw-bold">
            <font-awesome-icon icon="book-open" class="me-2" />Thư Viện
          </h5>
          <p class="text-white-50 small">
            Hệ thống quản lý thư viện trực tuyến hiện đại, giúp bạn tra cứu và mượn sách dễ dàng, nhanh chóng mọi lúc mọi nơi.
          </p>
        </div>

        <div class="col-md-4 mb-4">
          <h5 class="text-uppercase mb-3 fw-bold">Liên Kết</h5>
          <ul class="list-unstyled">
            <li class="mb-2"><router-link to="/" class="text-white-50 text-decoration-none footer-link">Trang Chủ</router-link></li>
            <li class="mb-2"><router-link to="/history" class="text-white-50 text-decoration-none footer-link">Lịch Sử Mượn</router-link></li>
            <li class="mb-2"><a href="#" class="text-white-50 text-decoration-none footer-link">Quy Định Mượn Trả</a></li>
          </ul>
        </div>

        <div class="col-md-4 mb-4">
          <h5 class="text-uppercase mb-3 fw-bold">Liên Hệ</h5>
          <ul class="list-unstyled text-white-50">
            <li class="mb-2">
              <font-awesome-icon icon="map-marker-alt" class="me-2" />
              Đại học Cần Thơ, Đường 3/2, TP. Cần Thơ
            </li>
            <li class="mb-2">
              <font-awesome-icon icon="phone" class="me-2" />
              <a href="tel:0909123456" class="text-white-50 text-decoration-none">0909 123 456</a>
            </li>
            <li class="mb-2">
              <font-awesome-icon icon="envelope" class="me-2" />
              <a href="mailto:library@ctu.edu.vn" class="text-white-50 text-decoration-none">library@ctu.edu.vn</a>
            </li>
          </ul>
          
          <div class="mt-3">
            <a href="#" class="text-white me-3 fs-5"><font-awesome-icon :icon="['fab', 'facebook']" /></a>
            <a href="#" class="text-white me-3 fs-5"><font-awesome-icon :icon="['fab', 'twitter']" /></a>
            <a href="#" class="text-white fs-5"><font-awesome-icon :icon="['fab', 'instagram']" /></a>
          </div>
        </div>
      </div>

      <hr class="border-secondary my-4">

      <div class="text-center text-white-50 small">
        &copy; 2025 Thư Viện. All rights reserved. Designed by You.
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-link:hover {
  color: #fff !important;
  text-decoration: underline !important;
}
</style>
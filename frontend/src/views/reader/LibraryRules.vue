<template>
  <div class="container mt-5 mb-5">
    <div class="row justify-content-center">
      <div class="col-md-10">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-primary text-white py-3">
            <h3 class="mb-0 fw-bold text-center">
              <font-awesome-icon icon="book-reader" class="me-2" /> QUY ĐỊNH MƯỢN TRẢ SÁCH
            </h3>
          </div>
          <div class="card-body p-5">
            
            <div class="mb-4">
              <h5 class="text-primary fw-bold border-bottom pb-2">
                <font-awesome-icon icon="user-check" class="me-2" /> 1. Đối tượng phục vụ
              </h5>
              <p>Tất cả các độc giả đã đăng ký tài khoản thành công và được cấp thẻ (hoặc tài khoản trực tuyến) tại Thư Viện.</p>
            </div>

            <div class="mb-4">
              <h5 class="text-primary fw-bold border-bottom pb-2">
                <font-awesome-icon icon="clock" class="me-2" /> 2. Thời gian và Số lượng mượn
              </h5>
              <ul>
                <li><strong>Số lượng:</strong> Mỗi độc giả được mượn tối đa <strong>3 cuốn sách</strong> cùng một lúc.</li>
                <li><strong>Thời hạn mượn:</strong> Tối đa <strong>7 ngày</strong> cho mỗi lần mượn.</li>
                <li><strong>Gia hạn:</strong> Độc giả được phép gia hạn <strong>01 lần</strong> duy nhất cho mỗi cuốn sách (thêm 7 ngày) nếu sách đó chưa quá hạn.</li>
              </ul>
            </div>

            <div class="mb-4">
              <h5 class="text-primary fw-bold border-bottom pb-2">
                <font-awesome-icon icon="clipboard-list" class="me-2" /> 3. Quy trình Đăng ký & Nhận sách
              </h5>
              <ol>
                <li>Độc giả tìm kiếm sách trên website và gửi <strong>Yêu cầu mượn</strong>.</li>
                <li>Độc giả chọn <strong>"Ngày muốn nhận sách"</strong> khi gửi yêu cầu.</li>
                <li>Hệ thống sẽ gửi yêu cầu đến Thủ thư. Vui lòng theo dõi trạng thái đơn trong mục <em>Lịch sử mượn</em>.</li>
                <li>
                    <strong>Thời gian giữ sách:</strong>
                    <ul>
                        <li>Nếu được duyệt sớm: Thư viện sẽ giữ sách cho bạn trong vòng <strong>3 ngày</strong> kể từ "Ngày muốn nhận".</li>
                        <li>Nếu được duyệt trễ (sau ngày hẹn): Thư viện sẽ giữ sách trong vòng <strong>48 giờ</strong> kể từ thời điểm được duyệt.</li>
                    </ul>
                </li>
                <li>Khi đến nhận sách, vui lòng xuất trình thẻ độc giả hoặc mã phiếu mượn trên điện thoại.</li>
              </ol>
            </div>

            <div class="mb-4">
              <h5 class="text-primary fw-bold border-bottom pb-2">
                <font-awesome-icon icon="undo-alt" class="me-2" /> 4. Trả sách và Kỷ luật
              </h5>
              <ul>
                <li>Độc giả mang sách đến quầy để trả. Nhân viên sẽ cập nhật trạng thái thành <em>"Đã trả"</em> trên hệ thống.</li>
                <li><strong>Quá hạn:</strong> Sách trả trễ hạn sẽ bị phạt <strong>5.000đ / ngày / cuốn</strong>.</li>
                <li><strong>Mất/Hỏng sách:</strong> Độc giả phải bồi thường giá trị thực tế của cuốn sách cộng thêm phí xử lý. Đối với các ấn phẩm đặc biệt, sách đặt hàng riêng của Nhà nước, nếu làm mất hoặc hư hỏng, mức bồi thường sẽ được áp dụng theo quy định riêng của Thư viện tại thời điểm xử lý."</li>
                <li>
                    <strong class="text-danger">Vô hiệu hóa tài khoản:</strong>
                    Nếu độc giả trả sách trễ hạn quá <strong>3 lần</strong> trong một năm hoặc làm mất sách không bồi thường, tài khoản sẽ bị <strong>vô hiệu hóa vĩnh viễn</strong> và từ chối phục vụ.
                </li>
              </ul>
            </div>

            <div class="alert alert-info text-center mt-5">
              <strong>Lưu ý:</strong> Mọi thắc mắc vui lòng liên hệ trực tiếp với Thủ thư để được giải đáp.
            </div>

            <div class="text-center mt-4">
              <router-link to="/" class="btn btn-outline-primary">
                <font-awesome-icon icon="home" class="me-2" /> Quay về Trang chủ
              </router-link>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
ul, ol {
  line-height: 1.8;
}
</style>
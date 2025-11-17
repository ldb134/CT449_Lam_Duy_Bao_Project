<template>
  <div class="staff-dashboard">
    <h2 class="mb-4 fw-bold text-primary">
       <font-awesome-icon icon="chart-pie" class="me-2" /> Tổng Quan Hệ Thống
    </h2>
    
    <div class="row mb-4">
      <div class="col-md-4">
        <div class="card text-white bg-primary mb-3 shadow border-0">
          <div class="card-body d-flex justify-content-between align-items-center">
            <div>
              <h5 class="card-title fw-light">Yêu cầu mới</h5>
              <p class="card-text fs-1 fw-bold">5</p>
            </div>
            <font-awesome-icon icon="bell" size="3x" class="opacity-50" />
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card text-white bg-success mb-3 shadow border-0">
          <div class="card-body d-flex justify-content-between align-items-center">
            <div>
               <h5 class="card-title fw-light">Sách trong kho</h5>
               <p class="card-text fs-1 fw-bold">120</p>
            </div>
            <font-awesome-icon icon="book" size="3x" class="opacity-50" />
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card text-white bg-warning mb-3 shadow border-0">
          <div class="card-body d-flex justify-content-between align-items-center">
            <div>
               <h5 class="card-title fw-light">Độc giả</h5>
               <p class="card-text fs-1 fw-bold text-white">45</p>
            </div>
            <font-awesome-icon icon="users" size="3x" class="text-white opacity-50" />
          </div>
        </div>
      </div>
    </div>

    <div class="card shadow-sm border-0">
      <div class="card-header bg-white py-3">
        <h5 class="mb-0 fw-bold text-secondary">
          <font-awesome-icon icon="list-alt" class="me-2" /> Yêu cầu mượn gần đây
        </h5>
      </div>
      <div class="card-body p-0">
         <table class="table table-hover mb-0 align-middle">
           <thead class="table-light">
             <tr>
               <th scope="col" class="ps-4">Mã Phiếu</th>
               <th scope="col">Độc Giả</th>
               <th scope="col">Sách</th>
               <th scope="col">Trạng Thái</th>
               <th scope="col" class="text-center">Hành Động</th>
             </tr>
           </thead>
           <tbody>
             <tr>
               <td class="ps-4 fw-bold">#PM001</td>
               <td>Nguyễn Văn A</td>
               <td>Dế Mèn Phiêu Lưu Ký</td>
               <td><span class="badge bg-warning text-dark">Chờ duyệt</span></td>
               <td class="text-center">
                 <button class="btn btn-sm btn-outline-primary me-2" title="Duyệt">
                    <font-awesome-icon icon="check" />
                 </button>
                 <button class="btn btn-sm btn-outline-danger" title="Từ chối">
                    <font-awesome-icon icon="times" />
                 </button>
               </td>
             </tr>
             <tr>
               <td class="ps-4 fw-bold">#PM002</td>
               <td>Trần Thị B</td>
               <td>Harry Potter</td>
               <td><span class="badge bg-success">Đang mượn</span></td>
               <td class="text-center">
                 <button class="btn btn-sm btn-outline-info" title="Chi tiết">
                    <font-awesome-icon icon="eye" />
                 </button>
               </td>
             </tr>
           </tbody>
         </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
    transition: transform 0.2s;
}
.card:hover {
    transform: translateY(-5px);
}
</style>
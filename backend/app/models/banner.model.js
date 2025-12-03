const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
    tieuDe: String,       // Ví dụ: "Chào mừng tân sinh viên"
    moTa: String,         // Ví dụ: "Giảm giá làm thẻ thư viện..."
    hinhAnh: String,      // Đường dẫn ảnh upload
    lienKet: String,      // Link khi bấm vào (vd: /books/S001)
    kichHoat: { type: Boolean, default: true }, // Ẩn/Hiện
    thuTu: Number         // Để sắp xếp slide nào hiện trước
}, { timestamps: true });

module.exports = mongoose.model('Banner', BannerSchema);
const mongoose = require('mongoose');

const BorrowingSchema = new mongoose.Schema({
    madocgia: { type: String, required: true },
    masach: { type: String, required: true },
    ngayHenLay: { type: Date }, 
    ngayMuon: { type: Date },
    ngayHetHan: { type: Date }, 
    soLanGiaHan: { type: Number, default: 0 },
    ngayTra: { type: Date },
    trangThai: {
        type: String,
        enum: ['Chờ duyệt', 'Đang mượn', 'Đã trả', 'Quá hạn', 'Đã hủy'], 
        default: 'Chờ duyệt' 
    }
}, { timestamps: true });

function formatDate(date) {
    if (!date) return null;
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
}

module.exports = mongoose.model('TheoDoiMuonSach', BorrowingSchema, 'TheoDoiMuonSach');
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    phieuMuonId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'TheoDoiMuonSach', 
        required: true 
    },
    nhanVienId: { type: String, required: true },
    madocgia: { type: String, required: true }, 
    hanhDong: { 
        type: String, 
        enum: ['DUYET', 'TU_CHOI', 'TRA_SACH', 'GIA_HAN'], 
        required: true 
    },
    ghiChu: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('NhatKyGiaoDich', TransactionSchema, 'NhatKyGiaoDich');
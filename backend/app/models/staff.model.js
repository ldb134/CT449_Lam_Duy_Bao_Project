const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
    msnv: { 
        type: String, 
        required: true, 
        unique: true 
    },
    hoTenNV: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    chucVu: {
        type: String,
        required: true
    },
    diaChi: {
        type: String,
    },
    soDienThoai: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model('NhanVien', StaffSchema, 'NhanVien');
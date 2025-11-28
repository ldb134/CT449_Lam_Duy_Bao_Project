const mongoose = require('mongoose');

const ReaderSchema = new mongoose.Schema({
    madocgia: {
        type: String,
        required: true,
        unique: true 
    },
    hoLot: {
        type: String,
    },
    ten: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        sparse: true 
    },
    ngaySinh: {
        type: Date,
    },
    phai: {
        type: String,
    },
    diaChi: {
        type: String,
    },
    dienThoai: {
        type: String,
        unique: true,
        sparse: true 
    },
    trangThai: {
        type: String,
        enum: ['Hoạt động', 'Bị khóa'],
        default: 'Hoạt động'
    },
    soLanTreHan: {
        type: Number,
        default: 0
    },
    password: { 
        type: String, 
    }

}, { timestamps: true });


module.exports = mongoose.model('DocGia', ReaderSchema, 'DocGia');
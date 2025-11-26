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
    password: { 
        type: String, 
    }

}, { timestamps: true });

ReaderSchema.set('toJSON', {
    getters: true, 
    virtuals: true,
    transform: (doc, ret) => {
        delete ret.__v;
        // Che mật khẩu khi trả về
        delete ret.password;
        
        if (ret.ngaySinh) {
            const date = new Date(ret.ngaySinh);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); 
            const year = date.getFullYear();
            ret.ngaySinh = `${day}-${month}-${year}`;
        }
        return ret;
    }
});

module.exports = mongoose.model('DocGia', ReaderSchema, 'DocGia');
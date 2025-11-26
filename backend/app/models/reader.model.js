const mongoose = require('mongoose');

const ReaderSchema = new mongoose.Schema({
    madocgia: {
        type: String,
        required: true,
        unique: true 
    },
    hoLot: {
        type: String,
        // Bỏ required để tránh lỗi nếu tên Google chỉ có 1 chữ
    },
    ten: {
        type: String,
        required: true
    },
    // *** THÊM EMAIL VÀO ĐÂY ***
    email: {
        type: String,
        unique: true,
        sparse: true // Cho phép null (nếu tạo bằng cách thường thì ko có email)
    },
    // **************************
    ngaySinh: {
        type: Date,
        // Bỏ required để update sau
    },
    phai: {
        type: String,
        // Bỏ required
    },
    diaChi: {
        type: String,
        // Bỏ required
    },
    dienThoai: {
        type: String,
        // *** BỎ REQUIRED ***
        unique: true,
        sparse: true // Quan trọng: Cho phép nhiều người cùng không có SĐT (null)
    },
    password: { 
        type: String, 
        // *** BỎ REQUIRED *** (Vì Google login không có pass)
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
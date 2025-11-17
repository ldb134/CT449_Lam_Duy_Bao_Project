const mongoose = require('mongoose');

const ReaderSchema = new mongoose.Schema({
    madocgia: {
        type: String,
        required: true,
        unique: true 
    },
    hoLot: {
        type: String,
        required: true
    },
    ten: {
        type: String,
        required: true
    },
    ngaySinh: {
        type: Date,
        required: true
    },
    phai: {
        type: String,
        required: true
    },
    diaChi: {
        type: String,
        required: true
    },
    dienThoai: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

ReaderSchema.set('toJSON', {
    getters: true, 
    virtuals: true,
    transform: (doc, ret) => {
        delete ret.__v;
        
        // Format lại ngày sinh thành chuỗi dd-mm-yyyy
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
const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    masach: { 
        type: String, 
        required: true, 
        unique: true 
    },
    tenSach: { 
        type: String, 
        required: true 
    },
    donGia: { 
        type: Number, 
        required: true 
    },
    soQuyen: { 
        type: Number, 
        required: true 
    },
    namXuatBan: { 
        type: String, 
        required: true 
    },
    manxb: { 
        type: String, 
        required: true 
    },
    tacGia: { 
        type: String, 
        required: true 
    },
    anh: {
        type: String, 
        default: 'https://fastly.picsum.photos/id/173/200/300.jpg?hmac=9Ed5HxHOL3tFCOiW6UHx6a3hVksxDWc7L7p_WzN9N9Q', // Ảnh test
    },
}, { timestamps: true });

module.exports = mongoose.model('Sach', BookSchema, 'Sach');
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
    }
}, { timestamps: true });

module.exports = mongoose.model('Sach', BookSchema, 'Sach');
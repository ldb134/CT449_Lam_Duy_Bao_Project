const mongoose = require('mongoose');

const PublisherSchema = new mongoose.Schema({
    manxb: { 
        type: String, 
        required: true, 
        unique: true 
    },
    tenNXB: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        trim: true 
    },
    dienThoai: { 
        type: String, 
        trim: true 
    },
    diaChi: { 
        type: String, 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('NhaXuatBan', PublisherSchema, 'NhaXuatBan');
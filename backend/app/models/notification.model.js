const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    madocgia: { type: String, required: true }, 
    tieuDe: { type: String, required: true },
    noiDung: { type: String, required: true },
    loai: { 
        type: String, 
        enum: ['info', 'success', 'warning', 'danger'], 
        default: 'info' 
    },
    daXem: { type: Boolean, default: false } 
}, { timestamps: true });

module.exports = mongoose.model('ThongBao', NotificationSchema, 'ThongBao');
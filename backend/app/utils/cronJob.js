const cron = require('node-cron');
const Reader = require('../models/reader.model');
const Borrowing = require('../models/borrowing.model'); 
const Notification = require('../models/notification.model'); 

const startCronJobs = () => {
    cron.schedule('0 0 1 1 *', async () => {
        console.log('🔄 Đang chạy tác vụ tự động: Reset số lần trễ hạn đầu năm...');
        try {
            await Reader.updateMany({}, { soLanTreHan: 0 });
            console.log('✅ Chúc mừng năm mới! Đã reset toàn bộ lỗi vi phạm về 0.');
        } catch (error) {
            console.error('❌ Lỗi khi chạy cron job reset năm mới:', error);
        }
    }, {
        scheduled: true,
        timezone: "Asia/Ho_Chi_Minh" 
    });

    cron.schedule('0 7 * * *', async () => {
        console.log("🔔 Đang quét sách sắp hết hạn...");
        
        try {
            const borrowings = await Borrowing.find({ trangThai: 'Đang mượn' });
            const homNay = new Date();
            
            for (const item of borrowings) {
                if (!item.ngayHetHan) continue;

                const hanTra = new Date(item.ngayHetHan);
                
                const diffTime = hanTra - homNay;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

                if (diffDays === 1) {
                    await new Notification({
                        madocgia: item.madocgia,
                        tieuDe: "Sắp đến hạn trả sách",
                        noiDung: `Cuốn sách ${item.masach} cần được trả vào ngày mai (${item.ngayHetHan.toLocaleDateString('vi-VN')}). Vui lòng sắp xếp thời gian!`,
                        loai: 'warning'
                    }).save();
                }
            }
            console.log("✅ Đã quét xong nhắc nhở.");
        } catch (error) {
            console.error('❌ Lỗi khi chạy cron job nhắc nhở:', error);
        }
    }, {
        scheduled: true,
        timezone: "Asia/Ho_Chi_Minh"
    });
};

module.exports = startCronJobs;
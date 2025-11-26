const cron = require('node-cron');
const Reader = require('../models/reader.model'); 

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
};

module.exports = startCronJobs;
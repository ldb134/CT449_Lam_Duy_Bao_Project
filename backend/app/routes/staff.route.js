module.exports = (app) => {
    const staffController = require('../controllers/staff.controller');

    const router = require('express').Router();

    // Tạo nhân viên mới
    router.post('/', staffController.create);

    // Lấy tất cả nhân viên
    router.get('/', staffController.findAll);
    
    app.use('/api/staff', router); 
};
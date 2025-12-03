const authMiddleware = require('../middlewares/auth.middleware');

module.exports = (app) => {
    const controller = require('../controllers/notification.controller');
    const router = require('express').Router();

    router.get('/', authMiddleware.verifyToken, controller.getMine);
    router.put('/:id/read', authMiddleware.verifyToken, controller.markAsRead);
    router.put('/read-all', authMiddleware.verifyToken, controller.markAllAsRead);

    app.use('/api/notifications', router);
};
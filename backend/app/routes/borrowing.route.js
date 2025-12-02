const authMiddleware = require('../middlewares/auth.middleware');

module.exports = (app) => {
    const borrowingController = require('../controllers/borrowing.controller');
    const router = require('express').Router();

    router.post('/', borrowingController.create);
    router.put('/:id/approve', authMiddleware.verifyToken, borrowingController.approve); 
    router.put('/:id/return', authMiddleware.verifyToken, borrowingController.returnBook); 
    router.put('/:id/renew', borrowingController.renew);
    router.get('/', authMiddleware.verifyToken, borrowingController.findAll); 
    router.get('/:id', authMiddleware.verifyToken, borrowingController.findOne);
    router.delete('/:id', authMiddleware.verifyToken, borrowingController.delete);

    app.use('/api/borrowing', router);
};
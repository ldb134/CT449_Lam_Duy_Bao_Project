const authMiddleware = require('../middlewares/auth.middleware');

module.exports = (app) => {
    const staffController = require('../controllers/staff.controller');

    const router = require('express').Router();

    router.post('/', [authMiddleware.verifyToken, authMiddleware.isAdmin], staffController.create);
    router.get('/', authMiddleware.verifyToken, staffController.findAll);
    router.get('/:id', authMiddleware.verifyToken, staffController.findOne);
    router.put('/:id', authMiddleware.verifyToken, staffController.update);
    router.delete('/:id', authMiddleware.verifyToken, staffController.delete);
    
    app.use('/api/staff', router); 
};
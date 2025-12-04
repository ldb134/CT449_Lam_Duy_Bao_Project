const authMiddleware = require('../middlewares/auth.middleware');

module.exports = (app) => {
    const transactionController = require('../controllers/transaction.controller');
    const router = require('express').Router();

    router.get('/', authMiddleware.verifyToken, transactionController.findAll);

    app.use('/api/transactions', router);
};
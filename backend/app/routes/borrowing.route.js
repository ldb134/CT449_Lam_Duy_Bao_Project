module.exports = (app) => {
    const borrowingController = require('../controllers/borrowing.controller');
    const router = require('express').Router();

    router.post('/', borrowingController.create);
    router.put('/:id/approve', borrowingController.approve);
    router.put('/:id/return', borrowingController.returnBook);
    router.put('/:id/renew', borrowingController.renew);
    router.get('/', borrowingController.findAll);
    router.get('/:id', borrowingController.findOne);
    router.delete('/:id', borrowingController.delete);

    app.use('/api/borrowing', router);
};
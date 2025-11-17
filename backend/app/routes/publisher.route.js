module.exports = (app) => {
    const publisherController = require('../controllers/publisher.controller');
    const router = require('express').Router();

    router.post('/', publisherController.create);
    router.get('/', publisherController.findAll);
    router.get('/:id', publisherController.findOne);
    router.put('/:id', publisherController.update);
    router.delete('/:id', publisherController.delete);

    app.use('/api/publishers', router);
};
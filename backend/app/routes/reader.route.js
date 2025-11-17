module.exports = (app) => {
    const readerController = require('../controllers/reader.controller');

    const router = require('express').Router();

    router.post('/', readerController.create);
    router.get('/', readerController.findAll);
    router.get('/:id', readerController.findOne);
    router.put('/:id', readerController.update);
    router.delete('/:id', readerController.delete);

    app.use('/api/readers', router); 
};
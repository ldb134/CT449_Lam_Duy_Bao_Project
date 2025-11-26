module.exports = (app) => {
    const bookController = require('../controllers/book.controller');
    const router = require('express').Router();

    router.post('/', bookController.create);
    router.get('/', bookController.findAll);
    router.get('/top-borrowed', bookController.findTopBorrowed);
    router.get('/new', bookController.findNew);
    router.get('/:id', bookController.findOne);
    router.put('/:id', bookController.update);
    router.delete('/:id', bookController.delete);

    app.use('/api/books', router);
};
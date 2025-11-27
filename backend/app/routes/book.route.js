const upload = require('../middlewares/upload'); 

module.exports = (app) => {
    const bookController = require('../controllers/book.controller');
    const router = require('express').Router();

    router.post('/', upload.single('anh'), bookController.create);
    router.get('/', bookController.findAll);
    router.get('/top-borrowed', bookController.findTopBorrowed);
    router.get('/new', bookController.findNew);
    router.get('/:id', bookController.findOne);
    router.put('/:id', upload.single('anh'), bookController.update);
    router.delete('/:id', bookController.delete);

    app.use('/api/books', router);
};
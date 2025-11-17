module.exports = (app) => {
    const staffController = require('../controllers/staff.controller');

    const router = require('express').Router();

    router.post('/', staffController.create);
    router.get('/', staffController.findAll);
    router.get('/:id', staffController.findOne);
    router.put('/:id', staffController.update);
    router.delete('/:id', staffController.delete);
    
    app.use('/api/staff', router); 
};
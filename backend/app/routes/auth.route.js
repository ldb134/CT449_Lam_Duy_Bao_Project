module.exports = (app) => {
    const auth = require('../controllers/auth.controller');
    const router = require('express').Router();

    router.post('/register', auth.registerReader); 
    router.post('/login/reader', auth.loginReader); 
    router.post('/login/staff', auth.loginStaff); 

    app.use('/api/auth', router);
};
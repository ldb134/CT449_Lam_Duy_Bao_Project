const authMiddleware = require('../middlewares/auth.middleware'); 

module.exports = (app) => {
    const auth = require('../controllers/auth.controller');
    const router = require('express').Router();

    router.post('/register', auth.registerReader); 
    router.post('/login/reader', auth.loginReader); 
    router.post('/login/staff', auth.loginStaff); 

    router.post('/change-password', authMiddleware.verifyToken, auth.changePassword);

    router.post('/login/social', auth.loginSocial);

    app.use('/api/auth', router);
};
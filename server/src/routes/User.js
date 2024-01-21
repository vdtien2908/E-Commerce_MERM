const router = require('express').Router();

const AuthController = require('../http/controllers/AuthController');
const { verifyAccessToken } = require('../http/middlewares/verifyToken');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/current-user', verifyAccessToken, AuthController.getCurrent);
router.post('/refreshToken', AuthController.refreshAccessToken);
router.get('/logout', AuthController.logout);
router.get('/forgot-password', AuthController.forgotPassword);
router.put('/reset-password', AuthController.resetPassword);

module.exports = router;

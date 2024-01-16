const router = require('express').Router();

const UserController = require('../http/controllers/UserController');
const { verifyAccessToken } = require('../http/middlewares/verifyToken');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/current-user', verifyAccessToken, UserController.getCurrent);
router.post('/refreshToken', UserController.refreshAccessToken);
router.get('/logout', UserController.logout);

module.exports = router;

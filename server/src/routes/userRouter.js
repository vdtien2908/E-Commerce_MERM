const router = require('express').Router();
const UserController = require('../http/controllers/UserController');
const {
    verifyAccessToken,
    isAdmin,
} = require('../http/middlewares/verifyToken');

router.get('/', [verifyAccessToken, isAdmin], UserController.getUsers);
router.delete('/', [verifyAccessToken, isAdmin], UserController.deleteUser);
router.put('/current', [verifyAccessToken], UserController.updateUser);
router.put('/', [verifyAccessToken, isAdmin], UserController.updateUserByAdmin);

module.exports = router;

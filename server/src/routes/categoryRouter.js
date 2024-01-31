const router = require('express').Router();

const CategoryController = require('../http/controllers/CategoryController');
const {
    isAdmin,
    verifyAccessToken,
} = require('../http/middlewares/verifyToken');

router.post('/', [verifyAccessToken, isAdmin], CategoryController.create);

module.exports = router;
